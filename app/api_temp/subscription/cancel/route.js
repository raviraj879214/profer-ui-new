export const dynamic = 'force-dynamic';

import Stripe from 'stripe';
import { NextResponse } from 'next/server';


export async function POST(req) {
  try {
    
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { subscriptionId } = await req.json();

    const canceled = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    return NextResponse.json(canceled);
  } catch (err) {
    console.error('Cancel error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
