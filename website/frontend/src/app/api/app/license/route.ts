import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser, getSubscriptionFeatures } from '@/lib/auth';
import { success, unauthorized, serverError } from '@/lib/api-response';
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

export async function GET(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: { in: ['active', 'trialing', 'past_due'] },
      },
      orderBy: { createdAt: 'desc' },
    });

    const plan = subscription?.plan ?? 'free';
    const status = subscription?.status ?? 'none';
    const isLocked = !['active', 'trialing'].includes(status);
    const isExpired =
      subscription?.currentPeriodEnd != null &&
      subscription.currentPeriodEnd < new Date();
    const effectiveStatus = isExpired ? 'expired' : status;
    const rawFeatures = getSubscriptionFeatures(plan);

    logger.info('App license check', { requestId, userId: user.id });
    return success({
      valid: !isLocked && !isExpired,
      plan,
      status: effectiveStatus,
      isLocked: isLocked || isExpired,
      expiresAt: subscription?.currentPeriodEnd?.toISOString() ?? null,
      features: mapFeatures(rawFeatures),
      message: isLocked ? 'Upgrade your plan for full access' : null,
      upgradeUrl: isLocked ? '/pricing' : null,
    });
  } catch (err) {
    logger.error('App license check failed', { requestId });
    return serverError(requestId);
  }
}
