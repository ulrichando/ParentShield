import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, unauthorized, forbidden, serverError } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { PaginationSchema, parseQuery } from '@/lib/schemas';

export async function GET(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin') return forbidden();

    const { searchParams } = new URL(request.url);
    const pagination = parseQuery(PaginationSchema, {
      page: searchParams.get('page') ?? undefined,
      per_page: searchParams.get('per_page') ?? undefined,
    });
    if (pagination.error) return pagination.error;
    const { page, per_page: perPage } = pagination.data;
    const status = searchParams.get('status') || '';

    const where = {
      ...(status && { status: status as 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete' }),
    };

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.subscription.count({ where }),
    ]);

    const formattedSubscriptions = subscriptions.map((sub) => ({
      id: sub.id,
      status: sub.status,
      plan: sub.plan,
      stripeSubscriptionId: sub.stripeSubscriptionId,
      stripeCustomerId: sub.stripeCustomerId,
      currentPeriodStart: sub.currentPeriodStart?.toISOString() || null,
      currentPeriodEnd: sub.currentPeriodEnd?.toISOString() || null,
      canceledAt: sub.canceledAt?.toISOString() || null,
      createdAt: sub.createdAt.toISOString(),
      user: {
        id: sub.user.id,
        email: sub.user.email,
        name: [sub.user.firstName, sub.user.lastName].filter(Boolean).join(' ') || 'Unknown',
      },
    }));

    return success({
      subscriptions: formattedSubscriptions,
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    });
  } catch (err) {
    logger.error('Get subscriptions failed', { requestId });
    return serverError(requestId);
  }
}
