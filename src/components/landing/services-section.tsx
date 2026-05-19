import { servicesData } from '@/lib/landing-data';
import { iconMap } from './icon-map';
import { Container } from '@/components/ui/container';

export function ServicesSection() {
  return (
    <section id="services" className="bg-white py-20 md:py-28">
      <Container>
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Nuestros Servicios
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">
            Todo lo que necesitas para impulsar tu marca en TikTok Shop, desde
            la identidad visual hasta la estrategia data-driven.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {servicesData.map((service) => {
            const Icon = iconMap[service.iconName];
            return (
              <a
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-transparent hover:shadow-xl"
              >
                {/* Gradient border on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative rounded-2xl bg-white">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100">
                    {Icon && <Icon className="h-6 w-6" />}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-gray-900">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {service.shortDesc}
                  </p>
                  <span className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 transition-colors group-hover:text-indigo-700">
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
