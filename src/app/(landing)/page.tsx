import Link from 'next/link';
import { ShoppingBag, Sparkles, Truck, Shield } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TikTok Shop - Shop the Latest Trends',
};

const features = [
  {
    icon: Sparkles,
    title: 'Trending Products',
    description: 'Discover the latest trends picked by our creators.',
  },
  {
    icon: Truck,
    title: 'Fast Shipping',
    description: 'Free shipping on orders over $50. Delivered in 3-5 days.',
  },
  {
    icon: Shield,
    title: 'Secure Shopping',
    description: 'Your payment info is protected with industry-grade security.',
  },
];

export default function LandingPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Shop the Trends You Love
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Discover curated products from your favorite creators. From
              fashion to tech, find what is trending right now.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/shop"
                className="rounded-lg bg-black px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
              >
                <ShoppingBag className="mr-2 inline-block h-4 w-4" />
                Start Shopping
              </Link>
              <Link
                href="/about"
                className="rounded-lg border border-gray-300 px-8 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Why Shop With Us?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We make it easy to find and buy products you will love.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-xl border border-gray-200 p-8 text-center"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-black">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
