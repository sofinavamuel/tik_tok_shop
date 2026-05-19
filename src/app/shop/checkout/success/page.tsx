import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Confirmed',
};

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
      <h1 className="mt-6 text-3xl font-bold text-gray-900">
        Order Confirmed!
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Thank you for your purchase. You will receive a confirmation email
        shortly.
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
