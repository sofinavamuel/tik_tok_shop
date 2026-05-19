// ScrapeCreators API Client
// API: https://scrapecreators.com (requires subscription: $29/mo)
// Currently returns mock data until API key is configured

import type { CreatorProfile, ProductData } from './types';

const BASE_URL = 'https://api.scrapecreators.com/v1';

interface ScrapeCreatorsConfig {
  apiKey?: string;
}

const config: ScrapeCreatorsConfig = {
  apiKey: process.env.SCRAPECREATORS_API_KEY,
};

// Mock data for development
const MOCK_CREATORS: CreatorProfile[] = [
  { username: '@tiktokfashion', displayName: 'TikTok Fashion', followers: 250000, engagementRate: 4.5, avgViews: 45000, niche: 'Fashion', bio: 'Fashion influencer' },
  { username: '@beautyhacks', displayName: 'Beauty Hacks', followers: 180000, engagementRate: 5.2, avgViews: 32000, niche: 'Beauty', bio: 'Beauty tips and tricks' },
  { username: '@techreviews', displayName: 'Tech Reviews', followers: 320000, engagementRate: 3.8, avgViews: 55000, niche: 'Tech', bio: 'Tech product reviews' },
];

interface SearchResult {
  data: CreatorProfile[];
  source: 'mock' | 'api';
}

interface ProductsResult {
  data: ProductData[];
  source: 'mock' | 'api';
}

export async function searchTopCreators(niche?: string, limit: number = 10): Promise<SearchResult> {
  if (!config.apiKey) {
    const filtered = MOCK_CREATORS.filter(
      c => !niche || c.niche.toLowerCase() === niche.toLowerCase()
    ).slice(0, limit);
    return { data: filtered, source: 'mock' };
  }

  const params = new URLSearchParams();
  if (niche) params.set('niche', niche);
  params.set('limit', String(limit));

  const res = await fetch(`${BASE_URL}/creators/search?${params}`, {
    headers: { 'X-API-Key': config.apiKey },
  });

  if (!res.ok) throw new Error(`ScrapeCreators API error: ${res.status}`);
  return { data: await res.json(), source: 'api' };
}

export async function getCreatorProducts(username: string): Promise<ProductsResult> {
  if (!config.apiKey) {
    return { data: [], source: 'mock' };
  }

  const res = await fetch(`${BASE_URL}/creators/${username}/products`, {
    headers: { 'X-API-Key': config.apiKey },
  });

  if (!res.ok) throw new Error(`ScrapeCreators API error: ${res.status}`);
  return { data: await res.json(), source: 'api' };
}

export type { CreatorProfile, ProductData, ScrapeCreatorsConfig };
