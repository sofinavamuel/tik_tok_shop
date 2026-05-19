'use client';

import Link from 'next/link';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Cart Page
// ---------------------------------------------------------------------------

function CartItemSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 p-4">
      <div className="h-20 w-20 animate-pulse rounded-lg bg-gray-200" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalItems, totalPrice } =
    useCart();

  // Empty state
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        <div className="mt-12 text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-300" />
          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Your cart is empty
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Add some products to get started.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
      <p className="mt-1 text-sm text-gray-500">
        {totalItems} {totalItems === 1 ? 'item' : 'items'}
      </p>

      {/* Cart Items */}
      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center gap-4 rounded-xl border border-gray-200 p-4"
          >
            {/* Product Image */}
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
              {item.product.images?.[0] ? (
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-gray-300" />
                </div>
              )}
            </div>

            {/* Product Info + Controls */}
            <div className="min-w-0 flex-1">
              <Link
                href={`/shop/products/${item.product.slug}`}
                className="text-sm font-medium text-gray-900 hover:underline line-clamp-1"
              >
                {item.product.name}
              </Link>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {formatPrice(item.product.price)}
              </p>

              <div className="mt-2 flex items-center gap-2">
                {/* Quantity Controls */}
                <div className="flex items-center rounded-lg border border-gray-300">
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity - 1)
                    }
                    className="p-1.5 text-gray-600 hover:text-gray-900"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="min-w-[2rem] text-center text-xs font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }
                    className="p-1.5 text-gray-600 hover:text-gray-900"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="rounded-lg p-1.5 text-gray-400 hover:text-red-500"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Line Total */}
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="mt-8 rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Subtotal ({totalItems} items)
            </span>
            <span className="font-medium text-gray-900">
              {formatPrice(totalPrice)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="text-gray-500">Calculated at next step</span>
          </div>
        </div>
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="flex justify-between">
            <span className="text-base font-semibold text-gray-900">Total</span>
            <span className="text-base font-semibold text-gray-900">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>
        <Link
          href="/shop/checkout"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
        >
          Proceed to Checkout
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
