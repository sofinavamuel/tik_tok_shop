import Link from 'next/link';
import { Plus } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categories',
};

export default function AdminCategoriesPage() {
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
          Add Category
        </Link>
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-sm text-gray-500">
          Category list with drag-and-drop reordering coming soon.
        </p>
      </div>
    </div>
  );
}
