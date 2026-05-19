import { insforge } from '@/lib/insforge';
import type { Category } from '@/types';

export async function fetchCategories(): Promise<{
  data: Category[] | null;
  error: string | null;
}> {
  try {
    const { data, error } = await insforge.database
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      return {
        data: null,
        error: error.message || 'Failed to fetch categories',
      };
    }

    return { data: data as Category[], error: null };
  } catch (err) {
    return {
      data: null,
      error:
        err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}
