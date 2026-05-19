import { insforge } from '@/lib/insforge';
import { BRIEFING_GENERATION_SYSTEM_PROMPT } from './prompts';
import type { Product } from '@/types';

export interface BriefingInput {
  product: Product;
  targetAudience?: string;
  market?: string;
}

export interface BriefingResult {
  title: string;
  hookOptions: string[];
  selectedHook: string;
  script: {
    scenes: Array<{
      sceneNumber: number;
      duration: string;
      visuals: string;
      audio: string;
      text: string;
    }>;
  };
  shotlist: Array<{
    shotNumber: number;
    type: string;
    description: string;
    duration: string;
  }>;
  musicSuggestions: string[];
  productionNotes: string[];
}

export async function generateBriefing(input: BriefingInput): Promise<BriefingResult> {
  const prompt = `Generate a video production briefing for this product and return JSON:
Name: ${input.product.name}
Price: €${input.product.price}
Description: ${input.product.description || 'N/A'}
Material: ${input.product.material || 'N/A'}
Origin: ${input.product.origin || 'N/A'}
Target Audience: ${input.targetAudience || 'TikTok shoppers'}
Market: ${input.market || 'General'}

Return a JSON object with the following structure:
{
  "title": "string",
  "hookOptions": ["string"],
  "selectedHook": "string",
  "script": { "scenes": [{ "sceneNumber": "number", "duration": "string", "visuals": "string", "audio": "string", "text": "string" }] },
  "shotlist": [{ "shotNumber": "number", "type": "string", "description": "string", "duration": "string" }],
  "musicSuggestions": ["string"],
  "productionNotes": ["string"]
}`;

  const completion = await insforge.ai.chat.completions.create({
    model: 'anthropic/claude-sonnet-4.5',
    messages: [
      { role: 'system', content: BRIEFING_GENERATION_SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    temperature: 0.4,
  });

  const content = completion.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty AI response');

  // Extract JSON from the response (handles cases where the model wraps JSON in markdown)
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in AI response');

  return JSON.parse(jsonMatch[0]) as BriefingResult;
}
