export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, priceId } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    if (!priceId) {
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 });
    }
    

    const session = await stripe.checkout.sessions.create({
    
      line_items: [
        {
          price: priceId, // must be a valid Stripe price_xxx
          quantity: 1,
        },
      ],
      mode: "subscription", // or "payment" for one-time
      metadata: { userId: String(userId) }, // ensure string
      success_url: `${process.env.NEXT_FORNTEND_PUBLIC_URL}/renew-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_FORNTEND_PUBLIC_URL}/sign-in`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
}
