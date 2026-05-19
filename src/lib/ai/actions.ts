'use server';

import { analyzeVideo } from './analyze-video';
import { generateBriefing } from './generate-briefing';
import { insforge } from '@/lib/insforge';
import { createVideo, createBriefing } from '@/lib/strapi/client';
import type { VideoAnalysisInput, VideoAnalysisResult } from './analyze-video';
import type { BriefingInput, BriefingResult } from './generate-briefing';
import type { Product } from '@/types';

export async function analyzeVideoAction(input: VideoAnalysisInput): Promise<VideoAnalysisResult> {
  return analyzeVideo(input);
}

export async function generateBriefingAction(input: BriefingInput): Promise<BriefingResult> {
  return generateBriefing(input);
}

export async function getProductsAction(): Promise<Product[]> {
  const { data, error } = await insforge.database.from('products').select('*');
  if (error) throw new Error(`Failed to fetch products: ${error.message}`);
  return data ?? [];
}

export async function saveAnalysisToStrapiAction(input: {
  tiktokUrl: string;
  analysis: VideoAnalysisResult;
}): Promise<void> {
  await createVideo({
    tiktok_url: input.tiktokUrl,
    views: 0,
    likes: 0,
    analysis_json: input.analysis,
  });
}

export async function saveBriefingToStrapiAction(input: {
  title: string;
  targetAudience: string;
  hookOptions: string[];
  status: 'draft';
}): Promise<void> {
  await createBriefing({
    title: input.title,
    target_audience: input.targetAudience,
    hook_options: input.hookOptions,
    status: input.status,
  });
}
