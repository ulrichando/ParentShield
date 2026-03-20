import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { logger } from '@/lib/logger';
import { z } from 'zod';
import { parseBody } from '@/lib/schemas';

const CheckoutSchema = z.object({
  priceId: z.string().optional(),
  customerEmail: z.string().email().max(255).optional(),
  plan: z.enum(['basic', 'pro']).optional(),
});

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? undefined;
  const stripe = getStripe();
  try {
    const body = await request.json().catch(() => null);
    const parsed = parseBody(CheckoutSchema, body);
    if (!parsed.ok) return parsed.error;
    const { priceId, customerEmail, plan } = parsed.data;

    const selectedPriceId =
      priceId ||
      (plan === 'basic' ? process.env.STRIPE_BASIC_PRICE_ID : process.env.STRIPE_PRO_PRICE_ID);

    if (!selectedPriceId) {
      return NextResponse.json({ error: 'No price configured for this plan' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: selectedPriceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin}/pricing`,
      customer_email: customerEmail,
      metadata: {
        plan: plan || 'pro',
        app: 'parentshield',
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    logger.error('Checkout session failed', { requestId, route: '/api/create-checkout-session' });
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
