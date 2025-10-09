export const dynamic = 'force-dynamic';

// app/api/stripe-price/route.js
import Stripe from "stripe";
import { getStripeActivePlan } from "../../../lib/stripeactiveplan/store";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(request) {
  try {
    const priceid= await getStripeActivePlan();
    const price = await stripe.prices.retrieve(`${priceid}`);

    return new Response(
      JSON.stringify({
        id: price.id,
        currency: price.currency,
        unit_amount: price.unit_amount, // Amount in cents
        amount: price.unit_amount / 100, // Convert to actual currency
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
