import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Espacio EME brand colors (from espacioeme.com)
        brand: {
          DEFAULT: '#ef2d56',    // Primary accent - vibrant pink/red
          dark: '#7a0921',       // Hover state - dark red
          darker: '#1b0207',     // Focus state - very dark red
          light: '#f1cfd6',      // Light pink accent
        },
        text: {
          DEFAULT: '#191b1d',    // Primary text - near black
          muted: '#6c747d',      // Secondary text - gray
        },
        dark: {
          DEFAULT: '#0a0a0a',    // Dark backgrounds
        },
        border: {
          DEFAULT: '#e8e8e8',    // Light gray borders
        },
      },
      fontFamily: {
        heading: ['var(--font-montserrat)', 'sans-serif'],
        body: ['var(--font-raleway)', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
