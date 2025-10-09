export const dynamic = 'force-dynamic';

import Stripe from 'stripe';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

    // ✅ Skip gracefully if Stripe key missing
    if (!STRIPE_SECRET_KEY) {
      console.warn("⚠️ STRIPE_SECRET_KEY not configured — skipping Stripe API");
      return NextResponse.json(
        { success: false, message: "Stripe key missing. Cannot retrieve session." },
        { status: 200 }
      );
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY);

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'Missing session_id' }, { status: 400 });
    }

    // ✅ Retrieve checkout session safely
    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items', 'payment_intent'],
      });
    } catch (err) {
      console.warn("⚠️ Failed to retrieve session:", err.message);
      return NextResponse.json({ success: false, error: "Invalid session_id or Stripe error" }, { status: 200 });
    }

    let subscription = null;
    let planName = null;
    let isSubscription = false;

    if (session.mode === 'subscription' && session.subscription) {
      try {
        subscription = await stripe.subscriptions.retrieve(session.subscription);

        const priceId = subscription?.items?.data?.[0]?.price?.id;
        if (priceId) {
          const price = await stripe.prices.retrieve(priceId);
          const product = await stripe.products.retrieve(price.product);
          planName = product?.name || null;
        }
        isSubscription = true;
      } catch (err) {
        console.warn("⚠️ Failed to retrieve subscription details:", err.message);
      }
    }

    return NextResponse.json({
      success: true,
      session,
      subscription,
      planName,
      isSubscription,
    });
  } catch (err) {
    console.error("❌ Stripe API route error:", err);
    return NextResponse.json({ success: false, error: 'Internal Server Error', details: err.message }, { status: 500 });
  }
}
