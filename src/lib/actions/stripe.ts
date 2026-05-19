'use server';

import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import type { CartItem } from '@/types';

export async function createCheckoutSession(items: CartItem[]) {
  try {
    if (!stripe) {
      return { error: 'Stripe is not configured. Add STRIPE_SECRET_KEY to your environment.' };
    }

    const origin = (await headers()).get('origin') || 'http://localhost:3000';

    const line_items = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.product.name,
          images: item.product.images?.length ? [item.product.images[0]] : [],
        },
        unit_amount: Math.round(item.product.price * 100), // cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${origin}/shop/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop/cart`,
      metadata: {
        items: JSON.stringify(
          items.map((i) => ({
            id: i.product.id,
            name: i.product.name,
            qty: i.quantity,
          })),
        ),
      },
    });

    return { url: session.url };
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return { error: 'Failed to create checkout session' };
  }
}

export async function verifyCheckoutSession(sessionId: string) {
  try {
    if (!stripe) {
      return { error: 'Stripe is not configured.' };
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return {
      status: session.payment_status,
      customerEmail: session.customer_details?.email ?? null,
      amountTotal: session.amount_total ?? null,
    };
  } catch (error) {
    console.error('Stripe verification error:', error);
    return { error: 'Failed to verify session' };
  }
}
