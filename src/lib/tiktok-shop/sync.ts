import type { Product } from '@/types';

export interface TikTokShopProduct {
  name: string;
  description: string;
  main_images: { uri: string }[];
  price: { amount: string; currency: string };
  stock_qty: number;
  category_id: string;
  external_product_id: string; // InsForge product ID
}

export function mapToTikTokShopFormat(product: Product): TikTokShopProduct {
  return {
    name: product.name,
    description: product.description || product.name,
    main_images: (product.images || []).map((url) => ({ uri: url })),
    price: {
      amount: (product.price * 100).toString(), // TikTok uses cents as string
      currency: 'EUR',
    },
    stock_qty: product.in_stock ? 100 : 0, // Default stock
    category_id: product.category_id || '',
    external_product_id: product.id,
  };
}

export async function syncToTikTokShop(product: Product) {
  // TODO: Implement when TikTok Shop API access is granted
  // Requires: partner.tiktokshop.com approval
  // const mapped = mapToTikTokShopFormat(product);
  // const res = await fetch(`${TIKTOK_BASE_URL}/product/save`, {
  //   method: 'POST',
  //   headers: { 'X-Tts-Access-Token': accessToken },
  //   body: JSON.stringify({ products: [mapped] }),
  // });
  console.log('TikTok Shop sync not yet available — partner approval pending');
  console.log('Mapped product:', mapToTikTokShopFormat(product));
  return { synced: false, reason: 'TikTok Shop API access pending' };
}

export function syncProductsToTikTokShop(products: Product[]) {
  const mapped: TikTokShopProduct[] = [];
  const skipped: string[] = [];

  for (const product of products) {
    if (!product.name) {
      skipped.push(product.id);
      continue;
    }
    mapped.push(mapToTikTokShopFormat(product));
  }

  return { mapped, skipped };
}
