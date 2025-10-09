export const dynamic = 'force-dynamic';

import Stripe from 'stripe';
import { NextResponse } from 'next/server';


export async function POST(req) {
  try {
    
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { subscriptionId } = await req.json();

    const paused = await stripe.subscriptions.update(subscriptionId, {
      pause_collection: { behavior: 'mark_uncollectible' },
    });

    return NextResponse.json(paused);
  } catch (err) {
    console.error('Pause error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
