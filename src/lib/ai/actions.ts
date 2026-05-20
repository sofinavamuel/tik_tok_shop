'use server';

import { analyzeVideo } from './analyze-video';
import { generateBriefing } from './generate-briefing';
import { generateContentIdeas } from './generate-content-ideas';
import { insforge } from '@/lib/insforge';
import { createVideo, createBriefing } from '@/lib/strapi/client';
import type { VideoAnalysisInput, VideoAnalysisResult } from './analyze-video';
import type { BriefingInput, BriefingResult } from './generate-briefing';
import type { ContentIdeaInput, ContentIdeasResult } from './generate-content-ideas';
import type { Product } from '@/types';

export async function analyzeVideoAction(input: VideoAnalysisInput): Promise<VideoAnalysisResult> {
  return analyzeVideo(input);
}

export async function generateBriefingAction(input: BriefingInput): Promise<BriefingResult> {
  return generateBriefing(input);
}

export async function generateContentIdeasAction(input: ContentIdeaInput): Promise<ContentIdeasResult> {
  return generateContentIdeas(input);
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

export async function saveContentIdeasAction(input: {
  result: ContentIdeasResult;
  productName: string;
  productCategory: string;
  brandName?: string;
  targetMarket?: string;
  contentGoal?: string;
}): Promise<{ saved: number }> {
  const rows = input.result.ideas.map((idea) => ({
    title: idea.title,
    angle: idea.angle,
    hook_options: idea.hookOptions,
    recommended_hook: idea.recommendedHook,
    hook_type: idea.hookType,
    script: idea.script,
    structure: idea.structure,
    visual_style: idea.visualStyle,
    audio_direction: idea.audioDirection,
    duration: idea.duration,
    cta: idea.cta,
    why_it_works: idea.whyItWorks,
    adapted_from: idea.adaptedFrom,
    confidence_score: idea.confidenceScore,
    product_name: input.productName,
    product_category: input.productCategory,
    brand_name: input.brandName || null,
    target_market: input.targetMarket || null,
    content_goal: input.contentGoal || null,
    market_insights: input.result.marketInsights,
    winning_patterns: input.result.winningPatterns,
    product_summary: input.result.productSummary,
    recommended_approach: input.result.recommendedApproach,
  }));

  const { error } = await insforge.database.from('content_ideas').insert(rows);
  if (error) throw new Error(`Failed to save content ideas: ${error.message}`);
  return { saved: rows.length };
}
