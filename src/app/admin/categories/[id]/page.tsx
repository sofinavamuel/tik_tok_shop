import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Category',
};

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <Link
        href="/admin/categories"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to categories
      </Link>
      <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
      <p className="mt-1 text-sm text-gray-600">Category ID: {id}</p>

      <div className="mt-8 rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-sm text-gray-500">Category edit form coming soon.</p>
      </div>
    </div>
  );
}
