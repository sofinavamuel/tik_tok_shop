import { createClient } from '@insforge/sdk';

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_BASE_URL || 'https://jzvkay4g.eu-central.insforge.app';
const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || '';

// Client-safe: reads NEXT_PUBLIC_ vars (inlined at build time)
export const insforge = createClient({
  baseUrl,
  anonKey,
});
