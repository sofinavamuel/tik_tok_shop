import Link from 'next/link';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product',
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/shop"
        className="mb-8 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="aspect-square rounded-xl bg-gray-100" />

        <div>
          <p className="text-sm text-gray-500">Slug: {slug}</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Product Name
          </h1>
          <p className="mt-4 text-2xl font-semibold text-gray-900">$0.00</p>
          <p className="mt-4 text-gray-600">
            Product description will be loaded from the database.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <button className="flex items-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800">
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
