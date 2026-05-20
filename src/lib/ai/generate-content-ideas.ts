import { insforge } from '@/lib/insforge';
import type { KalodataProduct, KalodataVideoInsight } from '@/lib/kalodata/types';

export interface ContentIdeaInput {
  product: KalodataProduct;
  videoInsights: KalodataVideoInsight[];
  brandName?: string;
  brandDescription?: string;
  targetMarket?: string;
  contentGoal?: 'awareness' | 'engagement' | 'conversion' | 'education';
}

export interface ContentIdea {
  id: string;
  title: string;
  angle: string;
  hookOptions: string[];
  recommendedHook: string;
  hookType: string;
  script: {
    opening: string;
    body: string;
    closing: string;
  };
  structure: string;
  visualStyle: string[];
  audioDirection: string;
  duration: string;
  cta: string;
  whyItWorks: string;
  adaptedFrom: string;
  confidenceScore: number;
}

export interface ContentIdeasResult {
  productSummary: string;
  marketInsights: string[];
  winningPatterns: string[];
  ideas: ContentIdea[];
  recommendedApproach: string;
}

export async function generateContentIdeas(input: ContentIdeaInput): Promise<ContentIdeasResult> {
  const productContext = `
Product: ${input.product.name}
Category: ${input.product.category}
Price: $${input.product.price}
GMV 30d: $${input.product.gmv_30d.toLocaleString()}
Units sold 30d: ${input.product.units_sold_30d.toLocaleString()}
Trend: ${input.product.trend} (${input.product.growth_rate > 0 ? '+' : ''}${input.product.growth_rate}%)
Creators promoting: ${input.product.creator_count}
Total videos: ${input.product.video_count}
`;

  const videoPatternsContext = input.videoInsights
    .map(
      (v, i) => `
Video ${i + 1} by ${v.creator}:
- Views: ${v.views.toLocaleString()} | Likes: ${v.likes.toLocaleString()} | GMV: $${v.gmv_attributed.toLocaleString()}
- Hook type: ${v.hook_type}
- Hook text: "${v.hook_text}"
- Structure: ${v.structure}
- CTA: ${v.cta_type}
- Duration: ${v.duration_seconds}s | Retention: ${v.retention_rate}%
- Key patterns: ${v.key_patterns.join(', ')}
`,
    )
    .join('\n');

  const brandContext = input.brandName
    ? `
Brand: ${input.brandName}
Description: ${input.brandDescription || 'Not specified'}
Target Market: ${input.targetMarket || 'General'}
Content Goal: ${input.contentGoal || 'engagement'}
`
    : 'No specific brand — generate general content ideas that could be adapted.';

  const prompt = `You are a content strategy expert who analyzes TikTok Shop data to create viral video content ideas.

## TRENDING PRODUCT DATA
${productContext}

## WINNING VIDEO PATTERNS (from top-performing videos about this product)
${videoPatternsContext}

## BRAND CONTEXT
${brandContext}

## YOUR TASK

Analyze the data above and generate content ideas. The goal is NOT to sell this specific product on TikTok Shop. Instead, use the product's success data to understand WHAT WORKS in this niche, then create content ideas that could be used by a brand/agency to create engaging videos.

Return a JSON object with this exact structure:
{
  "productSummary": "2-3 sentence summary of why this product is trending and what it reveals about the market",
  "marketInsights": ["3-4 bullet points about what this product's success tells us about consumer behavior"],
  "winningPatterns": ["3-4 bullet points about the common patterns across successful videos for this product"],
  "ideas": [
    {
      "id": "idea-1",
      "title": "Catchy title for this content idea",
      "angle": "The creative angle — what makes this idea unique and why it would work",
      "hookOptions": ["3 different hook options for this idea"],
      "recommendedHook": "The best hook from the options above",
      "hookType": "The type of hook (e.g., Problem-Solution, Curiosity Gap, Transformation, etc.)",
      "script": {
        "opening": "What to say/show in the first 3 seconds",
        "body": "The main content flow — what happens from second 3 to near the end",
        "closing": "How to end the video effectively"
      },
      "structure": "The video structure with timestamps (e.g., Hook 0-3s → Demo 3-12s → Result 12-20s → CTA 20-25s)",
      "visualStyle": ["3-4 visual direction notes (e.g., close-up shots, before/after split screen, etc.)"],
      "audioDirection": "Audio/music direction for this video",
      "duration": "Recommended duration (e.g., 25s, 30s)",
      "cta": "The call-to-action to use",
      "whyItWorks": "Explanation of why this idea would work based on the data patterns",
      "adaptedFrom": "Which winning video pattern this idea is adapted from",
      "confidenceScore": 0-100 score of how likely this idea is to perform well
    }
  ],
  "recommendedApproach": "Overall recommendation — which idea to start with and why"
}

Generate exactly 3 content ideas. Each should have a DIFFERENT angle and hook type. Base them on the actual winning patterns from the data, but adapt them creatively.

IMPORTANT: Return ONLY valid JSON. No markdown, no explanations outside the JSON.`;

  const completion = await insforge.ai.chat.completions.create({
    model: 'openai/gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a TikTok content strategy expert. You analyze market data from TikTok Shop to identify winning content patterns and create adaptable video ideas for brands and agencies. You always return valid JSON.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
  });

  const content = completion.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty AI response');

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in AI response');

  return JSON.parse(jsonMatch[0]) as ContentIdeasResult;
}
