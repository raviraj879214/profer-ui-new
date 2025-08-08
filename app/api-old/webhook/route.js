// app/api/webhook/route.js
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "../../../lib/stripe";

export async function POST(req) {
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      await req.text(),
      (await headers()).get("stripe-signature"),
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return NextResponse.json({ message: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const data = event.data.object;
    console.log(`Payment succeeded for: ${data.id}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
