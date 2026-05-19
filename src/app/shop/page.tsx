import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop',
};

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <div className="flex items-center gap-4">
          <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:ring-black">
            <option>All Categories</option>
          </select>
          <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:ring-black">
            <option>Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Link
            key={i}
            href="/shop/products/placeholder-product"
            className="group rounded-xl border border-gray-200 p-4 transition-colors hover:border-gray-300"
          >
            <div className="aspect-square rounded-lg bg-gray-100" />
            <div className="mt-4 space-y-2">
              <div className="h-4 w-3/4 rounded bg-gray-100" />
              <div className="h-4 w-1/2 rounded bg-gray-100" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          Product catalog coming soon
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Products will be loaded from the InsForge backend.
        </p>
      </div>
    </div>
  );
}
