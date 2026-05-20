import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Clapperboard } from 'lucide-react';
import { ServicesSection } from '@/components/landing/services-section';
import { MethodologySection } from '@/components/landing/methodology-section';
import { StatsSection } from '@/components/landing/stats-section';

export const metadata: Metadata = {
  title: 'Espacio EME — Content Creation Powered by TikTok Shop Data',
  description:
    'Usamos datos de TikTok Shop para crear contenido viral. Detectamos productos trending, analizamos hooks que funcionan y generamos guiones con IA para tu marca.',
  openGraph: {
    title: 'Espacio EME — Content Creation Powered by TikTok Shop Data',
    description:
      'Usamos datos de TikTok Shop para crear contenido viral. Detectamos productos trending, analizamos hooks que funcionan y generamos guiones con IA para tu marca.',
  },
};

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-green-400" />
              Agencia de Contenido &amp; Data-Driven Creative
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Creamos{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-amber-300">
                contenido viral
              </span>{' '}
              con datos de TikTok Shop
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-indigo-100 sm:text-xl">
              No vendemos en TikTok Shop — lo usamos como fuente de datos. Detectamos
              productos trending, analizamos los hooks y estructuras que mejor funcionan,
              y generamos ideas de contenido con IA para tu marca o clientes.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/services"
                className="inline-flex items-center rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-indigo-700 shadow-lg transition-all hover:bg-indigo-50 hover:shadow-xl"
              >
                Ver Servicios
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-xl border-2 border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-all hover:border-white/50 hover:bg-white/10"
              >
                <Clapperboard className="mr-2 h-5 w-5" />
                Hablar con un experto
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Services Cards */}
      <ServicesSection />

      {/* Stats */}
      <StatsSection />

      {/* Methodology Timeline */}
      <MethodologySection />

      {/* CTA Section */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              ¿Listo para crear contenido que funciona?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              Nuestra metodología usa datos reales de TikTok Shop para generar ideas
              de contenido con hooks, guiones y ángulos que ya sabemos que funcionan.
            </p>
            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:from-indigo-500 hover:to-purple-500 hover:shadow-xl"
              >
                Contáctanos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
