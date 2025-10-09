export const dynamic = 'force-dynamic';

import Stripe from 'stripe';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

    // ✅ Skip gracefully if key is missing
    if (!STRIPE_SECRET_KEY) {
      console.warn("⚠️ STRIPE_SECRET_KEY not configured — skipping subscription pause.");
      return NextResponse.json(
        { success: false, message: "Stripe key missing. Cannot pause subscription." },
        { status: 200 }
      );
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY);

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body." },
        { status: 400 }
      );
    }

    const { subscriptionId } = body;
    if (!subscriptionId) {
      return NextResponse.json(
        { success: false, message: "Missing subscriptionId." },
        { status: 400 }
      );
    }

    let paused;
    try {
      paused = await stripe.subscriptions.update(subscriptionId, {
        pause_collection: { behavior: 'mark_uncollectible' },
      });
    } catch (err) {
      console.warn("⚠️ Failed to pause subscription:", err.message);
      return NextResponse.json(
        { success: false, message: "Failed to pause subscription.", error: err.message },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: true, paused });
  } catch (err) {
    console.error("❌ Unexpected error in subscription pause route:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
