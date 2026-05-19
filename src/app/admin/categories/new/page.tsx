import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Category',
};

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">New Category</h1>
      <p className="mt-1 text-sm text-gray-600">
        Create a new product category.
      </p>

      <div className="mt-8 rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-sm text-gray-500">
          Category creation form coming soon.
        </p>
      </div>
    </div>
  );
}
