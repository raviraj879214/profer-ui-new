export const dynamic = 'force-dynamic';

// app/api/stripe-price/route.js
import Stripe from "stripe";
import { getStripeActivePlan } from "../../../lib/stripeactiveplan/store";

export async function GET(request) {
  try {
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

    // ✅ Skip gracefully if key is missing
    if (!STRIPE_SECRET_KEY) {
      console.warn("⚠️ STRIPE_SECRET_KEY not configured — skipping price retrieval.");
      return new Response(
        JSON.stringify({ success: false, message: "Stripe key missing. No price fetched." }),
        { status: 200 }
      );
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

    // ✅ Get active plan safely
    let priceId;
    try {
      priceId = await getStripeActivePlan();
      if (!priceId) throw new Error("No active plan found.");
    } catch (err) {
      console.warn("⚠️ Failed to get active plan:", err.message);
      return new Response(
        JSON.stringify({ success: false, message: "Failed to retrieve active plan.", error: err.message }),
        { status: 200 }
      );
    }

    // ✅ Retrieve Stripe price
    let price;
    try {
      price = await stripe.prices.retrieve(String(priceId));
    } catch (err) {
      console.warn("⚠️ Failed to retrieve Stripe price:", err.message);
      return new Response(
        JSON.stringify({ success: false, message: "Failed to retrieve Stripe price.", error: err.message }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        id: price.id,
        currency: price.currency,
        unit_amount: price.unit_amount,      // amount in cents
        amount: price.unit_amount / 100,     // actual currency
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Unexpected error in stripe-price route:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error", details: err.message }),
      { status: 500 }
    );
  }
}
