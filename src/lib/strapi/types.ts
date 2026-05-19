export interface StrapiMarket {
  id: number;
  name: string;
  slug: string;
  currency: string;
  language: string;
  tiktok_shop_active: boolean;
  gmv_total: number;
  growth_rate: number;
}

export interface StrapiCreator {
  id: number;
  username: string;
  display_name: string;
  followers: number;
  engagement_rate: number;
  niche: string;
}

export interface StrapiVideo {
  id: number;
  tiktok_url: string;
  views: number;
  likes: number;
  analysis_json: any;
}

export interface StrapiBriefing {
  id: number;
  title: string;
  target_audience: string;
  hook_options: any;
  status: 'draft' | 'approved' | 'produced';
}
