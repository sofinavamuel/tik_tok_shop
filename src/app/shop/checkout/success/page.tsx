'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, AlertCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { verifyCheckoutSession } from '@/lib/actions/stripe';
import { formatPrice } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Loading
// ---------------------------------------------------------------------------

function LoadingState() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-gray-200" />
      <div className="mt-6 space-y-3">
        <div className="mx-auto h-8 w-64 animate-pulse rounded bg-gray-200" />
        <div className="mx-auto h-4 w-48 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Content (needs Suspense because it uses useSearchParams)
// ---------------------------------------------------------------------------

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const sessionId = searchParams.get('session_id');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const [sessionData, setSessionData] = useState<{
    status: string;
    customerEmail?: string | null;
    amountTotal?: number | null;
  } | null>(null);

  useEffect(() => {
    if (!sessionId) {
      router.replace('/shop');
      return;
    }

    let cancelled = false;

    const verify = async () => {
      const result = await verifyCheckoutSession(sessionId);

      if (cancelled) return;

      if (result.error) {
        setStatus('error');
        return;
      }

      setSessionData(result as typeof sessionData);
      setStatus('success');
      clearCart();
    };

    // Small delay to ensure cart context has hydrated
    const timer = setTimeout(verify, 100);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [sessionId, router, clearCart]);

  if (status === 'loading') {
    return <LoadingState />;
  }

  if (status === 'error') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Verification Failed
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          We could not verify your payment. Please contact support if you were
          charged.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
      <h1 className="mt-6 text-3xl font-bold text-gray-900">
        Order Confirmed!
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Thank you for your purchase.
        {sessionData?.customerEmail && (
          <span>
            {' '}
            A confirmation will be sent to{' '}
            <span className="font-medium text-gray-900">
              {sessionData.customerEmail}
            </span>
            .
          </span>
        )}
      </p>
      {sessionData?.amountTotal != null && (
        <p className="mt-2 text-sm text-gray-500">
          Total charged: {formatPrice(sessionData.amountTotal / 100)}
        </p>
      )}
      <div className="mt-8 flex items-center justify-center gap-4">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
        >
          <ShoppingBag className="h-4 w-4" />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page (wraps content in Suspense for useSearchParams)
// ---------------------------------------------------------------------------

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SuccessContent />
    </Suspense>
  );
}
