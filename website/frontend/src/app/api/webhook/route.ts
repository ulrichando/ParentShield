import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/db';

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

function getPlanFromPriceId(priceId: string): 'basic' | 'pro' {
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
    return 'pro';
  }
  return 'basic';
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Missing signature or webhook secret' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.customer_email;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        if (email && subscriptionId) {
          const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
          });

          if (user) {
            const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
            const subData = stripeSubscription as unknown as {
              items: { data: Array<{ price: { id: string } }> };
              current_period_start: number;
              current_period_end: number;
            };
            const priceId = subData.items.data[0]?.price.id;
            const plan = getPlanFromPriceId(priceId);

            await prisma.subscription.updateMany({
              where: { userId: user.id },
              data: { status: 'canceled' },
            });

            await prisma.subscription.create({
              data: {
                userId: user.id,
                status: 'active',
                plan,
                stripeSubscriptionId: subscriptionId,
                stripeCustomerId: customerId,
                currentPeriodStart: new Date(subData.current_period_start * 1000),
                currentPeriodEnd: new Date(subData.current_period_end * 1000),
              },
            });
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const dbSub = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (dbSub) {
          const priceId = subscription.items.data[0]?.price.id;
          const plan = getPlanFromPriceId(priceId);

          await prisma.subscription.update({
            where: { id: dbSub.id },
            data: {
              status: subscription.status === 'active' ? 'active' :
                      subscription.status === 'past_due' ? 'past_due' : 'canceled',
              plan,
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: 'canceled',
            canceledAt: new Date(),
          },
        });
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const subscription = await prisma.subscription.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (subscription) {
          await prisma.transaction.create({
            data: {
              userId: subscription.userId,
              amount: invoice.amount_paid,
              currency: invoice.currency,
              status: 'succeeded',
              stripeInvoiceId: invoice.id,
              description: `Subscription payment - ${subscription.plan} plan`,
            },
          });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: { status: 'past_due' },
          });
        }
        break;
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
  }

  return NextResponse.json({ received: true });
}
