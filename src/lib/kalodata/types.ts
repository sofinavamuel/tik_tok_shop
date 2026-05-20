export interface KalodataProduct {
  id: string;
  name: string;
  category: string;
  gmv_30d: number;
  gmv_90d: number;
  units_sold_30d: number;
  commission_rate: number;
  price: number;
  shop_name: string;
  trend: 'rising' | 'stable' | 'declining';
  growth_rate: number;
  creator_count: number;
  video_count: number;
}

export interface KalodataCreator {
  username: string;
  display_name: string;
  followers: number;
  engagement_rate: number;
  gmv_30d: number;
  video_count: number;
  niche: string;
  top_products: string[];
}

export interface KalodataVideoInsight {
  video_url: string;
  creator: string;
  product: string;
  views: number;
  likes: number;
  shares: number;
  gmv_attributed: number;
  hook_type: string;
  hook_text: string;
  structure: string;
  cta_type: string;
  duration_seconds: number;
  retention_rate: number;
  key_patterns: string[];
}
