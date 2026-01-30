import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { hashPassword, createAccessToken, createRefreshToken, hashToken, generateToken } from '@/lib/auth';
import { success, error, serverError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    if (!email || !password) {
      return error('Email and password are required');
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return error('Email already registered', 409);
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
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

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return success({
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
    }, 201);
  } catch (err) {
    console.error('Registration error:', err);
    return serverError();
  }
}
