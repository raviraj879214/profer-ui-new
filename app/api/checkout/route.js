// /api/checkout/route.js
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { priceId } = await req.json();

  const price = await stripe.prices.retrieve(priceId);

  let session;
  if (price.recurring) {
    // recurring -> subscription
    session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_FORNTEND_PUBLIC_URL}/company-profile?paymentIntentId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_FORNTEND_PUBLIC_URL}/cancel`,
    });
  } else {
    // one-time payment
    session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_FORNTEND_PUBLIC_URL}/company-profile?paymentIntentId={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.NEXT_FORNTEND_PUBLIC_URL}/cancel`,
    });
  }

  return NextResponse.json({ url: session.url });
}
