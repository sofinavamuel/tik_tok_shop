import { insforge } from '@/lib/insforge';
import type { Product, Category } from '@/types';

export interface ProductsResult {
  data: Product[] | null;
  count: number;
  error: string | null;
}

export async function getProducts(
  search?: string,
  page: number = 1,
  limit: number = 10,
): Promise<ProductsResult> {
  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = insforge.database
      .from('products')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      return { data: null, count: 0, error: error.message || 'Failed to fetch products' };
    }

    return { data: data as Product[], count: count ?? 0, error: null };
  } catch (err) {
    return {
      data: null,
      count: 0,
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}

export async function getProduct(
  id: string,
): Promise<{ data: Product | null; error: string | null }> {
  try {
    const { data, error } = await insforge.database
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return { data: null, error: error.message || 'Failed to fetch product' };
    }

    return { data: data as Product, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}

export async function getCategories(): Promise<{
  data: Category[] | null;
  error: string | null;
}> {
  try {
    const { data, error } = await insforge.database
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      return { data: null, error: error.message || 'Failed to fetch categories' };
    }

    return { data: data as Category[], error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}

export async function getCategory(
  id: string,
): Promise<{ data: Category | null; error: string | null }> {
  try {
    const { data, error } = await insforge.database
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return { data: null, error: error.message || 'Failed to fetch category' };
    }

    return { data: data as Category, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}

export async function getProductCount(
  categoryId?: string,
): Promise<{ count: number; error: string | null }> {
  try {
    let query = insforge.database
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { count, error } = await query;

    if (error) {
      return { count: 0, error: error.message || 'Failed to count products' };
    }

    return { count: count ?? 0, error: null };
  } catch (err) {
    return {
      count: 0,
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}

export interface CategoryWithCount extends Category {
  product_count: number;
}

export async function getCategoriesWithProductCount(): Promise<{
  data: CategoryWithCount[] | null;
  error: string | null;
}> {
  try {
    // Fetch categories
    const { data: categories, error: catError } = await insforge.database
      .from('categories')
      .select('*')
      .order('name');

    if (catError) {
      return {
        data: null,
        error: catError.message || 'Failed to fetch categories',
      };
    }

    // Fetch product counts per category
    const categoriesData = categories as Category[];
    const categoriesWithCounts: CategoryWithCount[] = [];

    for (const category of categoriesData) {
      const { count } = await insforge.database
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id);

      categoriesWithCounts.push({
        ...category,
        product_count: count ?? 0,
      });
    }

    return { data: categoriesWithCounts, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}

export async function getOrders() {
  try {
    const { data, error } = await insforge.database
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message || 'Failed to fetch orders' };
    }

    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'An unexpected error message occurred',
    };
  }
}
