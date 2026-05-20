'use client';

import Link from 'next/link';
import DataTable from '@/components/admin/DataTable';
import type { Column } from '@/components/admin/DataTable';

interface Briefing {
  id: number;
  title: string;
  target_audience: string;
  status: 'draft' | 'approved' | 'produced';
  ai_generated: boolean;
}

export default function BriefingsTableClient({ briefings }: { briefings: Briefing[] }) {
  const columns: Column<Briefing>[] = [
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      render: (item) => (
        <Link
          href={`/admin/briefings/${item.id}`}
          className="font-medium text-gray-900 hover:text-gray-600"
        >
          {item.title}
        </Link>
      ),
    },
    {
      key: 'target_audience',
      label: 'Target Audience',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      render: (item) => {
        const statusMap = {
          draft: 'bg-gray-100 text-gray-800',
          approved: 'bg-green-100 text-green-800',
          produced: 'bg-blue-100 text-blue-800',
        };
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusMap[item.status]}`}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </span>
        );
      },
    },
    {
      key: 'ai_generated',
      label: 'AI Generated?',
      render: (item) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            item.ai_generated
              ? 'bg-purple-100 text-purple-800'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {item.ai_generated ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item) => (
        <Link
          href={`/admin/briefings/${item.id}`}
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
      data={briefings}
      emptyMessage="No briefings found. Create your first briefing to get started."
      keyExtractor={(item) => String(item.id)}
    />
  );
}
