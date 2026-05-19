import { insforge } from '@/lib/insforge';
import { VIDEO_ANALYSIS_SYSTEM_PROMPT } from './prompts';

export interface VideoAnalysisInput {
  title: string;
  description: string;
  duration?: number;
  category?: string;
}

export interface VideoAnalysisResult {
  hook: {
    type: string;         // e.g., "problem-solution", "curiosity-gap", "direct-address"
    text: string;         // The actual hook text
    emotion: string;      // Primary emotion targeted
    effectiveness: number; // 1-10 score
  };
  structure: {
    type: string;         // e.g., "demo", "testimonial", "educational"
    segments: Array<{ timestamp: string; description: string }>;
  };
  cta: {
    type: string;         // e.g., "link-in-bio", "shop-now", "follow"
    text: string;
    placement: string;    // where in the video
  };
  sentiment: {
    overall: 'positive' | 'neutral' | 'negative';
    score: number;        // -1 to 1
    keywords: string[];
  };
  targetAudience: {
    demographics: string[];
    painPoints: string[];
    desires: string[];
  };
  recommendations: string[];
}

export async function analyzeVideo(input: VideoAnalysisInput): Promise<VideoAnalysisResult> {
  const prompt = `Analyze this TikTok video and return JSON:
Title: ${input.title}
Description: ${input.description}
Duration: ${input.duration || 'unknown'} seconds
Category: ${input.category || 'unknown'}

Return a JSON object with the following structure:
{
  "hook": { "type": "string", "text": "string", "emotion": "string", "effectiveness": "number" },
  "structure": { "type": "string", "segments": [{ "timestamp": "string", "description": "string" }] },
  "cta": { "type": "string", "text": "string", "placement": "string" },
  "sentiment": { "overall": "positive|neutral|negative", "score": "number", "keywords": ["string"] },
  "targetAudience": { "demographics": ["string"], "painPoints": ["string"], "desires": ["string"] },
  "recommendations": ["string"]
}`;

  const completion = await insforge.ai.chat.completions.create({
    model: 'anthropic/claude-sonnet-4.5',
    messages: [
      { role: 'system', content: VIDEO_ANALYSIS_SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    temperature: 0.3,
  });

  const content = completion.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty AI response');

  // Extract JSON from the response (handles cases where the model wraps JSON in markdown)
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in AI response');

  return JSON.parse(jsonMatch[0]) as VideoAnalysisResult;
}
