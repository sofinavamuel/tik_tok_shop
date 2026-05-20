import type { KalodataProduct, KalodataCreator, KalodataVideoInsight } from './types';

const KALODATA_API_KEY = process.env.KALODATA_API_KEY;
const KALODATA_API_BASE = process.env.KALODATA_API_BASE || 'https://api.kalodata.com/v1';

// ── Mock Data ──

const MOCK_PRODUCTS: KalodataProduct[] = [
  {
    id: 'kp-001',
    name: 'Oversized Vintage Wash Tee',
    category: 'Fashion',
    gmv_30d: 284500,
    gmv_90d: 712300,
    units_sold_30d: 14225,
    commission_rate: 15,
    price: 19.99,
    shop_name: 'Urban Threads Co',
    trend: 'rising',
    growth_rate: 34.2,
    creator_count: 342,
    video_count: 1890,
  },
  {
    id: 'kp-002',
    name: 'Glass Skin Serum 30ml',
    category: 'Beauty',
    gmv_30d: 456200,
    gmv_90d: 1230000,
    units_sold_30d: 9124,
    commission_rate: 20,
    price: 49.99,
    shop_name: 'GlowLab Beauty',
    trend: 'rising',
    growth_rate: 52.8,
    creator_count: 567,
    video_count: 3420,
  },
  {
    id: 'kp-003',
    name: 'Portable Mini Projector',
    category: 'Tech',
    gmv_30d: 198700,
    gmv_90d: 445600,
    units_sold_30d: 2840,
    commission_rate: 12,
    price: 69.99,
    shop_name: 'TechGadget Hub',
    trend: 'rising',
    growth_rate: 28.5,
    creator_count: 198,
    video_count: 876,
  },
  {
    id: 'kp-004',
    name: 'Aesthetic Desk Lamp RGB',
    category: 'Home',
    gmv_30d: 123400,
    gmv_90d: 312000,
    units_sold_30d: 6170,
    commission_rate: 18,
    price: 19.99,
    shop_name: 'CozyNest Living',
    trend: 'stable',
    growth_rate: 8.3,
    creator_count: 234,
    video_count: 1245,
  },
  {
    id: 'kp-005',
    name: 'Spicy Mango Chili Crisp',
    category: 'Food',
    gmv_30d: 89300,
    gmv_90d: 198700,
    units_sold_30d: 17860,
    commission_rate: 10,
    price: 4.99,
    shop_name: 'FlavorPantry',
    trend: 'rising',
    growth_rate: 41.6,
    creator_count: 456,
    video_count: 2340,
  },
  {
    id: 'kp-006',
    name: 'Cloud Slides Platform',
    category: 'Fashion',
    gmv_30d: 167800,
    gmv_90d: 423500,
    units_sold_30d: 8390,
    commission_rate: 15,
    price: 19.99,
    shop_name: 'StepStyle',
    trend: 'stable',
    growth_rate: 5.1,
    creator_count: 289,
    video_count: 1567,
  },
  {
    id: 'kp-007',
    name: 'Lip Plumping Gloss Kit',
    category: 'Beauty',
    gmv_30d: 345600,
    gmv_90d: 890200,
    units_sold_30d: 11520,
    commission_rate: 22,
    price: 29.99,
    shop_name: 'LuxeBeauty Lab',
    trend: 'rising',
    growth_rate: 45.3,
    creator_count: 678,
    video_count: 4120,
  },
  {
    id: 'kp-008',
    name: 'Magnetic Phone Car Mount',
    category: 'Tech',
    gmv_30d: 76500,
    gmv_90d: 234100,
    units_sold_30d: 5100,
    commission_rate: 14,
    price: 14.99,
    shop_name: 'DriveEasy Tech',
    trend: 'declining',
    growth_rate: -12.4,
    creator_count: 145,
    video_count: 678,
  },
  {
    id: 'kp-009',
    name: 'Satin Pillowcase Set',
    category: 'Home',
    gmv_30d: 145200,
    gmv_90d: 389400,
    units_sold_30d: 7260,
    commission_rate: 16,
    price: 19.99,
    shop_name: 'DreamSleep Co',
    trend: 'stable',
    growth_rate: 3.7,
    creator_count: 312,
    video_count: 1890,
  },
  {
    id: 'kp-010',
    name: 'Matcha Latte Mix Organic',
    category: 'Food',
    gmv_30d: 112300,
    gmv_90d: 278900,
    units_sold_30d: 5615,
    commission_rate: 12,
    price: 19.99,
    shop_name: 'ZenTea House',
    trend: 'rising',
    growth_rate: 22.1,
    creator_count: 234,
    video_count: 1123,
  },
  {
    id: 'kp-011',
    name: 'Cargo Pants Wide Leg',
    category: 'Fashion',
    gmv_30d: 234500,
    gmv_90d: 567800,
    units_sold_30d: 7816,
    commission_rate: 15,
    price: 29.99,
    shop_name: 'StreetVibe',
    trend: 'rising',
    growth_rate: 31.7,
    creator_count: 423,
    video_count: 2345,
  },
  {
    id: 'kp-012',
    name: 'LED Strip Lights 10m',
    category: 'Home',
    gmv_30d: 98700,
    gmv_90d: 312400,
    units_sold_30d: 6580,
    commission_rate: 14,
    price: 14.99,
    shop_name: 'LightUp Home',
    trend: 'declining',
    growth_rate: -8.2,
    creator_count: 189,
    video_count: 934,
  },
];

const MOCK_CREATORS: KalodataCreator[] = [
  {
    username: '@beautybyluna',
    display_name: 'Luna Martinez',
    followers: 2340000,
    engagement_rate: 8.4,
    gmv_30d: 189500,
    video_count: 156,
    niche: 'Beauty',
    top_products: ['Glass Skin Serum 30ml', 'Lip Plumping Gloss Kit'],
  },
  {
    username: '@techwithjake',
    display_name: 'Jake Thompson',
    followers: 1890000,
    engagement_rate: 6.2,
    gmv_30d: 134200,
    video_count: 89,
    niche: 'Tech',
    top_products: ['Portable Mini Projector', 'Magnetic Phone Car Mount'],
  },
  {
    username: '@stylebyemma',
    display_name: 'Emma Chen',
    followers: 3120000,
    engagement_rate: 9.1,
    gmv_30d: 267800,
    video_count: 234,
    niche: 'Fashion',
    top_products: ['Oversized Vintage Wash Tee', 'Cargo Pants Wide Leg'],
  },
  {
    username: '@homevibesonly',
    display_name: 'Sarah Kim',
    followers: 890000,
    engagement_rate: 7.8,
    gmv_30d: 98400,
    video_count: 112,
    niche: 'Home',
    top_products: ['Aesthetic Desk Lamp RGB', 'Satin Pillowcase Set'],
  },
  {
    username: '@foodiefinds_',
    display_name: 'Carlos Rivera',
    followers: 1560000,
    engagement_rate: 11.2,
    gmv_30d: 156700,
    video_count: 198,
    niche: 'Food',
    top_products: ['Spicy Mango Chili Crisp', 'Matcha Latte Mix Organic'],
  },
  {
    username: '@glowupwithme',
    display_name: 'Aisha Patel',
    followers: 4560000,
    engagement_rate: 7.3,
    gmv_30d: 345600,
    video_count: 312,
    niche: 'Beauty',
    top_products: ['Glass Skin Serum 30ml', 'Lip Plumping Gloss Kit'],
  },
  {
    username: '@urbanfitstyle',
    display_name: 'Marcus Johnson',
    followers: 1230000,
    engagement_rate: 5.9,
    gmv_30d: 89300,
    video_count: 67,
    niche: 'Fashion',
    top_products: ['Oversized Vintage Wash Tee', 'Cloud Slides Platform'],
  },
  {
    username: '@gadgetqueen_',
    display_name: 'Mia Zhang',
    followers: 2780000,
    engagement_rate: 8.7,
    gmv_30d: 198700,
    video_count: 145,
    niche: 'Tech',
    top_products: ['Portable Mini Projector', 'LED Strip Lights 10m'],
  },
  {
    username: '@cozyhomelife',
    display_name: 'Olivia Brown',
    followers: 670000,
    engagement_rate: 10.5,
    gmv_30d: 76500,
    video_count: 89,
    niche: 'Home',
    top_products: ['Satin Pillowcase Set', 'Aesthetic Desk Lamp RGB'],
  },
  {
    username: '@snackattack_reviews',
    display_name: 'David Lee',
    followers: 980000,
    engagement_rate: 9.8,
    gmv_30d: 112300,
    video_count: 134,
    niche: 'Food',
    top_products: ['Spicy Mango Chili Crisp', 'Matcha Latte Mix Organic'],
  },
];

const MOCK_VIDEO_INSIGHTS: KalodataVideoInsight[] = [
  {
    video_url: 'https://tiktok.com/@beautybyluna/video/7301234567890',
    creator: '@beautybyluna',
    product: 'Glass Skin Serum 30ml',
    views: 4560000,
    likes: 389000,
    shares: 45600,
    gmv_attributed: 67800,
    hook_type: 'Problem-Solution',
    hook_text: 'POV: You finally found the serum that fixed your texture',
    structure: 'Hook (0-3s) → Problem demo (3-8s) → Product reveal (8-12s) → Results (12-20s) → CTA (20-25s)',
    cta_type: 'Shop Now Link',
    duration_seconds: 25,
    retention_rate: 72.3,
    key_patterns: ['Before/after comparison', 'Close-up texture shots', 'ASMR application sounds'],
  },
  {
    video_url: 'https://tiktok.com/@stylebyemma/video/7302345678901',
    creator: '@stylebyemma',
    product: 'Oversized Vintage Wash Tee',
    views: 3210000,
    likes: 267000,
    shares: 32100,
    gmv_attributed: 45600,
    hook_type: 'Transformation',
    hook_text: '3 ways to style this $20 tee that looks like $200',
    structure: 'Hook (0-3s) → Outfit 1 (3-10s) → Outfit 2 (10-17s) → Outfit 3 (17-24s) → CTA (24-28s)',
    cta_type: 'TikTok Shop Cart',
    duration_seconds: 28,
    retention_rate: 68.9,
    key_patterns: ['Quick outfit transitions', 'Price anchor comparison', 'Full body mirror shots'],
  },
  {
    video_url: 'https://tiktok.com/@techwithjake/video/7303456789012',
    creator: '@techwithjake',
    product: 'Portable Mini Projector',
    views: 2890000,
    likes: 198000,
    shares: 28900,
    gmv_attributed: 34500,
    hook_type: 'Curiosity Gap',
    hook_text: 'This $70 gadget replaced my $2000 TV setup',
    structure: 'Hook (0-3s) → Unboxing (3-10s) → Setup demo (10-18s) → Quality test (18-25s) → CTA (25-30s)',
    cta_type: 'Shop Now Link',
    duration_seconds: 30,
    retention_rate: 65.4,
    key_patterns: ['Dark room reveal moment', 'Side-by-side comparison', 'Price shock reaction'],
  },
  {
    video_url: 'https://tiktok.com/@foodiefinds_/video/7304567890123',
    creator: '@foodiefinds_',
    product: 'Spicy Mango Chili Crisp',
    views: 5670000,
    likes: 512000,
    shares: 78900,
    gmv_attributed: 89300,
    hook_type: 'Sensory Hook',
    hook_text: 'The sound of this chili crisp hitting rice... *chef kiss*',
    structure: 'Hook (0-2s) → Sizzle ASMR (2-8s) → Taste test (8-15s) → Recipe ideas (15-22s) → CTA (22-25s)',
    cta_type: 'TikTok Shop Cart',
    duration_seconds: 25,
    retention_rate: 78.1,
    key_patterns: ['ASMR cooking sounds', 'Extreme close-up food shots', 'Genuine reaction face'],
  },
  {
    video_url: 'https://tiktok.com/@glowupwithme/video/7305678901234',
    creator: '@glowupwithme',
    product: 'Lip Plumping Gloss Kit',
    views: 6780000,
    likes: 589000,
    shares: 67800,
    gmv_attributed: 123400,
    hook_type: 'Result Tease',
    hook_text: 'My lips before vs after using this for 7 days straight',
    structure: 'Hook (0-3s) → Before photo (3-6s) → Day 1-3 (6-12s) → Day 4-7 (12-18s) → Final result (18-22s) → CTA (22-25s)',
    cta_type: 'Shop Now Link',
    duration_seconds: 25,
    retention_rate: 74.6,
    key_patterns: ['Split screen before/after', 'Day-by-day progression', 'Natural lighting close-ups'],
  },
  {
    video_url: 'https://tiktok.com/@homevibesonly/video/7306789012345',
    creator: '@homevibesonly',
    product: 'Aesthetic Desk Lamp RGB',
    views: 1890000,
    likes: 145000,
    shares: 18900,
    gmv_attributed: 23400,
    hook_type: 'Aesthetic Reveal',
    hook_text: 'My desk went from boring to Pinterest-worthy with this $20 lamp',
    structure: 'Hook (0-3s) → Before (3-7s) → Setup (7-14s) → Color modes (14-20s) → Final vibe (20-24s) → CTA (24-27s)',
    cta_type: 'TikTok Shop Cart',
    duration_seconds: 27,
    retention_rate: 63.2,
    key_patterns: ['Room transformation', 'Multiple color cycling', 'Cozy aesthetic lighting'],
  },
  {
    video_url: 'https://tiktok.com/@urbanfitstyle/video/7307890123456',
    creator: '@urbanfitstyle',
    product: 'Cargo Pants Wide Leg',
    views: 2340000,
    likes: 178000,
    shares: 23400,
    gmv_attributed: 34500,
    hook_type: 'Controversy Hook',
    hook_text: 'Stop wearing skinny jeans. Here is why.',
    structure: 'Hook (0-3s) → Argument (3-10s) → Try-on (10-18s) → Styling tips (18-24s) → CTA (24-27s)',
    cta_type: 'Shop Now Link',
    duration_seconds: 27,
    retention_rate: 61.8,
    key_patterns: ['Controversial statement', 'Multiple angle try-on', 'Outfit pairing suggestions'],
  },
  {
    video_url: 'https://tiktok.com/@gadgetqueen_/video/7308901234567',
    creator: '@gadgetqueen_',
    product: 'Portable Mini Projector',
    views: 3450000,
    likes: 267000,
    shares: 34500,
    gmv_attributed: 56700,
    hook_type: 'Listicle Hook',
    hook_text: '5 things I wish I knew before buying this projector',
    structure: 'Hook (0-3s) → Tip 1-2 (3-10s) → Tip 3-4 (10-18s) → Tip 5 (18-23s) → Verdict (23-28s) → CTA (28-30s)',
    cta_type: 'TikTok Shop Cart',
    duration_seconds: 30,
    retention_rate: 67.5,
    key_patterns: ['Numbered list format', 'Honest pros/cons', 'Real usage scenarios'],
  },
  {
    video_url: 'https://tiktok.com/@cozyhomelife/video/7309012345678',
    creator: '@cozyhomelife',
    product: 'Satin Pillowcase Set',
    views: 1560000,
    likes: 134000,
    shares: 15600,
    gmv_attributed: 19800,
    hook_type: 'Educational Hook',
    hook_text: 'Your hair is breaking because you sleep on cotton. Here is the fix.',
    structure: 'Hook (0-3s) → Science explanation (3-10s) → Product intro (10-15s) → Benefits (15-22s) → CTA (22-25s)',
    cta_type: 'Shop Now Link',
    duration_seconds: 25,
    retention_rate: 59.3,
    key_patterns: ['Educational graphics overlay', 'Hair texture comparison', 'Sleep setup aesthetic'],
  },
  {
    video_url: 'https://tiktok.com/@snackattack_reviews/video/7310123456789',
    creator: '@snackattack_reviews',
    product: 'Matcha Latte Mix Organic',
    views: 2120000,
    likes: 189000,
    shares: 21200,
    gmv_attributed: 34500,
    hook_type: 'Cost Comparison',
    hook_text: 'I stopped buying $7 lattes. This is what I do instead.',
    structure: 'Hook (0-3s) → Cost breakdown (3-10s) → Making process (10-18s) → Taste test (18-23s) → CTA (23-26s)',
    cta_type: 'TikTok Shop Cart',
    duration_seconds: 26,
    retention_rate: 64.7,
    key_patterns: ['Money savings graphic', 'Pour-over aesthetic', 'Side-by-side cost comparison'],
  },
];

// ── API Client ──

function isMockMode(): boolean {
  return !KALODATA_API_KEY;
}

export async function getTopProducts(category?: string): Promise<KalodataProduct[]> {
  if (isMockMode()) {
    console.warn('[Kalodata] No KALODATA_API_KEY set. Returning mock data.');
    let products = [...MOCK_PRODUCTS];
    if (category) {
      products = products.filter((p) => p.category === category);
    }
    return products;
  }

  const params = new URLSearchParams();
  if (category) params.set('category', category);

  const res = await fetch(`${KALODATA_API_BASE}/products/top?${params}`, {
    headers: {
      Authorization: `Bearer ${KALODATA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`Kalodata API error: ${res.status}`);
  const json = await res.json();
  return json.data as KalodataProduct[];
}

export async function getTopCreators(niche?: string): Promise<KalodataCreator[]> {
  if (isMockMode()) {
    console.warn('[Kalodata] No KALODATA_API_KEY set. Returning mock data.');
    let creators = [...MOCK_CREATORS];
    if (niche) {
      creators = creators.filter((c) => c.niche === niche);
    }
    return creators;
  }

  const params = new URLSearchParams();
  if (niche) params.set('niche', niche);

  const res = await fetch(`${KALODATA_API_BASE}/creators/top?${params}`, {
    headers: {
      Authorization: `Bearer ${KALODATA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`Kalodata API error: ${res.status}`);
  const json = await res.json();
  return json.data as KalodataCreator[];
}

export async function getVideoInsights(product?: string): Promise<KalodataVideoInsight[]> {
  if (isMockMode()) {
    console.warn('[Kalodata] No KALODATA_API_KEY set. Returning mock data.');
    let insights = [...MOCK_VIDEO_INSIGHTS];
    if (product) {
      insights = insights.filter((v) => v.product === product);
    }
    return insights;
  }

  const params = new URLSearchParams();
  if (product) params.set('product', product);

  const res = await fetch(`${KALODATA_API_BASE}/videos/insights?${params}`, {
    headers: {
      Authorization: `Bearer ${KALODATA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`Kalodata API error: ${res.status}`);
  const json = await res.json();
  return json.data as KalodataVideoInsight[];
}

export { MOCK_PRODUCTS, MOCK_CREATORS, MOCK_VIDEO_INSIGHTS };
