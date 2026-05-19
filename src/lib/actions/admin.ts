'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { insforge } from '@/lib/insforge';

// ── Schemas ──

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  price: z.coerce.number().positive('Price must be positive'),
  category_id: z.string().optional(),
  material: z.string().optional(),
  origin: z.string().optional(),
  in_stock: z
    .string()
    .optional()
    .transform((v) => v === 'on'),
  image_url: z.string().optional(),
});

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  image_url: z.string().optional(),
});

// ── Helpers ──

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseFormData(formData: FormData): Record<string, FormDataEntryValue | null> {
  const obj: Record<string, FormDataEntryValue | null> = {};
  for (const key of formData.keys()) {
    obj[key] = formData.get(key);
  }
  return obj;
}

// ── Products ──

export async function createProduct(formData: FormData) {
  try {
    const raw = parseFormData(formData);

    // Auto-generate slug from name if not provided
    if (!raw.slug && raw.name) {
      raw.slug = slugify(raw.name as string);
    }

    const validated = productSchema.parse(raw);

    const insertData: Record<string, unknown> = {
      name: validated.name,
      slug: validated.slug,
      description: validated.description || null,
      price: validated.price,
      category_id: validated.category_id || null,
      material: validated.material || null,
      origin: validated.origin || null,
      in_stock: validated.in_stock,
    };

    // Handle image URL
    if (validated.image_url) {
      insertData.images = [validated.image_url];
    } else {
      insertData.images = [];
    }

    const { error } = await insforge.database
      .from('products')
      .insert([insertData])
      .select();

    if (error) {
      return { error: error.message || 'Failed to create product' };
    }

    revalidatePath('/admin/products');
    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { error: err.issues.map((e: { message: string }) => e.message).join(', ') };
    }
    return {
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const raw = parseFormData(formData);

    // Auto-generate slug from name if not provided
    if (!raw.slug && raw.name) {
      raw.slug = slugify(raw.name as string);
    }

    const validated = productSchema.parse(raw);

    const updateData: Record<string, unknown> = {
      name: validated.name,
      slug: validated.slug,
      description: validated.description || null,
      price: validated.price,
      category_id: validated.category_id || null,
      material: validated.material || null,
      origin: validated.origin || null,
      in_stock: validated.in_stock,
    };

    // Handle image URL
    if (validated.image_url) {
      updateData.images = [validated.image_url];
    } else {
      updateData.images = [];
    }

    const { error } = await insforge.database
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      return { error: error.message || 'Failed to update product' };
    }

    revalidatePath('/admin/products');
    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { error: err.issues.map((e: { message: string }) => e.message).join(', ') };
    }
    return {
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}

export async function deleteProduct(id: string) {
  try {
    const { error } = await insforge.database
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      return { error: error.message || 'Failed to delete product' };
    }

    revalidatePath('/admin/products');
    return { success: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}

// ── Categories ──

export async function createCategory(formData: FormData) {
  try {
    const raw = parseFormData(formData);

    // Auto-generate slug from name if not provided
    if (!raw.slug && raw.name) {
      raw.slug = slugify(raw.name as string);
    }

    const validated = categorySchema.parse(raw);

    const { error } = await insforge.database
      .from('categories')
      .insert([
        {
          name: validated.name,
          slug: validated.slug,
          description: validated.description || null,
          image_url: validated.image_url || null,
        },
      ])
      .select();

    if (error) {
      return { error: error.message || 'Failed to create category' };
    }

    revalidatePath('/admin/categories');
    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { error: err.issues.map((e: { message: string }) => e.message).join(', ') };
    }
    return {
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}

export async function updateCategory(id: string, formData: FormData) {
  try {
    const raw = parseFormData(formData);

    // Auto-generate slug from name if not provided
    if (!raw.slug && raw.name) {
      raw.slug = slugify(raw.name as string);
    }

    const validated = categorySchema.parse(raw);

    const { error } = await insforge.database
      .from('categories')
      .update({
        name: validated.name,
        slug: validated.slug,
        description: validated.description || null,
        image_url: validated.image_url || null,
      })
      .eq('id', id)
      .select();

    if (error) {
      return { error: error.message || 'Failed to update category' };
    }

    revalidatePath('/admin/categories');
    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { error: err.issues.map((e: { message: string }) => e.message).join(', ') };
    }
    return {
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}

export async function deleteCategory(id: string) {
  try {
    // Safety check: count products referencing this category
    const { count, error: countError } = await insforge.database
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id);

    if (countError) {
      return { error: countError.message || 'Failed to check product count' };
    }

    if (count && count > 0) {
      return {
        error: `Cannot delete category with ${count} product${count === 1 ? '' : 's'}. Remove products first.`,
      };
    }

    const { error } = await insforge.database
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      return { error: error.message || 'Failed to delete category' };
    }

    revalidatePath('/admin/categories');
    return { success: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}
