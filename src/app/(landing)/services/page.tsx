import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services',
};

const services = [
  {
    title: 'Creator Partnerships',
    description:
      'We collaborate with top creators to bring you authentic product recommendations and reviews.',
  },
  {
    title: 'Trend Forecasting',
    description:
      'Our team analyzes social media trends to stock what is about to blow up.',
  },
  {
    title: 'Global Shipping',
    description:
      'We ship worldwide with tracking and insurance on every order.',
  },
  {
    title: 'Easy Returns',
    description:
      'Not happy with your purchase? Return it within 30 days for a full refund.',
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        Our Services
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Everything you need for a great shopping experience.
      </p>
      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        {services.map((service) => (
          <div
            key={service.title}
            className="rounded-xl border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              {service.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
