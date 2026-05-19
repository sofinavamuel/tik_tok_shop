import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        About TikTok Shop
      </h1>
      <div className="mt-8 space-y-6 text-lg leading-8 text-gray-600">
        <p>
          TikTok Shop is your destination for curated, trend-driven products. We
          connect creators with shoppers to bring you the best of what is
          trending.
        </p>
        <p>
          Our mission is to make shopping fun, social, and seamless. Every
          product in our catalog is handpicked by creators who know what is
          next.
        </p>
        <p>
          Founded in 2026, we are committed to quality, authenticity, and
          exceptional customer service.
        </p>
      </div>
    </div>
  );
}
