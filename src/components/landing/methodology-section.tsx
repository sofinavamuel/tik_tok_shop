import { methodologyData } from '@/lib/landing-data';
import { iconMap } from './icon-map';
import { Container } from '@/components/ui/container';

const stepEmojis = ['🔍', '👥', '🏆', '📝', '🎬', '📚', '🎤'];

export function MethodologySection() {
  return (
    <section className="bg-gray-50 py-20 md:py-28">
      <Container>
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Nuestra Metodología
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">
            Un proceso probado en 7 fases para garantizar resultados
            consistentes y medibles.
          </p>
        </div>

        <div className="relative">
          {/* Desktop: horizontal timeline */}
          <div className="hidden gap-0 lg:grid lg:grid-cols-7">
            {methodologyData.map((step, index) => {
              const Icon = iconMap[step.title];
              return (
                <div key={step.step} className="relative px-3 text-center">
                  {/* Connecting line (not on last) */}
                  {index < methodologyData.length - 1 && (
                    <div className="absolute left-[60%] top-6 h-0.5 w-[80%] bg-gradient-to-r from-indigo-300 to-purple-300" />
                  )}

                  {/* Step circle */}
                  <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                    <span className="text-lg font-bold">{step.step}</span>
                  </div>

                  {/* Emoji */}
                  <div className="mt-3 text-2xl">{stepEmojis[index]}</div>

                  {/* Title */}
                  <h3 className="mt-2 text-sm font-bold text-gray-900">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Mobile/tablet: vertical timeline */}
          <div className="lg:hidden">
            {methodologyData.map((step, index) => (
              <div key={step.step} className="relative flex gap-5 pb-10 last:pb-0">
                {/* Vertical line */}
                {index < methodologyData.length - 1 && (
                  <div className="absolute left-[23px] top-12 h-full w-0.5 bg-gradient-to-b from-indigo-300 to-purple-300" />
                )}

                {/* Step circle */}
                <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
                  <span className="text-base font-bold">{step.step}</span>
                </div>

                {/* Content */}
                <div className="min-w-0 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{stepEmojis[index]}</span>
                    <h3 className="text-base font-semibold text-gray-900">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
