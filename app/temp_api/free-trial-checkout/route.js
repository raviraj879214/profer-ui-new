export const dynamic = 'force-dynamic';

import Stripe from 'stripe';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
    const FRONTEND_URL = process.env.NEXT_FORNTEND_PUBLIC_URL || "http://localhost:3000";

    // ✅ Skip gracefully if env not set
    if (!STRIPE_SECRET_KEY) {
      console.warn("⚠️ Missing STRIPE_SECRET_KEY — skipping Stripe checkout creation.");
      return NextResponse.json(
        {
          success: false,
          message: "STRIPE_SECRET_KEY not configured. Skipped Stripe session creation.",
        },
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

    const { priceId } = body;

    if (!priceId) {
      return NextResponse.json(
        { success: false, message: "Missing priceId." },
        { status: 400 }
      );
    }

    // ✅ Retrieve price safely
    let price;
    try {
      price = await stripe.prices.retrieve(priceId);
    } catch (err) {
      console.warn("⚠️ Invalid or missing Stripe price:", err.message);
      return NextResponse.json(
        { success: false, message: "Invalid Stripe priceId or key." },
        { status: 200 }
      );
    }

    // ✅ Determine mode
    const isRecurring = !!price?.recurring;
    const mode = isRecurring ? "subscription" : "payment";

    // ✅ Create checkout session
    let session;
    try {
      session = await stripe.checkout.sessions.create({
        mode,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${FRONTEND_URL}/company-profile?paymentIntentId={CHECKOUT_SESSION_ID}`,
        cancel_url: `${FRONTEND_URL}/cancel`,
      });
    } catch (err) {
      console.warn("⚠️ Stripe session creation failed:", err.message);
      return NextResponse.json(
        { success: false, message: "Stripe session creation failed.", error: err.message },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: true, url: session.url }, { status: 200 });
  } catch (err) {
    console.error("⚠️ Unexpected error in checkout route:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Unexpected error" },
      { status: 200 }
    );
  }
}
