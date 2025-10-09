export const dynamic = 'force-dynamic';

import Stripe from 'stripe';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    // ✅ Skip gracefully if key is missing
    if (!secretKey) {
      console.warn('⚠️ STRIPE_SECRET_KEY not found — skipping Stripe fetch');
      return NextResponse.json(
        { warning: 'Stripe secret key missing. No products loaded.' },
        { status: 200 }
      );
    }

    const stripe = new Stripe(secretKey, {
      apiVersion: '2024-06-20',
    });

    const prices = await stripe.prices.list({ expand: ['data.product'] });

    const products = (prices.data || []).map((price) => ({
      id: price.product?.id || 'unknown',
      name: price.product?.name || 'Unnamed Product',
      description: price.product?.description || '',
      image: price.product?.images?.[0] || '',
      unit_amount: price.unit_amount || 0,
      priceId: price.id,
      recurring: price.recurring?.interval || null,
    }));

    return NextResponse.json(products);
  } catch (err) {
    console.error('❌ Stripe API error:', err);
    return NextResponse.json(
      { error: 'Failed to load products', details: err.message },
      { status: 500 }
    );
  }
}
