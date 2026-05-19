import { analyzeVideo } from './analyze-video';
import { generateBriefing } from './generate-briefing';
import type { Product } from '@/types';

export interface PipelineResult {
  analysis: Awaited<ReturnType<typeof analyzeVideo>>;
  briefing: Awaited<ReturnType<typeof generateBriefing>>;
}

export async function runPipeline(product: Product, videoDescription: string): Promise<PipelineResult> {
  const analysis = await analyzeVideo({
    title: product.name,
    description: videoDescription,
    category: 'product showcase',
  });

  const briefing = await generateBriefing({
    product,
    targetAudience: analysis.targetAudience.demographics.join(', '),
  });

  return { analysis, briefing };
}
