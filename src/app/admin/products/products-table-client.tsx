'use client';

import Link from 'next/link';
import { Plus, Pencil } from 'lucide-react';
import DataTable from '@/components/admin/DataTable';
import SearchBar from '@/components/admin/SearchBar';
import Pagination from '@/components/admin/Pagination';
import DeleteButton from '@/components/admin/DeleteButton';
import { formatPrice } from '@/lib/utils';
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
              —
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
        <span className="text-gray-500">{product.category_id || '—'}</span>
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

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-600">
            {count} product{count !== 1 ? 's' : ''} total
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar placeholder="Search products..." />
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            <Plus className="h-4 w-4" />
            New Product
          </Link>
        </div>
      </div>

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
