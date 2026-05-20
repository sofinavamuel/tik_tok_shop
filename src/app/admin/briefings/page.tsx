import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Sparkles } from 'lucide-react';
import { getBriefings } from '@/lib/strapi/client';
import BriefingsTableClient from './briefings-table-client';

export const metadata: Metadata = {
  title: 'Briefings',
};

function extractBriefing(item: any) {
  return {
    id: item.id,
    title: item.title || '',
    target_audience: item.target_audience || '',
    status: item.status || 'draft',
    ai_generated: item.ai_generated ?? false,
  };
}

export default async function BriefingsPage() {
  let briefings: any[] = [];
  try {
    const res = await getBriefings({ sort: 'id:desc' });
    briefings = (res.data || []).map(extractBriefing);
  } catch {
    // Strapi not running — show empty state
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Briefings</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage video production briefings with AI-generated content.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/briefings/new"
            className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            <Plus className="h-4 w-4" />
            New Briefing
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <BriefingsTableClient briefings={briefings} />
      </div>
    </div>
  );
}
