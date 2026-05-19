import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_INSFORGE_BASE_URL: z.string().url().optional().default('https://your-app.region.insforge.app'),
  NEXT_PUBLIC_INSFORGE_ANON_KEY: z.string().min(1).optional().default('your-anon-key'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional().default('pk_test_placeholder'),
  STRIPE_SECRET_KEY: z.string().min(1).optional().default('sk_test_placeholder'),
  STRIPE_WEBHOOK_SECRET: z.string().optional().default(''),
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default('http://localhost:3000'),
});

export type Env = z.infer<typeof envSchema>;

// Lazy validation — only throws at module level in dev, not during build
function getEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    if (typeof window !== 'undefined') {
      // Client-side: return defaults silently
      return envSchema.parse({});
    }
    console.warn('⚠️ Some environment variables are missing:', parsed.error.flatten().fieldErrors);
    return envSchema.parse({});
  }
  return parsed.data;
}

export const env: Env = getEnv();

// Helper to safely get Stripe server key (only on server)
export function getStripeSecretKey(): string | undefined {
  return process.env.STRIPE_SECRET_KEY || undefined;
}
