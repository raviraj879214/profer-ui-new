export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { name, description, price, currency, recurring, image } = await req.json();

    // Convert admin-entered amount into smallest currency unit
    const unit_amount = parseInt(price, 10) * 100; // ✅ multiply by 100

    // 1. Create product
    const product = await stripe.products.create({
      name,
      description,
      images: image ? [image] : [], // Stripe prefers hosted URLs, not base64
    });

    // 2. Create price
    let priceObj;
    if (recurring === "one_time") {
      priceObj = await stripe.prices.create({
        unit_amount,
        currency,
        product: product.id,
      });
    } else {
      priceObj = await stripe.prices.create({
        unit_amount,
        currency,
        recurring: { interval: recurring },
        product: product.id,
      });
    }

    return NextResponse.json({
      productId: product.id,
      priceId: priceObj.id,
      finalAmountSent: unit_amount, // ✅ return what was actually sent
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
