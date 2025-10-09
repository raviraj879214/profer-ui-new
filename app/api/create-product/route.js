export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req) {
  try {
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";

    // ✅ Skip gracefully if Stripe key missing (no crash during deploy)
    if (!STRIPE_SECRET_KEY) {
      console.warn("⚠️ Missing STRIPE_SECRET_KEY — skipping Stripe product creation.");
      return NextResponse.json(
        {
          success: false,
          message: "STRIPE_SECRET_KEY not configured. Skipped Stripe API call.",
        },
        { status: 200 }
      );
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY);

    // Parse request body safely
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, message: "Invalid JSON body." }, { status: 400 });
    }

    const { name, description, price, currency, recurring, image } = body;

    if (!name || !price || !currency) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (name, price, currency)." },
        { status: 400 }
      );
    }

    // Convert amount to smallest currency unit
    const unit_amount = Math.round(Number(price) * 100);
    if (isNaN(unit_amount) || unit_amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid price amount." },
        { status: 400 }
      );
    }

    // ✅ Create product
    let product;
    try {
      product = await stripe.products.create({
        name,
        description: description || "",
        images: image ? [image] : [],
      });
    } catch (err) {
      console.warn("⚠️ Stripe product creation failed:", err.message);
      return NextResponse.json(
        { success: false, message: "Stripe product creation failed.", error: err.message },
        { status: 200 }
      );
    }

    // ✅ Create price (recurring or one-time)
    let priceObj;
    try {
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
          recurring: { interval: recurring || "month" },
          product: product.id,
        });
      }
    } catch (err) {
      console.warn("⚠️ Stripe price creation failed:", err.message);
      return NextResponse.json(
        { success: false, message: "Stripe price creation failed.", error: err.message },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        productId: product.id,
        priceId: priceObj.id,
        finalAmountSent: unit_amount,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("⚠️ Unhandled error in Stripe product route:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Unexpected error" },
      { status: 200 }
    );
  }
}
