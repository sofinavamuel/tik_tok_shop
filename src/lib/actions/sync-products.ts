'use server';

import { stripe } from '@/lib/stripe';
import { insforge } from '@/lib/insforge';
import { revalidatePath } from 'next/cache';

export async function syncProductsToStripe() {
  if (!stripe) return { error: 'Stripe not configured' };

  try {
    // Fetch all products from InsForge
    const { data: products, error } = await insforge.database
      .from('products')
      .select('*');

    if (error) return { error: error.message };

    let synced = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const product of products || []) {
      try {
        // Check if already synced (look for existing Stripe product by metadata)
        const existing = await stripe.products.search({
          query: `metadata['insforge_id']:'${product.id}'`,
        });

        if (existing.data.length > 0) {
          skipped++;
          continue;
        }

        // Create Stripe product
        const stripeProduct = await stripe.products.create({
          name: product.name,
          description: product.description || '',
          images: product.images?.length ? [product.images[0]] : [],
          metadata: {
            insforge_id: product.id,
            material: product.material || '',
            origin: product.origin || '',
          },
        });

        // Create Stripe price
        const stripePrice = await stripe.prices.create({
          product: stripeProduct.id,
          unit_amount: Math.round(product.price * 100),
          currency: 'eur',
          metadata: {
            insforge_id: product.id,
          },
        });

        // Update InsForge product with Stripe price ID
        await insforge.database
          .from('products')
          .update({ stripe_price_id: stripePrice.id })
          .eq('id', product.id);

        synced++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        errors.push(`Failed to sync "${product.name}": ${msg}`);
      }
    }

    revalidatePath('/admin/products');
    return { synced, skipped, errors, error: null };
  } catch (err) {
    console.error('Stripe sync error:', err);
    return { error: 'Failed to sync products to Stripe' };
  }
}
