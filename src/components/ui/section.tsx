import { cn } from '@/lib/utils';
import { Container } from './container';

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  variant?: 'light' | 'dark' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  id?: string;
  containerClassName?: string;
}

const sizeClasses = {
  sm: 'py-12 md:py-16',
  md: 'py-16 md:py-20',
  lg: 'py-20 md:py-28',
};

const variantClasses = {
  light: 'bg-white',
  dark: 'bg-dark text-white',
  gradient:
    'bg-dark text-white',
};

export function Section({
  children,
  title,
  subtitle,
  variant = 'light',
  size = 'md',
  className,
  id,
  containerClassName,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(sizeClasses[size], variantClasses[variant], className)}
    >
      <Container className={containerClassName}>
        {title && (
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-4 text-lg leading-relaxed opacity-80">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
