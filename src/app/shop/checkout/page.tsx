'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CreditCard,
  ShoppingBag,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';
import { createCheckoutSession } from '@/lib/actions/stripe';

// ---------------------------------------------------------------------------
// Checkout Page
// ---------------------------------------------------------------------------

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalItems, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Empty cart — redirect prompt
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        <div className="mt-12 text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-300" />
          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Your cart is empty
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Add some products before checking out.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    const result = await createCheckoutSession(items);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (result.url) {
      router.push(result.url);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/shop/cart"
        className="mb-8 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Cart
      </Link>

      <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>

      {/* Order Summary */}
      <div className="mt-8 rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {item.product.images?.[0] ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ShoppingBag className="h-4 w-4 text-gray-300" />
                    </div>
                  )}
                </div>
                <span className="text-gray-900 line-clamp-1">
                  {item.product.name}
                </span>
              </div>
              <span className="text-gray-600">
                {item.quantity} &times; {formatPrice(item.product.price)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Subtotal ({totalItems} items)
            </span>
            <span className="font-medium text-gray-900">
              {formatPrice(totalPrice)}
            </span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
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
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Pay Button */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <CreditCard className="h-4 w-4" />
        {loading ? 'Redirecting to Stripe...' : 'Pay with Stripe'}
      </button>

      <p className="mt-4 text-center text-xs text-gray-500">
        Secure payment processed by Stripe. No payment details are stored on our
        servers.
      </p>
    </div>
  );
}
