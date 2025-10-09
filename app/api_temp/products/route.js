export const dynamic = 'force-dynamic';

import Stripe from 'stripe';
import { NextResponse } from 'next/server';



export async function GET() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const prices = await stripe.prices.list({ expand: ['data.product'] });

    const products = prices.data.map((price) => ({
      id: price.product.id,
      name: price.product.name,
      description: price.product.description,
      image: price.product.images?.[0] || '',
      unit_amount: price.unit_amount,
      priceId: price.id,
      recurring: price.recurring?.interval || null,
    }));

    return NextResponse.json(products);
  } catch (err) {
    console.error('Stripe error:', err);
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
  }
}
