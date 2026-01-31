import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { success, unauthorized, forbidden, serverError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin') return forbidden();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '20');
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
      stripe_subscription_id: sub.stripeSubscriptionId,
      stripe_customer_id: sub.stripeCustomerId,
      current_period_start: sub.currentPeriodStart?.toISOString() || null,
      current_period_end: sub.currentPeriodEnd?.toISOString() || null,
      canceled_at: sub.canceledAt?.toISOString() || null,
      created_at: sub.createdAt.toISOString(),
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
      per_page: perPage,
      total_pages: Math.ceil(total / perPage),
    });
  } catch (err) {
    console.error('Get subscriptions error:', err);
    return serverError();
  }
}
