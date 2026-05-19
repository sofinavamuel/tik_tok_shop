export interface TikTokShopConfig {
  appKey: string;
  appSecret: string;
  shopId?: string;
}

export interface TikTokProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  status: 'active' | 'inactive';
  category: string;
}

export interface TikTokOrder {
  id: string;
  status: string;
  total: number;
  items: any[];
  created_at: string;
}

export interface TikTokShopInfo {
  shop_name: string;
  shop_region: string;
  shop_status: string;
}
