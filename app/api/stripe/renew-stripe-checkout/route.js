export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req) {
  debugger;
  try {
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    const FRONTEND_URL = process.env.NEXT_FORNTEND_PUBLIC_URL || "https://app.profer.com";

    // Log missing Stripe key
    if (!STRIPE_SECRET_KEY) {
      console.log("⚠️ STRIPE_SECRET_KEY not configured — cannot create checkout session.");
      return NextResponse.json(
        { success: false, message: "Stripe key missing. Cannot create checkout session." },
        { status: 200 }
      );
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY);

    // Parse JSON body safely
    let body;
    try {
      body = await req.json();
    } catch (err) {
      console.log("⚠️ Invalid JSON body:", err);
      return NextResponse.json({ success: false, message: "Invalid JSON body." }, { status: 400 });
    }

    const { userId, priceId } = body;

    if (!userId) {
      console.log("⚠️ User ID is required.");
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }
    if (!priceId) {
      console.log("⚠️ Price ID is required.");
      return NextResponse.json({ success: false, error: "Price ID is required" }, { status: 400 });
    }

    // Create checkout session
    let session;
    try {
      session = await stripe.checkout.sessions.create({
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription", // change to "payment" for one-time
        metadata: { userId: String(userId) },
        success_url: `${FRONTEND_URL}/renew-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${FRONTEND_URL}/sign-in`,
      });
    } catch (err) {
      console.log("⚠️ Stripe session creation failed:", err.message);
      return NextResponse.json(
        { success: false, message: "Failed to create Stripe checkout session.", error: err.message },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: true, url: session.url }, { status: 200 });
  } catch (err) {
    console.log("⚠️ Unexpected Stripe route error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Unexpected server error" },
      { status: 500 }
    );
  }
}
