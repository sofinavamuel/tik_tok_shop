'use client';

import Link from 'next/link';
import DataTable from '@/components/admin/DataTable';
import type { Column } from '@/components/admin/DataTable';

export default function VideosTableClient({ videos }: { videos: any[] }) {
  const columns: Column<any>[] = [
    {
      key: 'tiktok_url',
      label: 'URL',
      render: (item) => (
        <Link
          href={`/admin/videos/${item.id}`}
          className="font-medium text-gray-900 hover:text-gray-600"
        >
          {item.tiktok_url ? (
            <span className="max-w-xs truncate block">{item.tiktok_url}</span>
          ) : (
            <span className="text-gray-400">Video #{item.id}</span>
          )}
        </Link>
      ),
    },
    {
      key: 'views',
      label: 'Views',
      sortable: true,
      render: (item) => item.views.toLocaleString(),
    },
    {
      key: 'likes',
      label: 'Likes',
      sortable: true,
      render: (item) => item.likes.toLocaleString(),
    },
    {
      key: 'analysis_status',
      label: 'AI Analysis',
      render: (item) => {
        const hasAnalysis = item.analysis_json && Object.keys(item.analysis_json).length > 0;
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              hasAnalysis
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {hasAnalysis ? 'Analyzed' : 'Pending'}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item) => (
        <Link
          href={`/admin/videos/${item.id}`}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          View Details
        </Link>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={videos}
      emptyMessage="No videos found. Videos are added through the analysis pipeline."
      keyExtractor={(item) => String(item.id)}
    />
  );
}
