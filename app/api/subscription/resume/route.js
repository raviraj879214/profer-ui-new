// /app/api/subscription/resume/route.js
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { subscriptionId } = await req.json();

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Missing subscriptionId' }, { status: 400 });
    }

    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      pause_collection: null,
    });

    return NextResponse.json({ success: true, subscription: updatedSubscription });
  } catch (err) {
    console.error('Resume error:', err.message);
    return NextResponse.json({ error: 'Failed to resume subscription' }, { status: 500 });
  }
}
