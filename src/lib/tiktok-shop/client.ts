// TikTok Shop Open API Client
// Requires TikTok Partner approval: https://partner.tiktokshop.com
// Sandbox available: https://partner.tiktokshop.com/docv2

import type { TikTokShopConfig, TikTokProduct, TikTokOrder, TikTokShopInfo } from './types';

const BASE_URL = 'https://open-api.tiktokshop.com';

let config: TikTokShopConfig | null = null;

export function configure(cfg: TikTokShopConfig) {
  config = cfg;
}

// HMAC-SHA256 signature for TikTok Shop API requests
function generateSignature(path: string, params: Record<string, string>, secret: string): string {
  // TODO: Implement HMAC signing when API access is granted
  // const crypto = require('crypto');
  // const sortedKeys = Object.keys(params).sort();
  // const stringToSign = path + sortedKeys.map(k => `${k}${params[k]}`).join('');
  // return crypto.createHmac('sha256', secret).update(stringToSign).digest('hex');
  console.warn('TikTok Shop API: HMAC signing not implemented. Requires partner approval.');
  return 'placeholder-signature';
}

interface ApiResponse<T> {
  data: T;
  source: 'api' | 'unavailable';
}

export async function getProducts(shopId: string): Promise<ApiResponse<unknown>> {
  if (!config) {
    console.warn('TikTok Shop API not configured. Requires partner approval at https://partner.tiktokshop.com');
    return { data: [], source: 'unavailable' };
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const params: Record<string, string> = {
    app_key: config.appKey,
    timestamp,
    shop_id: shopId,
  };
  const signature = generateSignature('/product/list', params, config.appSecret);

  const url = `${BASE_URL}/product/list?${new URLSearchParams({ ...params, sign: signature })}`;
  const res = await fetch(url);
  return { data: await res.json(), source: 'api' };
}

export async function getOrders(shopId: string): Promise<ApiResponse<unknown>> {
  if (!config) {
    return { data: [], source: 'unavailable' };
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const params: Record<string, string> = {
    app_key: config.appKey,
    timestamp,
    shop_id: shopId,
  };
  const signature = generateSignature('/order/list', params, config.appSecret);

  const url = `${BASE_URL}/order/list?${new URLSearchParams({ ...params, sign: signature })}`;
  const res = await fetch(url);
  return { data: await res.json(), source: 'api' };
}

export async function getShopInfo(): Promise<ApiResponse<null>> {
  return { data: null, source: 'unavailable' };
}
