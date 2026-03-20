import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import {
  verifyPassword,
  createAccessToken,
  createRefreshToken,
  hashToken,
  getSubscriptionFeatures,
} from '@/lib/auth';
import { success, unauthorized, serverError, tooManyRequests } from '@/lib/api-response';
import { sanitizeEmail } from '@/lib/validation';
import { rateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

function mapFeatures(features: Record<string, boolean | number>) {
  return {
    websiteBlocking: features.webFiltering ?? false,
    gameBlocking: features.appBlocking ?? false,
    maxBlocks: features.appBlocking ? 1000 : 5,
    webDashboard: true,
    activityReports: features.activityReports ?? false,
    schedules: features.screenTimeManagement ?? false,
    tamperProtection: features.prioritySupport ? 'strict' : null,
  };
}

export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';

  const limit = rateLimit(`app-login:${ip}`, 5, 60_000);
  if (!limit.allowed) return tooManyRequests(limit.retryAfter ?? 60);

  try {
    const body = await request.json().catch(() => null);
    if (!body?.email || !body?.password) return unauthorized('Missing credentials');

    const sanitizedEmail = sanitizeEmail(body.email);
    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
      include: {
        subscriptions: {
          where: { status: { in: ['active', 'trialing', 'past_due'] } },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      return unauthorized('Invalid email or password');
    }
    if (!user.isActive) return unauthorized('Account is suspended');

    const subscription = user.subscriptions[0] ?? null;
    const plan = subscription?.plan ?? 'free';
    const status = subscription?.status ?? 'none';
    const isLocked = !['active', 'trialing'].includes(status);

    const accessToken = createAccessToken(user.id, user.email, user.role);
    const refreshToken = createRefreshToken(user.id, user.email, user.role);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const rawFeatures = getSubscriptionFeatures(plan);

    logger.info('App login success', { requestId, userId: user.id });
    return success({
      success: true,
      accessToken,
      userId: user.id,
      plan,
      status,
      isLocked,
      features: mapFeatures(rawFeatures),
      message: isLocked ? 'Upgrade your plan for full access' : null,
      upgradeUrl: isLocked ? '/pricing' : null,
    });
  } catch (err) {
    logger.error('App login failed', { requestId });
    return serverError(requestId);
  }
}
