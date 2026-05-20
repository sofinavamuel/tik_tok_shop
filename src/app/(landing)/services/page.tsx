import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Check } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { servicesData, methodologyData } from '@/lib/landing-data';
import { iconMap } from '@/components/landing/icon-map';

export const metadata: Metadata = {
  title: 'Nuestros Servicios',
  description:
    'Branding & Design, Social Commerce, Content AI y Web Development. Servicios profesionales para impulsar tu marca en TikTok Shop.',
  openGraph: {
    title: 'Nuestros Servicios | Espacio EME',
    description:
      'Branding & Design, Social Commerce, Content AI y Web Development. Servicios profesionales para impulsar tu marca en TikTok Shop.',
  },
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-dark py-20 md:py-28">
        <Container className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Nuestros Servicios
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Soluciones integrales para tu marca en TikTok Shop, desde la
            estrategia hasta la ejecución.
          </p>
        </Container>
      </section>

      {/* Detailed Service Cards */}
      <section className="bg-white py-20 md:py-28">
        <Container>
          <div className="space-y-24">
            {servicesData.map((service, index) => {
              const Icon = iconMap[service.iconName];
              const isReversed = index % 2 === 1;

              return (
                <div
                  key={service.slug}
                  className={`flex flex-col gap-10 ${
                    isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
                  }`}
                >
                  {/* Visual column */}
                  <div className="flex-1">
                    <div className="sticky top-24">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-white shadow-lg">
                        {Icon && <Icon className="h-8 w-8" />}
                      </div>
                      <h2 className="mt-6 text-2xl font-bold text-text sm:text-3xl">
                        {service.title}
                      </h2>
                      <p className="mt-4 text-lg leading-relaxed text-text-muted">
                        {service.longDescription}
                      </p>
                    </div>
                  </div>

                  {/* Details column */}
                  <div className="flex-1">
                    <div className="rounded-2xl border border-border bg-gray-50 p-8">
                      <h3 className="text-lg font-semibold text-text">
                        ¿Qué incluye?
                      </h3>
                      <ul className="mt-6 space-y-4">
                        {service.included.map((item) => (
                          <li key={item} className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                              <Check className="h-3 w-3" />
                            </span>
                            <span className="text-sm text-text">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-8">
                        <Link
                          href={`/contact`}
                          className="inline-flex items-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-dark hover:shadow-md"
                        >
                          Solicitar Información
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Methodology Teaser */}
      <section className="bg-gray-50 py-20 md:py-28">
        <Container className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Nuestra Metodología
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-muted">
            Todos nuestros servicios siguen el mismo proceso probado en 7 fases
            que garantiza resultados consistentes.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {methodologyData.map((step) => (
              <div
                key={step.step}
                className="rounded-xl border border-border bg-white p-4 text-center"
              >
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                  {step.step}
                </div>
                <h3 className="mt-3 text-sm font-semibold text-text">
                  {step.title}
                </h3>
                <p className="mt-1 text-xs text-text-muted">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-semibold text-brand hover:text-brand-dark"
            >
              Ver metodología completa
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
