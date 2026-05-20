import { servicesData } from '@/lib/landing-data';
import { iconMap } from './icon-map';
import { Container } from '@/components/ui/container';

export function ServicesSection() {
  return (
    <section id="services" className="bg-white py-20 md:py-28">
      <Container>
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Nuestros Servicios
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-text-muted">
            Todo lo que necesitas para crear contenido viral con datos reales, desde
            la inteligencia de mercado hasta la producción con IA.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {servicesData.map((service) => {
            const Icon = iconMap[service.iconName];
            return (
              <a
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group relative overflow-hidden rounded-lg border border-border bg-white p-6 transition-all hover:border-brand hover:shadow-lg"
              >
                {/* Brand accent line on hover */}
                <div className="absolute left-0 top-0 h-0.5 w-0 bg-brand transition-all group-hover:w-full" />
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand/10 text-brand transition-colors group-hover:bg-brand/20">
                    {Icon && <Icon className="h-6 w-6" />}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-text">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">
                    {service.shortDesc}
                  </p>
                  <span className="mt-4 inline-flex items-center text-sm font-medium text-brand transition-colors group-hover:text-brand-dark">
                    Saber más{' '}
                    <svg
                      className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
