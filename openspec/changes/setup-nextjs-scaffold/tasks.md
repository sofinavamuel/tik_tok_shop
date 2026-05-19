# Tasks: Scaffold Next.js Project for TikTok Shop

## Phase 1: Foundation — Scaffold & Dependencies

- [x] 1.1 Run `npx create-next-app@latest .` with `--typescript --no-tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --use-npm` to bootstrap Next.js 15
- [x] 1.2 Install dev deps: `tailwindcss@3.4.17 postcss autoprefixer @tailwindcss/forms @tailwindcss/typography prettier prettier-plugin-tailwindcss`
- [x] 1.3 Install prod deps: `@insforge/sdk stripe @stripe/stripe-js @stripe/react-stripe-js lucide-react clsx tailwind-merge zod`
- [x] 1.4 Create `.env.local` with template vars for InsForge URL/key, Stripe keys, and app URL

## Phase 2: Config Files & Directory Structure

- [x] 2.1 Create `tailwind.config.ts` with content paths `./src/**/*.{ts,tsx}` and Tailwind v3.4 plugin imports
- [x] 2.2 Create `postcss.config.mjs` with Tailwind CSS and Autoprefixer plugins
- [x] 2.3 Create `.prettierrc` (semi, singleQuote, trailingComma, prettier-plugin-tailwindcss)
- [x] 2.4 Create `src/lib/env.ts` with Zod schema validating all required env vars
- [x] 2.5 Create `src/lib/utils.ts` with `cn()` helper (clsx + tailwind-merge)
- [x] 2.6 Create `src/lib/insforge.ts` with `createClient()` using InsForge base URL and anon key
- [x] 2.7 Create `src/lib/stripe.ts` (server-only Stripe instance) and `src/lib/stripe-client.ts` (client-side `loadStripe` loader)
- [x] 2.8 Create `src/styles/globals.css` with `@tailwind base/components/utilities` directives
- [x] 2.9 Create route group dirs: `(landing)/`, `(shop)/`, `(admin)/`, `api/stripe/webhook/`
- [x] 2.10 Create placeholder dirs: `src/components/{ui,landing,shop,admin}/`, `src/hooks/`
- [x] 2.11 Create type stubs: `src/types/{product,category,order}.ts`

## Phase 3: Layouts & Error Boundaries

- [x] 3.1 Create root `src/app/layout.tsx` with `<html>`, `<body>`, Inter font, and `globals.css` import
- [x] 3.2 Create `src/app/not-found.tsx` — 404 page placeholder
- [x] 3.3 Create `src/app/loading.tsx` — global loading spinner/skeleton
- [x] 3.4 Create `src/app/error.tsx` — global error boundary with retry button
- [x] 3.5 Create `(landing)/layout.tsx` — landing page wrapper
- [x] 3.6 Create `(shop)/layout.tsx` — shop layout with header placeholder
- [x] 3.7 Create `(admin)/layout.tsx` — admin layout with sidebar placeholder

## Phase 4: Placeholder Pages & Middleware

- [x] 4.1 Create landing pages: `/`, `/about`, `/services`, `/contact` (all under `(landing)/`)
- [x] 4.2 Create shop pages: `/shop`, `/shop/products/[slug]`, `/shop/cart`, `/shop/checkout`, `/shop/checkout/success`, `/shop/auth/login`, `/shop/auth/register`, `/shop/auth/callback`
- [x] 4.3 Create admin pages: `/admin`, `/admin/products`, `/admin/products/new`, `/admin/products/[id]`, `/admin/categories`, `/admin/categories/new`, `/admin/categories/[id]`, `/admin/orders`
- [x] 4.4 Create Stripe webhook route at `src/app/api/stripe/webhook/route.ts` — signature verification handler skeleton
- [x] 4.5 Create `src/middleware.ts` with matcher config and route protection skeleton (admin auth redirect)

## Phase 5: Verification

- [x] 5.1 Run `npx next build` — confirm zero errors and all route groups compile
- [x] 5.2 Run `npx prettier --check src/` — verify all files are formatted
- [x] 5.3 Run `npx next lint` — verify ESLint passes with no warnings
