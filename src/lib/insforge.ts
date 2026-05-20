import { createClient } from '@insforge/sdk';

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_BASE_URL || 'https://jzvkay4g.eu-central.insforge.app';

// Server-side: uses API key for AI and admin operations
// 120s timeout for AI operations (complex prompts take longer)
const serverKey = process.env.INSFORGE_API_KEY || process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || '';

export const insforge = createClient({
  baseUrl,
  anonKey: serverKey,
  timeout: 120000, // 120 seconds for AI operations
});
