import type { Metadata } from 'next';
import { getVideos } from '@/lib/strapi/client';
import VideosTableClient from './videos-table-client';

export const metadata: Metadata = {
  title: 'Videos',
};

function extractVideo(item: any) {
  return {
    id: item.id,
    tiktok_url: item.tiktok_url || '',
    views: item.views ?? 0,
    likes: item.likes ?? 0,
    shares: item.shares ?? 0,
    comments: item.comments ?? 0,
    gmv_attributed: item.gmv_attributed ?? 0,
    duration_seconds: item.duration_seconds ?? 0,
    hook_text: item.hook_text || '',
    transcript: item.transcript || '',
    analysis_json: item.analysis_json || null,
    creator_id: item.creator_id ?? 0,
    product_ids: item.product_ids || [],
  };
}

export default async function VideosPage() {
  let videos: any[] = [];
  try {
    const res = await getVideos({ sort: 'id:desc', populate: '*' });
    videos = (res.data || []).map(extractVideo);
  } catch {
    // Strapi not running — show empty state
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Videos</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage TikTok videos with AI analysis results.
        </p>
      </div>

      <div className="mt-8">
        <VideosTableClient videos={videos} />
      </div>
    </div>
  );
}
