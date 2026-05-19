'use client';

import Link from 'next/link';
import { Plus, Pencil } from 'lucide-react';
import DataTable from '@/components/admin/DataTable';
import DeleteButton from '@/components/admin/DeleteButton';
import type { CategoryWithCount } from '@/lib/admin';

interface CategoriesTableClientProps {
  categories: CategoryWithCount[];
}

export default function CategoriesTableClient({
  categories,
}: CategoriesTableClientProps) {
  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'slug', label: 'Slug' },
    {
      key: 'product_count',
      label: 'Products',
      render: (category: CategoryWithCount) => (
        <span className="font-medium">{category.product_count}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (category: CategoryWithCount) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/categories/${category.id}`}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <DeleteButton
            id={category.id}
            type="category"
            label={category.name}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-600">
            Organize your products into categories.
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
        >
          <Plus className="h-4 w-4" />
          New Category
        </Link>
      </div>

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={categories}
          loading={false}
          emptyMessage="No categories yet. Create your first category!"
          keyExtractor={(category: CategoryWithCount) => category.id}
        />
      </div>
    </div>
  );
}
