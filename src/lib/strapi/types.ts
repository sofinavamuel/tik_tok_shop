// Strapi v5 types — flat structure (no attributes wrapper)

export interface StrapiMarket {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  currency: string;
  language: string;
  tiktok_shop_active: boolean;
  gmv_total: number;
  growth_rate: number;
  saturation_score: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiCreator {
  id: number;
  documentId: string;
  username: string;
  display_name: string;
  followers: number;
  engagement_rate: number;
  avg_views: number;
  niche: string;
  notes: string;
  avatar_url: string;
  tiktok_handle: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiVideo {
  id: number;
  documentId: string;
  tiktok_url: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  gmv_attributed: number;
  duration_seconds: number;
  hook_text: string;
  transcript: string;
  analysis_json: any;
  creator_id: number;
  product_ids: number[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiBriefing {
  id: number;
  documentId: string;
  title: string;
  target_audience: string;
  hook_options: any;
  script: string;
  shotlist: any;
  status: 'draft' | 'approved' | 'produced';
  ai_generated: boolean;
  creator_id: number;
  video_id: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiVideoProduction {
  id: number;
  documentId: string;
  tools_used: any;
  production_time_minutes: number;
  cost_eur: number;
  status: 'in_progress' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiListResponse<T> {
  data: T[];
  meta: { pagination: { page: number; pageSize: number; total: number } };
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}
