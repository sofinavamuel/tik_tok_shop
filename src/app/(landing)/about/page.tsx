import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { valuesData } from '@/lib/landing-data';
import { iconMap } from '@/components/landing/icon-map';
import { Section } from '@/components/ui/section';

export const metadata: Metadata = {
  title: 'Sobre Nosotros',
  description:
    'Conoce Espacio EME, la agencia creativa que combina diseño, tecnología y datos para impulsar tu presencia en TikTok Shop.',
  openGraph: {
    title: 'Sobre Nosotros | Espacio EME',
    description:
      'Conoce Espacio EME, la agencia creativa que combina diseño, tecnología y datos para impulsar tu presencia en TikTok Shop.',
  },
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-dark py-20 md:py-28">
        <Container className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Sobre Nosotros
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Diseño, tecnología y datos para impulsar tu marca en TikTok Shop
          </p>
        </Container>
      </section>

      {/* Story */}
      <Section title="Nuestra Historia" size="lg">
        <div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-text-muted">
          <p>
            <strong className="text-text">Somos Espacio EME</strong>, una
            agencia creativa que combina diseño, tecnología y datos para
            impulsar tu presencia en TikTok Shop.
          </p>
          <p>
            Nacimos de la convicción de que el comercio social necesita un
            enfoque diferente. No basta con publicar contenido: hay que
            entender los datos, analizar a la competencia, identificar
            tendencias y producir contenido optimizado para conversión. Todo
            con un ritmo que solo la inteligencia artificial puede sostener.
          </p>
          <p>
            Hoy trabajamos con marcas de{' '}
            <strong className="text-text">
              4 categorías distintas en 3 mercados
            </strong>
            , ayudándolas a construir presencia, vender más y escalar su
            operación en TikTok Shop.
          </p>
        </div>
      </Section>

      {/* Values */}
      <Section
        variant="dark"
        size="lg"
        title="Nuestros Valores"
        subtitle="Principios que guían cada proyecto que emprendemos"
      >
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {valuesData.map((value) => {
            const Icon = iconMap[value.iconName];
            return (
              <div
                key={value.title}
                className="rounded-2xl border border-gray-800 bg-gray-800/50 p-6 text-center backdrop-blur-sm"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand/20 text-brand">
                  {Icon && <Icon className="h-6 w-6" />}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Approach */}
      <Section
        size="lg"
        title="Nuestro Enfoque"
        subtitle="Cómo trabajamos para lograr resultados"
      >
        <div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-text-muted">
          <p>
            No creemos en recetas mágicas. Cada marca, cada categoría, cada
            mercado tiene sus propias dinámicas. Por eso nuestro proceso
            comienza siempre con{' '}
            <strong className="text-text">investigación y datos</strong>,
            no con suposiciones.
          </p>
          <p>
            Usamos herramientas como Kalodata y ScrapeCreators para analizar
            el mercado, estudiar a la competencia y detectar oportunidades.
            Luego aplicamos inteligencia artificial para escalar la producción
            de contenido sin sacrificar calidad. Y finalmente medimos,
            ajustamos y repetimos.
          </p>
          <p>
            El resultado: una máquina de contenido data-driven que produce
            resultados consistentes, medibles y escalables.
          </p>
        </div>
      </Section>
    </>
  );
}
