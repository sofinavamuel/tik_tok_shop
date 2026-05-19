# Apply Progress — setup-nextjs-scaffold

**Mode**: Standard (no TDD — pre-scaffold project)
**Date**: 2026-05-19
**Status**: ✅ All 30 tasks complete across 5 phases

---

## Completed Tasks

### Phase 1: Foundation — Scaffold & Dependencies
- [x] 1.1 Scaffolded Next.js 16.2.6 with TypeScript, ESLint, App Router, Turbopack, `src/` dir
- [x] 1.2 Installed dev deps: tailwindcss@3.4.17, postcss, autoprefixer, @tailwindcss/forms, @tailwindcss/typography, prettier, prettier-plugin-tailwindcss
- [x] 1.3 Installed prod deps: @insforge/sdk, stripe, @stripe/stripe-js, @stripe/react-stripe-js, zod, lucide-react, clsx, tailwind-merge
- [x] 1.4 Created `.env.local` with template vars

### Phase 2: Config Files & Directory Structure
- [x] 2.1 Created `tailwind.config.ts` with content paths and v3.4 plugins
- [x] 2.2 Created `postcss.config.mjs`
- [x] 2.3 Created `.prettierrc` with semi, singleQuote, trailingComma, tabWidth 2
- [x] 2.4 Created `src/lib/env.ts` with Zod env validation
- [x] 2.5 Created `src/lib/utils.ts` with `cn()` (clsx + tailwind-merge) and `formatPrice()`
- [x] 2.6 Created `src/lib/insforge.ts` with `createClient()`
- [x] 2.7 Created `src/lib/stripe.ts` (server) and `src/lib/stripe-client.ts` (client)
- [x] 2.8 Created `src/styles/globals.css` with Tailwind directives
- [x] 2.9 Created route group directories (adjusted shop/admin to regular directories for correct URL routing — see deviations)
- [x] 2.10 Created component and hooks placeholder dirs
- [x] 2.11 Created type stubs: product.ts, category.ts, order.ts

### Phase 3: Layouts & Error Boundaries
- [x] 3.1 Root layout with Inter font, globals.css import, proper metadata
- [x] 3.2 404 not-found page with link home
- [x] 3.3 Loading spinner
- [x] 3.4 Error boundary with retry button (client component)
- [x] 3.5 Landing layout with header nav + footer
- [x] 3.6 Shop layout with header + cart indicator
- [x] 3.7 Admin layout with sidebar navigation

### Phase 4: Placeholder Pages & Middleware
- [x] 4.1 Landing: `/`, `/about`, `/services`, `/contact` — all styled with Tailwind
- [x] 4.2 Shop: `/shop`, `/shop/products/[slug]`, `/shop/cart`, `/shop/checkout`, `/shop/checkout/success`, `/shop/auth/login`, `/shop/auth/register`, `/shop/auth/callback`
- [x] 4.3 Admin: `/admin` (dashboard), `/admin/products`, `/admin/products/new`, `/admin/products/[id]`, `/admin/categories`, `/admin/categories/new`, `/admin/categories/[id]`, `/admin/orders`
- [x] 4.4 Stripe webhook route with signature verification skeleton
- [x] 4.5 Proxy (middleware) with admin route protection skeleton, renamed to `proxy.ts` for Next.js 16

### Phase 5: Verification
- [x] 5.1 `npx next build` — all 21 routes compile, 0 errors
- [x] 5.2 Prettier — all files formatted
- [x] 5.3 ESLint — 0 warnings, 0 errors

---

## Deviations from Design

1. **Shop and Admin directories**: Task 2.9 specified creating route groups `(shop)/` and `(admin)/`. However, route groups remove parentheses from the URL, meaning both `(landing)/page.tsx` and `(shop)/page.tsx` would resolve to `/` — a build conflict. Changed `(shop)` to `shop/` and `(admin)` to `admin/` so the URLs match task 4's specifications (`/shop`, `/admin`, etc.). Landing remains as `(landing)/` route group since it serves the root `/` URL and needs a separate layout from the root layout.

2. **Middleware → Proxy**: Next.js 16 renamed the `middleware.ts` convention to `proxy.ts`. File renamed and function renamed from `middleware` to `proxy`.

3. **Stripe API version**: Exploration.md specified `2024-12-18.acacia` but the installed Stripe SDK v22 requires `2026-04-22.dahlia`. Updated to match the installed SDK version.

4. **Root layout font**: Changed from Geist (create-next-app default) to Inter as specified in task 3.1.

---

## Issues Found & Resolved

1. **create-next-app directory conflict**: Had to scaffold in temp directory and copy files because the project directory already contained `.atl/`, `openspec/`, and `README.md`.

2. **Broken .bin symlinks**: Copying node_modules broke npm binary symlinks. Fixed with `rm -rf node_modules/.bin && npm install`.

3. **Next.js 16 middleware rename**: Build warned about deprecated middleware convention. Fixed by renaming to `proxy.ts`.

4. **Zod v4 compatibility**: Installed zod@latest resolves to v4 which has a different API. The `safeParse` pattern used in `env.ts` is compatible with both v3 and v4.

---

## Files Changed/Created

| File | Action |
|------|--------|
| `.env.local` | Created |
| `.gitignore` | Created (by create-next-app) |
| `.prettierrc` | Created |
| `eslint.config.mjs` | Created (by create-next-app) |
| `next.config.ts` | Created (by create-next-app) |
| `package.json` | Modified (name fix, tailwind pin) |
| `postcss.config.mjs` | Created |
| `tailwind.config.ts` | Created |
| `tsconfig.json` | Created (by create-next-app) |
| `src/app/layout.tsx` | Created (root layout with Inter) |
| `src/app/not-found.tsx` | Created |
| `src/app/loading.tsx` | Created |
| `src/app/error.tsx` | Created |
| `src/app/(landing)/layout.tsx` | Created |
| `src/app/(landing)/page.tsx` | Created |
| `src/app/(landing)/about/page.tsx` | Created |
| `src/app/(landing)/services/page.tsx` | Created |
| `src/app/(landing)/contact/page.tsx` | Created |
| `src/app/shop/layout.tsx` | Created |
| `src/app/shop/page.tsx` | Created |
| `src/app/shop/products/[slug]/page.tsx` | Created |
| `src/app/shop/cart/page.tsx` | Created |
| `src/app/shop/checkout/page.tsx` | Created |
| `src/app/shop/checkout/success/page.tsx` | Created |
| `src/app/shop/auth/login/page.tsx` | Created |
| `src/app/shop/auth/register/page.tsx` | Created |
| `src/app/shop/auth/callback/page.tsx` | Created |
| `src/app/admin/layout.tsx` | Created |
| `src/app/admin/page.tsx` | Created |
| `src/app/admin/products/page.tsx` | Created |
| `src/app/admin/products/new/page.tsx` | Created |
| `src/app/admin/products/[id]/page.tsx` | Created |
| `src/app/admin/categories/page.tsx` | Created |
| `src/app/admin/categories/new/page.tsx` | Created |
| `src/app/admin/categories/[id]/page.tsx` | Created |
| `src/app/admin/orders/page.tsx` | Created |
| `src/app/api/stripe/webhook/route.ts` | Created |
| `src/lib/env.ts` | Created |
| `src/lib/insforge.ts` | Created |
| `src/lib/stripe.ts` | Created |
| `src/lib/stripe-client.ts` | Created |
| `src/lib/utils.ts` | Created |
| `src/proxy.ts` | Created |
| `src/styles/globals.css` | Created |
| `src/types/product.ts` | Created |
| `src/types/category.ts` | Created |
| `src/types/order.ts` | Created |
