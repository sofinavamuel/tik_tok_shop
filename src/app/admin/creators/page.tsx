import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getCreators } from '@/lib/strapi/client';
import SearchBar from '@/components/admin/SearchBar';
import CreatorsTableClient from './creators-table-client';

export const metadata: Metadata = {
  title: 'Creators',
};

function extractCreator(item: any) {
  return {
    id: item.id,
    username: item.username || '',
    display_name: item.display_name || '',
    followers: item.followers ?? 0,
    engagement_rate: item.engagement_rate ?? 0,
    avg_views: item.avg_views ?? 0,
    niche: item.niche || '',
    notes: item.notes || '',
    avatar_url: item.avatar_url || '',
    tiktok_handle: item.tiktok_handle || '',
  };
}

export default async function CreatorsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const search = params.search;

  let creators: any[] = [];
  try {
    const filterParams: Record<string, string> = { sort: 'username:asc' };
    if (search) {
      filterParams['filters[niche][$containsi]'] = search;
    }
    const res = await getCreators(filterParams);
    creators = (res.data || []).map(extractCreator);
  } catch {
    // Strapi not running — show empty state
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Creators</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage TikTok creators with follower and engagement data.
          </p>
        </div>
        <Link
          href="/admin/creators/new"
          className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
        >
          <Plus className="h-4 w-4" />
          Add Creator
        </Link>
      </div>

      <div className="mt-6">
        <SearchBar placeholder="Search by niche..." />
      </div>

      <div className="mt-6">
        <CreatorsTableClient creators={creators} />
      </div>
    </div>
  );
}
