import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';

export const metadata: Metadata = {
  title: {
    default: 'Espacio EME — Creative Agency & Social Commerce',
    template: '%s | Espacio EME',
  },
  description:
    'Agencia creativa especializada en TikTok Shop, branding, producción de contenido con inteligencia artificial y desarrollo web. Estrategia data-driven para tu tienda en TikTok.',
  openGraph: {
    title: 'Espacio EME — Creative Agency & Social Commerce',
    description:
      'Agencia creativa especializada en TikTok Shop, branding, producción de contenido con IA y desarrollo web.',
    siteName: 'Espacio EME',
    locale: 'es_ES',
    type: 'website',
  },
};

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
