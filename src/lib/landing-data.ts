export interface ServiceItem {
  slug: string;
  title: string;
  iconName: string;
  shortDesc: string;
  description: string;
  longDescription: string;
  included: string[];
}

export const servicesData: ServiceItem[] = [
  {
    slug: 'branding',
    title: 'Branding & Design',
    iconName: 'Palette',
    shortDesc: 'Identidad visual que conecta con tu audiencia en TikTok',
    description:
      'Creamos la identidad visual de tu marca optimizada para TikTok Shop, desde el logotipo hasta el diseño completo del catálogo.',
    longDescription:
      'En Espacio EME diseñamos marcas que no solo se ven bien, sino que conectan con audiencias reales en TikTok. Nuestro proceso combina investigación de tendencias visuales con principios de diseño centrado en conversión. Cada elemento —color, tipografía, composición— está pensado para detener el scroll y generar engagement. Desde la identidad corporativa hasta las plantillas para vídeos virales, construimos una presencia visual coherente que tu audiencia reconoce al instante.',
    included: [
      'Auditoría de marca y competencia',
      'Diseño de logotipo y guía de marca',
      'Estrategia de contenido visual',
      'Diseño de catálogo para TikTok Shop',
      'Plantillas para vídeos y stories',
      'Manual de marca digital',
    ],
  },
  {
    slug: 'social-commerce',
    title: 'Social Commerce',
    iconName: 'BarChart3',
    shortDesc: 'Estrategia data-driven con Kalodata y TikTok Shop API',
    description:
      'Impulsamos tus ventas en TikTok Shop con estrategia basada en datos, análisis de competencia y optimización continua.',
    longDescription:
      'Convertimos datos en decisiones de venta. Usamos Kalodata, ScrapeCreators y la API de TikTok Shop para analizar tu categoría, identificar productos ganadores y optimizar tu catálogo. Monitoreamos a la competencia, detectamos tendencias emergentes y ajustamos tu estrategia de pricing y contenido en tiempo real. Cada recomendación está respaldada por datos concretos, no por corazonadas. Maximizamos tu ROI en TikTok Shop con un enfoque metódico y medible.',
    included: [
      'Análisis de competencia con Kalodata',
      'Identificación de productos ganadores',
      'Optimización de catálogo y pricing',
      'Monitoreo de tendencias en tiempo real',
      'Dashboard de KPIs personalizado',
      'Informes semanales de rendimiento',
    ],
  },
  {
    slug: 'content-ai',
    title: 'Content AI',
    iconName: 'Bot',
    shortDesc: 'Producción de vídeo con IA: guion, voz, edición y análisis',
    description:
      'Producimos contenido de alto impacto para TikTok Shop usando inteligencia artificial en todo el flujo creativo.',
    longDescription:
      'La IA transforma la producción de contenido. En Espacio EME usamos herramientas de IA generativa para crear guiones optimizados para conversión, voces profesionales con clonación neural, edición automatizada de vídeo y análisis predictivo de rendimiento. Nuestro flujo combina lo mejor de la tecnología con el criterio creativo humano. El resultado: contenido consistente, escalable y alineado con tu estrategia de marca, publicado con la frecuencia que TikTok exige.',
    included: [
      'Guionización con IA generativa',
      'Clonación de voz profesional',
      'Edición automatizada de vídeo',
      'Análisis predictivo de rendimiento',
      'Optimización de hooks y llamadas a la acción',
      'Calendario editorial automatizado',
    ],
  },
  {
    slug: 'web-development',
    title: 'Web Development',
    iconName: 'Globe',
    shortDesc: 'Tiendas y dashboards con Next.js, Strapi e InsForge',
    description:
      'Desarrollamos tiendas TikTok Shop personalizadas, dashboards de analytics y herramientas internas con tecnología moderna.',
    longDescription:
      'Construimos la infraestructura digital que tu operación necesita. Desde tiendas headless con Next.js y Stripe hasta dashboards de analytics con datos en tiempo real, pasando por sistemas de gestión de contenido con Strapi y backend serverless con InsForge. Nuestro stack tecnológico está elegido para maximizar velocidad de desarrollo, escalabilidad y mantenibilidad. Entregamos código limpio, documentado y listo para producción.',
    included: [
      'Tiendas headless con Next.js',
      'Dashboards de analytics personalizados',
      'CMS con Strapi o Headless CMS',
      'Backend serverless con InsForge',
      'Integración Stripe y pasarelas de pago',
      'Despliegue y monitoreo continuo',
    ],
  },
];

export interface MethodologyStep {
  step: number;
  title: string;
  description: string;
}

export const methodologyData: MethodologyStep[] = [
  {
    step: 1,
    title: 'Research',
    description: 'Análisis de datos (Kalodata / ScrapeCreators)',
  },
  {
    step: 2,
    title: 'Analysis',
    description: 'Competencia y creadores',
  },
  {
    step: 3,
    title: 'References',
    description: 'Top 10 vídeos referentes',
  },
  {
    step: 4,
    title: 'Briefing',
    description: 'Plantilla replicable',
  },
  {
    step: 5,
    title: 'Production',
    description: 'Vídeo con IA',
  },
  {
    step: 6,
    title: 'Documentation',
    description: 'Manual y formación',
  },
  {
    step: 7,
    title: 'Delivery',
    description: 'Presentación al cliente',
  },
];

export interface StatItem {
  value: string;
  label: string;
}

export const statsData: StatItem[] = [
  { value: '12+', label: 'Productos' },
  { value: '4', label: 'Categorías' },
  { value: '3', label: 'Mercados' },
  { value: '60h', label: 'Metodología' },
];

export interface ValueItem {
  title: string;
  description: string;
  iconName: string;
}

export const valuesData: ValueItem[] = [
  {
    title: 'Innovación',
    description:
      'Aplicamos tecnología de vanguardia para resolver problemas reales de negocio.',
    iconName: 'Lightbulb',
  },
  {
    title: 'Data-Driven',
    description:
      'Cada decisión está respaldada por datos concretos, no por intuiciones.',
    iconName: 'TrendingUp',
  },
  {
    title: 'Creatividad',
    description:
      'Combinamos el poder de la IA con el criterio creativo humano.',
    iconName: 'Sparkles',
  },
  {
    title: 'Transparencia',
    description:
      'Comunicación clara, procesos documentados y resultados medibles.',
    iconName: 'Eye',
  },
];

export const footerLinks = {
  company: [
    { label: 'Sobre Nosotros', href: '/about' },
    { label: 'Servicios', href: '/services' },
    { label: 'Contacto', href: '/contact' },
  ],
  services: [
    { label: 'Branding & Design', href: '/services/branding' },
    { label: 'Social Commerce', href: '/services/social-commerce' },
    { label: 'Content AI', href: '/services/content-ai' },
    { label: 'Web Development', href: '/services/web-development' },
  ],
};
