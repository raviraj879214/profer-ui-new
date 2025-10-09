export const dynamic = 'force-dynamic';

import Stripe from 'stripe';
import { NextResponse } from 'next/server';



export async function GET(req) {
  
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent'],
    });

    let subscription = null;
    let planName = null;
    let isSubscription = false;

    if (session.mode === 'subscription' && session.subscription) {
      subscription = await stripe.subscriptions.retrieve(session.subscription);

      const priceId = subscription?.items?.data?.[0]?.price?.id;
      if (priceId) {
        const price = await stripe.prices.retrieve(priceId);
        const product = await stripe.products.retrieve(price.product);
        planName = product.name;
      }
      isSubscription = true;
    }

    return NextResponse.json({
      session,
      subscription,
      planName,
      isSubscription,
    });
  } catch (err) {
    console.error('Stripe API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
