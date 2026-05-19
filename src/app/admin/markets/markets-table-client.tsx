'use client';

import Link from 'next/link';
import DataTable from '@/components/admin/DataTable';
import type { Column } from '@/components/admin/DataTable';

export default function MarketsTableClient({ markets }: { markets: any[] }) {
  const columns: Column<any>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (item) => (
        <Link
          href={`/admin/markets/${item.id}`}
          className="font-medium text-gray-900 hover:text-gray-600"
        >
          {item.name}
        </Link>
      ),
    },
    { key: 'currency', label: 'Currency' },
    { key: 'language', label: 'Language' },
    {
      key: 'gmv_total',
      label: 'GMV',
      sortable: true,
      render: (item) => `€${item.gmv_total.toLocaleString()}`,
    },
    {
      key: 'growth_rate',
      label: 'Growth %',
      sortable: true,
      render: (item) => (
        <span className={item.growth_rate > 0 ? 'text-green-600' : 'text-red-600'}>
          {item.growth_rate > 0 ? '+' : ''}{item.growth_rate}%
        </span>
      ),
    },
    {
      key: 'saturation_score',
      label: 'Saturation',
      render: (item) => (
        <span
          className={
            item.saturation_score > 70
              ? 'text-red-600'
              : item.saturation_score > 40
                ? 'text-yellow-600'
                : 'text-green-600'
          }
        >
          {item.saturation_score}%
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (item) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            item.tiktok_shop_active
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {item.tiktok_shop_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item) => (
        <Link
          href={`/admin/markets/${item.id}`}
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
      data={markets}
      emptyMessage="No markets found. Add your first market to get started."
      keyExtractor={(item) => String(item.id)}
    />
  );
}
