'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ShoppingCart, ShoppingBag } from 'lucide-react';
import { fetchProducts } from '@/lib/products';
import { fetchCategories } from '@/lib/categories';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';
import type { Product, Category } from '@/types';

// ---------------------------------------------------------------------------
// Loading Skeleton
// ---------------------------------------------------------------------------

function ProductGridSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Category skeleton */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-10 w-24 animate-pulse rounded-full bg-gray-200"
          />
        ))}
      </div>
      {/* Product grid skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-200 p-4"
          >
            <div className="aspect-square animate-pulse rounded-lg bg-gray-200" />
            <div className="mt-4 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shop Page
// ---------------------------------------------------------------------------

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [productsResult, categoriesResult] = await Promise.all([
      fetchProducts(),
      fetchCategories(),
    ]);

    if (productsResult.error) {
      setError(productsResult.error);
    } else {
      setProducts(productsResult.data ?? []);
    }

    if (categoriesResult.error) {
      console.error('Failed to load categories:', categoriesResult.error);
    } else {
      setCategories(categoriesResult.data ?? []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredProducts = activeCategory
    ? products.filter((p) => p.category_id === activeCategory)
    : products;

  // Loading state
  if (loading) {
    return <ProductGridSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          Failed to load products
        </h2>
        <p className="mt-2 text-sm text-gray-600">{error}</p>
        <button
          onClick={loadData}
          className="mt-6 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Category Filter Tabs */}
      {categories.length > 0 && (
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === null
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No products found
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            {activeCategory
              ? 'No products in this category yet.'
              : 'Check back later for new arrivals.'}
          </p>
        </div>
      ) : (
        /* Product Grid */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group rounded-xl border border-gray-200 p-4 transition-colors hover:border-gray-300"
            >
              <Link href={`/shop/products/${product.slug}`}>
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-gray-300" />
                    </div>
                  )}
                </div>
              </Link>
              <div className="mt-4">
                <Link href={`/shop/products/${product.slug}`}>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                {product.material && (
                  <p className="mt-1 text-xs text-gray-500">
                    {product.material}
                  </p>
                )}
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatPrice(product.price)}
                  </p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addItem(product);
                    }}
                    className="rounded-lg bg-black p-2 text-white transition-colors hover:bg-gray-800"
                    aria-label="Add to cart"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
