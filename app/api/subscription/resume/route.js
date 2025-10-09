export const dynamic = 'force-dynamic';

// /app/api/subscription/resume/route.js
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

    // ✅ Skip gracefully if key is missing
    if (!STRIPE_SECRET_KEY) {
      console.warn("⚠️ STRIPE_SECRET_KEY not configured — skipping subscription resume.");
      return NextResponse.json(
        { success: false, message: "Stripe key missing. Cannot resume subscription." },
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

    let updatedSubscription;
    try {
      updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        pause_collection: null,
      });
    } catch (err) {
      console.warn("⚠️ Failed to resume subscription:", err.message);
      return NextResponse.json(
        { success: false, message: "Failed to resume subscription.", error: err.message },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: true, subscription: updatedSubscription });
  } catch (err) {
    console.error("❌ Unexpected error in subscription resume route:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
