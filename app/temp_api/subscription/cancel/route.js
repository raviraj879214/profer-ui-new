export const dynamic = 'force-dynamic';

import Stripe from 'stripe';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

    // ✅ Skip gracefully if key is missing
    if (!STRIPE_SECRET_KEY) {
      console.warn("⚠️ STRIPE_SECRET_KEY not configured — skipping subscription cancel.");
      return NextResponse.json(
        { success: false, message: "Stripe key missing. Cannot cancel subscription." },
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

    let canceled;
    try {
      canceled = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    } catch (err) {
      console.warn("⚠️ Failed to cancel subscription:", err.message);
      return NextResponse.json(
        { success: false, message: "Failed to cancel subscription.", error: err.message },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: true, canceled });
  } catch (err) {
    console.error("❌ Unexpected error in subscription cancel route:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
