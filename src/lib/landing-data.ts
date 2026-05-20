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
      'Creamos la identidad visual de tu marca optimizada para contenido en TikTok, desde el logotipo hasta plantillas para vídeos virales.',
    longDescription:
      'En Espacio EME diseñamos marcas que no solo se ven bien, sino que conectan con audiencias reales en TikTok. Nuestro proceso combina investigación de tendencias visuales con principios de diseño centrado en engagement. Cada elemento —color, tipografía, composición— está pensado para detener el scroll y generar interacción. Desde la identidad corporativa hasta las plantillas para vídeos que siguen patrones virales, construimos una presencia visual coherente que tu audiencia reconoce al instante.',
    included: [
      'Auditoría de marca y competencia',
      'Diseño de logotipo y guía de marca',
      'Estrategia de contenido visual',
      'Plantillas para vídeos virales',
      'Diseño de thumbnails y hooks visuales',
      'Manual de marca digital',
    ],
  },
  {
    slug: 'social-commerce',
    title: 'Market Intelligence',
    iconName: 'BarChart3',
    shortDesc: 'Inteligencia de mercado con Kalodata y datos de TikTok Shop',
    description:
      'Detectamos productos trending, analizamos creators top y extraemos patrones de vídeos virales para informar tu estrategia de contenido.',
    longDescription:
      'Convertimos datos de TikTok Shop en ventajas creativas. Usamos Kalodata y ScrapeCreators para analizar qué productos están explotando, qué creators generan más engagement, y qué hooks, estructuras y patrones funcionan mejor en cada categoría. No se trata de vender en TikTok Shop — se trata de entender qué funciona y aplicar ese conocimiento a tu contenido. Cada recomendación está respaldada por datos concretos: GMV, retention rates, engagement patterns. Tu equipo creativo recibe briefings con ideas probadas, no suposiciones.',
    included: [
      'Análisis de productos trending con Kalodata',
      'Identificación de creators top por nicho',
      'Extracción de hooks y estructuras virales',
      'Patrones de retención y engagement',
      'Dashboard de inteligencia de mercado',
      'Informes semanales de tendencias',
    ],
  },
  {
    slug: 'content-ai',
    title: 'Content AI Studio',
    iconName: 'Bot',
    shortDesc: 'Generación de ideas, guiones y hooks con IA basada en datos reales',
    description:
      'Nuestra IA analiza patrones de vídeos virales y genera ideas de contenido adaptadas para tu marca con guiones, hooks y dirección visual.',
    longDescription:
      'La IA no reemplaza la creatividad — la potencia. Nuestro Content Studio toma datos reales de TikTok Shop (productos trending, hooks que funcionan, estructuras de alta retención) y genera 5 ideas de contenido por producto con guiones completos, hooks alternativos, dirección visual y audio. Cada idea incluye un score de confianza basado en patrones reales. Tu equipo creativo recibe material listo para producir: no ideas genéricas, sino conceptos adaptados de lo que YA funciona en el ecosistema. Combinamos Claude Sonnet 4.5 con nuestro pipeline propietario para entregar briefings que tu equipo puede ejecutar inmediatamente.',
    included: [
      'Generación de 5 ideas de contenido por producto trending',
      'Hooks alternativos con tipos clasificados',
      'Guiones con estructura de timestamps',
      'Dirección visual y de audio',
      'Score de confianza basado en datos',
      'Briefings listos para producción',
    ],
  },
  {
    slug: 'web-development',
    title: 'Web Development',
    iconName: 'Globe',
    shortDesc: 'Dashboards y herramientas con Next.js, Strapi e InsForge',
    description:
      'Desarrollamos dashboards de analytics, herramientas de content intelligence y plataformas internas con tecnología moderna.',
    longDescription:
      'Construimos la infraestructura digital que tu operación de contenido necesita. Desde dashboards de market intelligence con datos de Kalodata en tiempo real hasta herramientas internas de gestión de contenido con Strapi y backend serverless con InsForge. Nuestro Content Studio es un ejemplo: una plataforma que combina datos de mercado con IA generativa para producir briefings de contenido. Entregamos código limpio, documentado y listo para producción.',
    included: [
      'Dashboards de market intelligence',
      'Herramientas de content generation con IA',
      'CMS con Strapi para gestión de contenido',
      'Backend serverless con InsForge',
      'Integración con APIs de datos (Kalodata, ScrapeCreators)',
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
  { value: '12+', label: 'Productos Trending' },
  { value: '5', label: 'Categorías Analizadas' },
  { value: '10', label: 'Video Patterns' },
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
