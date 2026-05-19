import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight, Check, ArrowLeft } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { servicesData } from '@/lib/landing-data';
import { iconMap } from '@/components/landing/icon-map';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return servicesData.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);

  if (!service) return {};

  return {
    title: service.title,
    description: service.shortDesc,
    openGraph: {
      title: `${service.title} | Espacio EME`,
      description: service.shortDesc,
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const Icon = iconMap[service.iconName];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 py-20 md:py-28">
        <Container>
          <Link
            href="/services"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-indigo-200 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a servicios
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
              {Icon && <Icon className="h-8 w-8" />}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {service.title}
              </h1>
              <p className="mt-2 text-lg text-indigo-100">
                {service.shortDesc}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="bg-white py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-3xl">
            {/* Description */}
            <div className="prose prose-gray max-w-none">
              <p className="text-lg leading-relaxed text-gray-600">
                {service.longDescription}
              </p>
            </div>

            {/* What's included */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900">
                ¿Qué incluye este servicio?
              </h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {service.included.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-gray-200 p-4"
                  >
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="mt-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900">
                ¿Interesado en este servicio?
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Contáctanos y te enviaremos una propuesta personalizada para tu
                marca.
              </p>
              <div className="mt-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-indigo-500 hover:to-purple-500 hover:shadow-md"
                >
                  Solicitar Información
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
