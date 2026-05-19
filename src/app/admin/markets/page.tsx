import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getMarkets } from '@/lib/strapi/client';
import MarketsTableClient from './markets-table-client';

export const metadata: Metadata = {
  title: 'Markets',
};

function extractMarket(item: any) {
  return {
    id: item.id,
    name: item.name || '',
    slug: item.slug || '',
    currency: item.currency || '',
    language: item.language || '',
    tiktok_shop_active: item.tiktok_shop_active ?? false,
    gmv_total: item.gmv_total ?? 0,
    growth_rate: item.growth_rate ?? 0,
    saturation_score: item.saturation_score ?? 0,
  };
}

export default async function MarketsPage() {
  let markets: any[] = [];
  try {
    const res = await getMarkets({ sort: 'name:asc' });
    markets = (res.data || []).map(extractMarket);
  } catch {
    // Strapi not running — show empty state
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Markets</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage TikTok Shop markets with GMV, growth, and saturation data.
          </p>
        </div>
        <Link
          href="/admin/markets/new"
          className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
        >
          <Plus className="h-4 w-4" />
          Add Market
        </Link>
      </div>

      <div className="mt-8">
        <MarketsTableClient markets={markets} />
      </div>
    </div>
  );
}
