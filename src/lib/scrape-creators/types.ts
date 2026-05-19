export interface ScrapeCreatorsConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface CreatorProfile {
  username: string;
  displayName: string;
  followers: number;
  engagementRate: number;
  avgViews: number;
  niche: string;
  bio: string;
}

export interface ProductData {
  title: string;
  price: number;
  salesVolume: number;
  category: string;
  commission: number;
}
