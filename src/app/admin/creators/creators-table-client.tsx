'use client';

import Link from 'next/link';
import DataTable from '@/components/admin/DataTable';
import type { Column } from '@/components/admin/DataTable';

export default function CreatorsTableClient({ creators }: { creators: any[] }) {
  const columns: Column<any>[] = [
    {
      key: 'username',
      label: 'Username',
      sortable: true,
      render: (item) => (
        <Link
          href={`/admin/creators/${item.id}`}
          className="font-medium text-gray-900 hover:text-gray-600"
        >
          {item.username}
        </Link>
      ),
    },
    { key: 'display_name', label: 'Display Name', sortable: true },
    {
      key: 'followers',
      label: 'Followers',
      sortable: true,
      render: (item) => item.followers.toLocaleString(),
    },
    {
      key: 'engagement_rate',
      label: 'Engagement %',
      sortable: true,
      render: (item) => `${item.engagement_rate}%`,
    },
    {
      key: 'avg_views',
      label: 'Avg Views',
      sortable: true,
      render: (item) => item.avg_views.toLocaleString(),
    },
    { key: 'niche', label: 'Niche' },
    {
      key: 'actions',
      label: 'Actions',
      render: (item) => (
        <Link
          href={`/admin/creators/${item.id}`}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Edit
        </Link>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={creators}
      emptyMessage="No creators found. Add your first creator to get started."
      keyExtractor={(item) => String(item.id)}
    />
  );
}
