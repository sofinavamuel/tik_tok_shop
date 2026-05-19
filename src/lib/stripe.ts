import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey && typeof process !== 'undefined') {
  console.warn('⚠️ STRIPE_SECRET_KEY is not set. Stripe will not work.');
}

export const stripe = secretKey
  ? new Stripe(secretKey, {
      apiVersion: '2026-04-22.dahlia' as any,
      typescript: true,
    })
  : null;
