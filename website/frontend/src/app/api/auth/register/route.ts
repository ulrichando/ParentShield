import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { hashPassword, createAccessToken, createRefreshToken, hashToken } from '@/lib/auth';
import { success, error, serverError, tooManyRequests } from '@/lib/api-response';
import { sanitizeEmail, sanitizeString } from '@/lib/validation';
import { rateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';
import { RegisterSchema, parseBody } from '@/lib/schemas';

export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';

  const limit = rateLimit(`register:${ip}`, 5, 60_000);
  if (!limit.allowed) {
    return tooManyRequests(limit.retryAfter ?? 60);
  }

  try {
    const body = await request.json().catch(() => null);
    const parsed = parseBody(RegisterSchema, body);
    if (!parsed.ok) return parsed.error;
    const { email, password, firstName, lastName } = parsed.data;

    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedFirstName = sanitizeString(firstName);
    const sanitizedLastName = sanitizeString(lastName);

    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (existingUser) {
      return error('Email already registered', 409);
    }

    const passwordHash = await hashPassword(password);

    const { user, accessToken, refreshToken } = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: sanitizedEmail,
          passwordHash,
          firstName: sanitizedFirstName,
          lastName: sanitizedLastName,
          isVerified: true,
          subscriptions: {
            create: {
              status: 'trialing',
              plan: 'free',
              currentPeriodStart: new Date(),
              currentPeriodEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          },
          settings: {
            create: {},
          },
        },
      });

      const accessToken = createAccessToken(user.id, user.email, user.role);
      const refreshToken = createRefreshToken(user.id, user.email, user.role);

      await tx.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash: hashToken(refreshToken),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return { user, accessToken, refreshToken };
    });

    return success(
      {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        accessToken,
        refreshToken,
        tokenType: 'bearer',
      },
      201
    );
  } catch (err) {
    logger.error('Registration failed', { requestId, route: '/api/auth/register' });
    return serverError(requestId);
  }
}
