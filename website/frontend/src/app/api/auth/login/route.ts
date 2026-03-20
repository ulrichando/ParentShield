import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { verifyPassword, createAccessToken, createRefreshToken, hashToken } from '@/lib/auth';
import { success, unauthorized, serverError, tooManyRequests } from '@/lib/api-response';
import { sanitizeEmail } from '@/lib/validation';
import { rateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';
import { LoginSchema, parseBody } from '@/lib/schemas';

export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';

  const limit = rateLimit(`login:${ip}`, 10, 60_000);
  if (!limit.allowed) {
    return tooManyRequests(limit.retryAfter ?? 60);
  }

  try {
    const body = await request.json().catch(() => null);
    const parsed = parseBody(LoginSchema, body);
    if (!parsed.ok) return parsed.error;
    const { email, password } = parsed.data;

    const sanitizedEmail = sanitizeEmail(email);

    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!user) {
      return unauthorized('Invalid email or password');
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return unauthorized('Invalid email or password');
    }

    if (!user.isActive) {
      return unauthorized('Account is suspended');
    }

    const accessToken = createAccessToken(user.id, user.email, user.role);
    const refreshToken = createRefreshToken(user.id, user.email, user.role);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const subscription = user.subscriptions[0];

    return success({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      subscription: subscription
        ? {
            id: subscription.id,
            status: subscription.status,
            plan: subscription.plan,
            currentPeriodEnd: subscription.currentPeriodEnd,
          }
        : null,
      accessToken,
      refreshToken,
      tokenType: 'bearer',
    });
  } catch (err) {
    logger.error('Login failed', { requestId, route: '/api/auth/login' });
    return serverError(requestId);
  }
}
