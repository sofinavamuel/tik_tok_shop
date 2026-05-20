'use server';

import { revalidatePath } from 'next/cache';
import { insforge } from '@/lib/insforge';
import { createCreator, createVideo } from '@/lib/strapi/client';
import type { KalodataProduct, KalodataCreator, KalodataVideoInsight } from '@/lib/kalodata/types';

// ── Import Products to InsForge ──

export async function importProductsToInsforge(products: KalodataProduct[]) {
  try {
    const results = [];
    for (const product of products) {
      const { data, error } = await insforge.database.from('products').insert([
        {
          name: product.name,
          slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
          description: `Trending product from ${product.shop_name} on TikTok Shop`,
          price: product.price,
          category: product.category.toLowerCase(),
          stock: 100,
          active: true,
          // Store Kalodata metadata in a JSON-compatible way
          kalodata_id: product.id,
          kalodata_gmv_30d: product.gmv_30d,
          kalodata_units_sold_30d: product.units_sold_30d,
          kalodata_trend: product.trend,
          kalodata_growth_rate: product.growth_rate,
        },
      ]);

      if (error) {
        console.error(`[Kalodata] Failed to import product "${product.name}":`, error);
        results.push({ id: product.id, name: product.name, status: 'error', error });
      } else {
        results.push({ id: product.id, name: product.name, status: 'success', data });
      }
    }

    revalidatePath('/admin/kalodata');
    revalidatePath('/admin/products');

    return {
      success: true,
      imported: results.filter((r) => r.status === 'success').length,
      failed: results.filter((r) => r.status === 'error').length,
      results,
    };
  } catch (err) {
    return {
      success: false,
      imported: 0,
      failed: 0,
      results: [],
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}

// ── Import Creators to Strapi ──

export async function importCreatorsToStrapi(creators: KalodataCreator[]) {
  try {
    const results = [];
    for (const creator of creators) {
      try {
        await createCreator({
          username: creator.username.replace('@', ''),
          display_name: creator.display_name,
          followers: creator.followers,
          engagement_rate: creator.engagement_rate,
          avg_views: Math.round(creator.followers * (creator.engagement_rate / 100)),
          niche: creator.niche,
          notes: `Imported from Kalodata. Top products: ${creator.top_products.join(', ')}. GMV 30d: $${creator.gmv_30d.toLocaleString()}. Videos: ${creator.video_count}`,
          avatar_url: '',
          tiktok_handle: creator.username,
        });

        results.push({ username: creator.username, status: 'success' });
      } catch (err) {
        console.error(`[Kalodata] Failed to import creator "${creator.username}":`, err);
        results.push({ username: creator.username, status: 'error', error: err instanceof Error ? err.message : 'Unknown error' });
      }
    }

    revalidatePath('/admin/kalodata');
    revalidatePath('/admin/creators');

    return {
      success: true,
      imported: results.filter((r) => r.status === 'success').length,
      failed: results.filter((r) => r.status === 'error').length,
      results,
    };
  } catch (err) {
    return {
      success: false,
      imported: 0,
      failed: 0,
      results: [],
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}

// ── Import Video Insights to Strapi ──

export async function importVideoInsightsToStrapi(videos: KalodataVideoInsight[]) {
  try {
    const results = [];
    for (const video of videos) {
      try {
        await createVideo({
          tiktok_url: video.video_url,
          views: video.views,
          likes: video.likes,
          shares: video.shares,
          comments: Math.round(video.likes * 0.1),
          gmv_attributed: video.gmv_attributed,
          duration_seconds: video.duration_seconds,
          hook_text: video.hook_text,
          transcript: `Structure: ${video.structure}. CTA: ${video.cta_type}. Key patterns: ${video.key_patterns.join(', ')}. Retention: ${video.retention_rate}%`,
          analysis_json: {
            hook_type: video.hook_type,
            structure: video.structure,
            cta_type: video.cta_type,
            retention_rate: video.retention_rate,
            key_patterns: video.key_patterns,
            product: video.product,
            creator: video.creator,
          },
          creator_id: 1,
          product_ids: [],
        });

        results.push({ url: video.video_url, status: 'success' });
      } catch (err) {
        console.error(`[Kalodata] Failed to import video "${video.video_url}":`, err);
        results.push({ url: video.video_url, status: 'error', error: err instanceof Error ? err.message : 'Unknown error' });
      }
    }

    revalidatePath('/admin/kalodata');
    revalidatePath('/admin/videos');

    return {
      success: true,
      imported: results.filter((r) => r.status === 'success').length,
      failed: results.filter((r) => r.status === 'error').length,
      results,
    };
  } catch (err) {
    return {
      success: false,
      imported: 0,
      failed: 0,
      results: [],
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}
