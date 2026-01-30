import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser, getSubscriptionFeatures } from '@/lib/auth';
import { success, unauthorized, serverError } from '@/lib/api-response';
import Stripe from 'stripe';

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return unauthorized();
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: { in: ['active', 'trialing', 'past_due'] },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      return success({
        status: 'none',
        plan: 'free',
        features: getSubscriptionFeatures('free'),
      });
    }

    const isExpired = subscription.currentPeriodEnd &&
                      subscription.currentPeriodEnd < new Date();

    return success({
      id: subscription.id,
      status: isExpired ? 'expired' : subscription.status,
      plan: subscription.plan,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      canceledAt: subscription.canceledAt,
      features: getSubscriptionFeatures(subscription.plan),
    });
  } catch (err) {
    console.error('Get subscription error:', err);
    return serverError();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return unauthorized();
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: 'active',
        stripeSubscriptionId: { not: null },
      },
    });

    if (!subscription?.stripeSubscriptionId) {
      return success({ message: 'No active subscription to cancel' });
    }

    const stripe = getStripe();
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { canceledAt: new Date() },
    });

    return success({ message: 'Subscription will be canceled at period end' });
  } catch (err) {
    console.error('Cancel subscription error:', err);
    return serverError();
  }
}
