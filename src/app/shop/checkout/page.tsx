import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout',
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
      <p className="mt-4 text-gray-600">
        Checkout flow will be implemented with Stripe Payment Element.
      </p>

      <div className="mt-8 rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-sm text-gray-500">
          Stripe Checkout integration coming soon.
        </p>
      </div>
    </div>
  );
}
