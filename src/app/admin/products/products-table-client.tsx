'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, RefreshCw, Share2 } from 'lucide-react';
import DataTable from '@/components/admin/DataTable';
import SearchBar from '@/components/admin/SearchBar';
import Pagination from '@/components/admin/Pagination';
import DeleteButton from '@/components/admin/DeleteButton';
import { formatPrice } from '@/lib/utils';
import { syncProductsToStripe } from '@/lib/actions/sync-products';
import { syncProductsToStrapi } from '@/lib/actions/sync-products-strapi';
import { syncProductsToTikTokShop } from '@/lib/tiktok-shop/sync';
import type { Product } from '@/types';

interface ProductsTableClientProps {
  products: Product[];
  count: number;
  search?: string;
  page: number;
  totalPages: number;
}

export default function ProductsTableClient({
  products,
  count,
  search,
  page,
  totalPages,
}: ProductsTableClientProps) {
  const [syncingStripe, setSyncingStripe] = useState(false);
  const [syncingStrapi, setSyncingStrapi] = useState(false);
  const [syncingTikTok, setSyncingTikTok] = useState(false);
  const [syncResult, setSyncResult] = useState<{
    type: 'stripe' | 'strapi' | 'tiktok';
    message: string;
    variant: 'success' | 'error' | 'info';
  } | null>(null);

  const handleSyncStripe = async () => {
    setSyncingStripe(true);
    setSyncResult(null);

    const result = await syncProductsToStripe();

    if (result.error) {
      setSyncResult({ type: 'stripe', message: result.error, variant: 'error' });
    } else {
      const parts = [];
      if (result.synced) parts.push(`${result.synced} synced`);
      if (result.skipped) parts.push(`${result.skipped} already synced`);
      if (result.errors?.length) parts.push(`${result.errors.length} failed`);
      setSyncResult({
        type: 'stripe',
        message: parts.join(', ') || 'No products to sync',
        variant: result.errors?.length ? 'error' : 'success',
      });
    }

    setSyncingStripe(false);
  };

  const handleSyncStrapi = async () => {
    setSyncingStrapi(true);
    setSyncResult(null);

    const result = await syncProductsToStrapi();

    if (result.error) {
      setSyncResult({ type: 'strapi', message: result.error, variant: 'error' });
    } else {
      const parts = [];
      if (result.synced) parts.push(`${result.synced} synced`);
      if (result.skipped) parts.push(`${result.skipped} already synced`);
      if (result.errors?.length) parts.push(`${result.errors.length} failed`);
      setSyncResult({
        type: 'strapi',
        message: parts.join(', ') || 'No products to sync',
        variant: result.errors?.length ? 'error' : 'success',
      });
    }

    setSyncingStrapi(false);
  };

  const handleSyncTikTok = () => {
    setSyncingTikTok(true);
    setSyncResult(null);

    const result = syncProductsToTikTokShop(products);

    console.log('TikTok Shop mapped products:', result.mapped);
    if (result.skipped.length) {
      console.log('Skipped product IDs:', result.skipped);
    }

    setSyncResult({
      type: 'tiktok',
      message: `${result.mapped.length} products mapped to TikTok format (API access pending)`,
      variant: 'info',
    });

    setSyncingTikTok(false);
  };

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (product: Product) => (
        <div className="h-10 w-10 overflow-hidden rounded-lg bg-gray-100">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              &mdash;
            </div>
          )}
        </div>
      ),
    },
    { key: 'name', label: 'Name', sortable: true },
    {
      key: 'price',
      label: 'Price',
      render: (product: Product) => formatPrice(product.price),
    },
    {
      key: 'category',
      label: 'Category',
      render: (product: Product) => (
        <span className="text-gray-500">{product.category_id || '&mdash;'}</span>
      ),
    },
    {
      key: 'stripe',
      label: 'Stripe',
      render: (product: Product) =>
        product.stripe_price_id ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Synced
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
            Not synced
          </span>
        ),
    },
    {
      key: 'in_stock',
      label: 'Stock',
      render: (product: Product) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            product.in_stock
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {product.in_stock ? 'In Stock' : 'Out of Stock'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (product: Product) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/products/${product.id}`}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <DeleteButton id={product.id} type="product" label={product.name} />
        </div>
      ),
    },
  ];

  const resultVariantClasses = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-600">
            {count} product{count !== 1 ? 's' : ''} total
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SearchBar placeholder="Search products..." />
          <button
            onClick={handleSyncStrapi}
            disabled={syncingStrapi}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${syncingStrapi ? 'animate-spin' : ''}`} />
            {syncingStrapi ? 'Syncing...' : 'Sync to Strapi'}
          </button>
          <button
            onClick={handleSyncStripe}
            disabled={syncingStripe}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${syncingStripe ? 'animate-spin' : ''}`} />
            {syncingStripe ? 'Syncing...' : 'Sync to Stripe'}
          </button>
          <button
            onClick={handleSyncTikTok}
            disabled={syncingTikTok}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Share2 className={`h-4 w-4 ${syncingTikTok ? 'animate-spin' : ''}`} />
            {syncingTikTok ? 'Mapping...' : 'Sync to TikTok Shop'}
          </button>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            <Plus className="h-4 w-4" />
            New Product
          </Link>
        </div>
      </div>

      {/* Sync result message */}
      {syncResult && (
        <div
          className={`mt-4 rounded-lg border px-4 py-3 text-sm ${resultVariantClasses[syncResult.variant]}`}
        >
          <div className="flex items-center justify-between">
            <span>
              {syncResult.type === 'stripe' ? 'Stripe:' : syncResult.type === 'strapi' ? 'Strapi:' : 'TikTok Shop:'} {syncResult.message}
            </span>
            <button
              onClick={() => setSyncResult(null)}
              className="ml-4 text-sm font-medium opacity-60 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={products}
          loading={false}
          emptyMessage={
            search
              ? `No products matching "${search}".`
              : 'No products yet. Create your first product!'
          }
          keyExtractor={(product: Product) => product.id}
        />
      </div>

      <div className="mt-4">
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
