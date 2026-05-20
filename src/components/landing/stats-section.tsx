import { statsData } from '@/lib/landing-data';
import { Container } from '@/components/ui/container';

export function StatsSection() {
  return (
    <section className="bg-dark py-16 md:py-20">
      <Container>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {statsData.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-extrabold tracking-tight text-brand md:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-medium text-text-muted">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
