import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Product',
};

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">New Product</h1>
      <p className="mt-1 text-sm text-gray-600">
        Add a new product to your store.
      </p>

      <div className="mt-8 rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-sm text-gray-500">
          Product creation form with image upload, pricing, and inventory fields
          coming soon.
        </p>
      </div>
    </div>
  );
}
