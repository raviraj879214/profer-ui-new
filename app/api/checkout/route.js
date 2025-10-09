export const dynamic = 'force-dynamic';

import Stripe from 'stripe';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
    const FRONTEND_URL = process.env.NEXT_FRONTEND_PUBLIC_URL || "http://localhost:3000";

    // ✅ Gracefully skip if Stripe key missing
    if (!STRIPE_SECRET_KEY) {
      console.warn("⚠️ Missing STRIPE_SECRET_KEY — skipping Stripe checkout session creation.");
      return NextResponse.json(
        {
          success: false,
          message: "STRIPE_SECRET_KEY not configured. Skipped Stripe session creation.",
        },
        { status: 200 }
      );
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY);
    const { priceId } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
    }

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

    const isRecurring = !!price?.recurring;
    const session = await stripe.checkout.sessions.create({
      mode: isRecurring ? "subscription" : "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${FRONTEND_URL}/company-profile?paymentIntentId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/cancel`,
    });

    return NextResponse.json({ success: true, url: session.url }, { status: 200 });
  } catch (err) {
    console.error("⚠️ Error creating Stripe session:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Unexpected error" },
      { status: 200 }
    );
  }
}
