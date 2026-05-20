'use server';

import { insforge } from '@/lib/insforge';
import { create, getAll } from '@/lib/strapi/client';
import { revalidatePath } from 'next/cache';

export async function syncProductsToStrapi() {
  try {
    // Fetch ALL products from InsForge
    const { data: products, error } = await insforge.database
      .from('products')
      .select('*');

    if (error) return { error: error.message };

    let synced = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const product of products || []) {
      try {
        // Check if already exists in Strapi by insforge_id
        const existing = await getAll<never>('/products', {
          'filters[insforge_id][$eq]': product.id,
        });

        if (existing.data.length > 0) {
          skipped++;
          continue;
        }

        // Create product in Strapi
        await create<never>('/products', {
          name: product.name,
          slug: product.slug,
          description: product.description || '',
          price: product.price,
          images: product.images || [],
          material: product.material || '',
          origin: product.origin || '',
          in_stock: product.in_stock ?? true,
          insforge_id: product.id,
        });

        synced++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        errors.push(`Failed to sync "${product.name}": ${msg}`);
      }
    }

    revalidatePath('/admin/products');
    return { synced, skipped, errors, error: null };
  } catch (err) {
    console.error('Strapi sync error:', err);
    return { error: 'Failed to sync products to Strapi' };
  }
}
