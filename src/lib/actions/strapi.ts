'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  createMarket,
  updateMarket,
  deleteMarket,
  createCreator,
  updateCreator,
  deleteCreator,
  updateVideo,
  createBriefing,
  updateBriefing,
  deleteBriefing,
  getVideo,
  getBriefing,
} from '@/lib/strapi/client';
import { analyzeVideo } from '@/lib/ai/analyze-video';
import { generateBriefing } from '@/lib/ai/generate-briefing';
import { insforge } from '@/lib/insforge';

// ── Schemas ──

const marketSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  currency: z.string().min(1, 'Currency is required'),
  language: z.string().min(1, 'Language is required'),
  tiktok_shop_active: z.boolean().default(false),
  gmv_total: z.coerce.number().default(0),
  growth_rate: z.coerce.number().default(0),
  saturation_score: z.coerce.number().default(0),
});

const creatorSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  display_name: z.string().min(1, 'Display name is required'),
  followers: z.coerce.number().default(0),
  engagement_rate: z.coerce.number().default(0),
  avg_views: z.coerce.number().default(0),
  niche: z.string().min(1, 'Niche is required'),
  notes: z.string().optional().default(''),
  avatar_url: z.string().optional().default(''),
  tiktok_handle: z.string().optional().default(''),
});

const briefingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  target_audience: z.string().min(1, 'Target audience is required'),
  status: z.enum(['draft', 'approved', 'produced']).default('draft'),
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

// ── Markets ──

export async function createMarketAction(formData: FormData) {
  try {
    const raw = parseFormData(formData);
    if (!raw.slug && raw.name) {
      raw.slug = slugify(raw.name as string);
    }
    const validated = marketSchema.parse(raw);

    await createMarket({
      name: validated.name,
      slug: validated.slug,
      currency: validated.currency,
      language: validated.language,
      tiktok_shop_active: validated.tiktok_shop_active,
      gmv_total: validated.gmv_total,
      growth_rate: validated.growth_rate,
      saturation_score: validated.saturation_score,
    });

    revalidatePath('/admin/markets');
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

export async function updateMarketAction(id: number, formData: FormData) {
  try {
    const raw = parseFormData(formData);
    if (!raw.slug && raw.name) {
      raw.slug = slugify(raw.name as string);
    }
    const validated = marketSchema.parse(raw);

    await updateMarket(id, {
      name: validated.name,
      slug: validated.slug,
      currency: validated.currency,
      language: validated.language,
      tiktok_shop_active: validated.tiktok_shop_active,
      gmv_total: validated.gmv_total,
      growth_rate: validated.growth_rate,
      saturation_score: validated.saturation_score,
    });

    revalidatePath('/admin/markets');
    revalidatePath(`/admin/markets/${id}`);
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

export async function deleteMarketAction(id: number) {
  try {
    await deleteMarket(id);
    revalidatePath('/admin/markets');
    return { success: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}

// ── Creators ──

export async function createCreatorAction(formData: FormData) {
  try {
    const raw = parseFormData(formData);
    const validated = creatorSchema.parse(raw);

    await createCreator({
      username: validated.username,
      display_name: validated.display_name,
      followers: validated.followers,
      engagement_rate: validated.engagement_rate,
      avg_views: validated.avg_views,
      niche: validated.niche,
      notes: validated.notes,
      avatar_url: validated.avatar_url,
      tiktok_handle: validated.tiktok_handle,
    });

    revalidatePath('/admin/creators');
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

export async function updateCreatorAction(id: number, formData: FormData) {
  try {
    const raw = parseFormData(formData);
    const validated = creatorSchema.parse(raw);

    await updateCreator(id, {
      username: validated.username,
      display_name: validated.display_name,
      followers: validated.followers,
      engagement_rate: validated.engagement_rate,
      avg_views: validated.avg_views,
      niche: validated.niche,
      notes: validated.notes,
      avatar_url: validated.avatar_url,
      tiktok_handle: validated.tiktok_handle,
    });

    revalidatePath('/admin/creators');
    revalidatePath(`/admin/creators/${id}`);
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

export async function deleteCreatorAction(id: number) {
  try {
    await deleteCreator(id);
    revalidatePath('/admin/creators');
    return { success: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}

// ── Video AI Analysis ──

export async function analyzeVideoAction(id: number) {
  try {
    const videoRes = await getVideo(id);
    const video = videoRes.data;

    if (!video) {
      return { error: 'Video not found' };
    }

    const analysis = await analyzeVideo({
      title: video.hook_text || `Video #${video.id}`,
      description: video.transcript || '',
      duration: video.duration_seconds,
    });

    await updateVideo(id, {
      analysis_json: analysis,
    });

    revalidatePath('/admin/videos');
    revalidatePath(`/admin/videos/${id}`);
    return { success: true, data: analysis };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}

// ── Briefing AI Generation ──

export async function generateBriefingAction(productId?: string) {
  try {
    let product: any = null;

    if (productId) {
      const { data } = await insforge.database
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      product = data;
    }

    if (!product) {
      // Get first product as fallback
      const { data } = await insforge.database
        .from('products')
        .select('*')
        .limit(1);
      product = data?.[0];
    }

    if (!product) {
      return { error: 'No products found. Add a product first.' };
    }

    const briefing = await generateBriefing({
      product,
      targetAudience: 'TikTok shoppers',
      market: 'General',
    });

    await createBriefing({
      title: briefing.title,
      target_audience: 'TikTok shoppers',
      hook_options: briefing.hookOptions,
      script: JSON.stringify(briefing.script),
      shotlist: briefing.shotlist,
      status: 'draft',
      ai_generated: true,
    });

    revalidatePath('/admin/briefings');
    return { success: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}

export async function regenerateBriefingAction(id: number) {
  try {
    const briefingRes = await getBriefing(id);
    const briefing = briefingRes.data;

    if (!briefing) {
      return { error: 'Briefing not found' };
    }

    // Get first product for regeneration
    const { data } = await insforge.database
      .from('products')
      .select('*')
      .limit(1);
    const product = data?.[0];

    if (!product) {
      return { error: 'No products found. Add a product first.' };
    }

    const newBriefing = await generateBriefing({
      product,
      targetAudience: briefing.target_audience || 'TikTok shoppers',
      market: 'General',
    });

    await updateBriefing(id, {
      title: newBriefing.title,
      hook_options: newBriefing.hookOptions,
      script: JSON.stringify(newBriefing.script),
      shotlist: newBriefing.shotlist,
      ai_generated: true,
    });

    revalidatePath('/admin/briefings');
    revalidatePath(`/admin/briefings/${id}`);
    return { success: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}

export async function updateBriefingAction(id: number, formData: FormData) {
  try {
    const raw = parseFormData(formData);
    const validated = briefingSchema.parse(raw);

    await updateBriefing(id, {
      title: validated.title,
      target_audience: validated.target_audience,
      status: validated.status,
    });

    revalidatePath('/admin/briefings');
    revalidatePath(`/admin/briefings/${id}`);
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

export async function deleteBriefingAction(id: number) {
  try {
    await deleteBriefing(id);
    revalidatePath('/admin/briefings');
    return { success: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}
