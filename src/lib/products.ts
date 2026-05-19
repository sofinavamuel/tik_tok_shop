import { insforge } from '@/lib/insforge';
import type { Product } from '@/types';

export async function fetchProducts(params?: {
  categoryId?: string;
  featured?: boolean;
  limit?: number;
}): Promise<{ data: Product[] | null; error: string | null }> {
  try {
    let query = insforge.database.from('products').select('*');

    if (params?.categoryId) {
      query = query.eq('category_id', params.categoryId);
    }
    if (params?.featured !== undefined) {
      query = query.eq('featured', params.featured);
    }
    if (params?.limit) {
      query = query.limit(params.limit);
    }

    const { data, error } = await query;

    if (error) {
      return { data: null, error: error.message || 'Failed to fetch products' };
    }

    return { data: data as Product[], error: null };
  } catch (err) {
    return {
      data: null,
      error:
        err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}

export async function fetchProductBySlug(
  slug: string,
): Promise<{ data: Product | null; error: string | null }> {
  try {
    const { data, error } = await insforge.database
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      return {
        data: null,
        error: error.message || 'Failed to fetch product',
      };
    }

    if (!data) {
      return { data: null, error: 'Product not found' };
    }

    return { data: data as Product, error: null };
  } catch (err) {
    return {
      data: null,
      error:
        err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}
