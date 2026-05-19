'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { use } from 'react';
import {
  ArrowLeft,
  ShoppingCart,
  Minus,
  Plus,
  Package,
  MapPin,
} from 'lucide-react';
import { fetchProductBySlug, fetchProducts } from '@/lib/products';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

// ---------------------------------------------------------------------------
// Loading Skeleton
// ---------------------------------------------------------------------------

function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 h-4 w-32 animate-pulse rounded bg-gray-200" />
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-xl bg-gray-200" />
        <div className="space-y-4">
          <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-6 w-1/3 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
          <div className="h-12 w-48 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Product Detail Page
// ---------------------------------------------------------------------------

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);

      const result = await fetchProductBySlug(slug);

      if (result.error) {
        setError(result.error);
        setProduct(null);
      } else if (result.data) {
        setProduct(result.data);
        setSelectedImage(0);

        // Load related products from the same category
        if (result.data.category_id) {
          const related = await fetchProducts({
            categoryId: result.data.category_id,
          });
          if (related.data) {
            setRelatedProducts(
              related.data.filter((p) => p.id !== result.data!.id).slice(0, 4),
            );
          }
        }
      }

      setLoading(false);
    };

    loadProduct();
  }, [slug]);

  // Loading state
  if (loading) {
    return <ProductDetailSkeleton />;
  }

  // Not found / error state
  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-lg font-semibold text-gray-900">
          Product not found
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {error || 'The product you are looking for does not exist.'}
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <Link
        href="/shop"
        className="mb-8 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* ---- Image Gallery ---- */}
        <div>
          <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
            {product.images?.[selectedImage] ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package className="h-16 w-16 text-gray-300" />
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    idx === selectedImage ? 'border-black' : 'border-transparent'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ---- Product Details ---- */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-4 text-2xl font-semibold text-gray-900">
            {formatPrice(product.price)}
          </p>

          {/* Stock Badge */}
          <div className="mt-4">
            {product.in_stock ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                In Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                Out of Stock
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="mt-6 text-gray-600 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Material & Origin */}
          {(product.material || product.origin) && (
            <div className="mt-6 space-y-3">
              {product.material && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="h-4 w-4" />
                  <span>Material: {product.material}</span>
                </div>
              )}
              {product.origin && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>Origin: {product.origin}</span>
                </div>
              )}
            </div>
          )}

          {/* Add to Cart */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-lg border border-gray-300">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 text-gray-600 hover:text-gray-900"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[3rem] text-center text-sm font-medium">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(99, quantity + 1))}
                className="p-3 text-gray-600 hover:text-gray-900"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => {
                addItem(product, quantity);
                setQuantity(1);
              }}
              disabled={!product.in_stock}
              className="flex items-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* ---- Related Products ---- */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-gray-900">
            Related Products
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((related) => (
              <Link
                key={related.id}
                href={`/shop/products/${related.slug}`}
                className="group rounded-xl border border-gray-200 p-4 transition-colors hover:border-gray-300"
              >
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                  {related.images?.[0] ? (
                    <img
                      src={related.images[0]}
                      alt={related.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package className="h-8 w-8 text-gray-300" />
                    </div>
                  )}
                </div>
                <h3 className="mt-3 text-sm font-medium text-gray-900 line-clamp-1">
                  {related.name}
                </h3>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {formatPrice(related.price)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
