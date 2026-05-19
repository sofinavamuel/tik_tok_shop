# Exploration: Next.js Scaffold for TikTok Shop

## Current State

The project at `/Users/sofianavamuelespejo/tik_tok_shop` is **empty** — only a `README.md` and `.git` exist. SDD is already initialized:
- `openspec/config.yaml` with detected stack (Next.js, Tailwind 3.4, InsForge, Stripe)
- `.atl/skill-registry.md` with compact rules
- No `package.json`, no dependencies, no code

The InsForge backend is pre-configured with:
- PostgreSQL tables: `categories`, `products`
- Storage bucket: `product-images`
- Auth providers: Google, GitHub, email/password
- OpenRouter AI key provisioning

## Affected Areas

- `/` (root) — `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `.env.local`, `.gitignore`, `middleware.ts`
- `app/` — Root layout, route groups for 3 modules, error/loading boundaries
- `lib/` — InsForge client, Stripe server/client config, auth helpers
- `components/` — Shared UI components
- `types/` — Shared TypeScript types
- `app/api/` — Stripe webhook route handler

---

## 1. Scaffold Approach: `create-next-app` vs Manual Setup

### Current `create-next-app` defaults (as of 2026)

Running `npx create-next-app@latest --yes` enables:
- TypeScript ✅
- Tailwind CSS (v4 by default — **problem for us**)
- ESLint ✅
- App Router ✅
- Turbopack ✅
- Import alias `@/*` ✅
- `src/` directory ❌ (off by default — optional)
- React Compiler ❌ (off by default)

### Comparison

| Approach | Pros | Cons |
|----------|------|------|
| **`create-next-app` with `--yes`** | Fastest setup, official defaults, auto-configures TS/ESLint/PostCSS | Installs **Tailwind v4** by default (we need v3.4), generates boilerplate files we'll edit anyway |
| **`create-next-app` with explicit flags** | Same speed, can skip Tailwind to install v3.4 manually | Need to know all flags, still generates files to edit |
| **Full manual setup** | Complete control, no extraneous files, can pin Tailwind v3.4 from the start | Slower, error-prone, no `create-next-app` optimizations |
| **InsForge `download-template`** | Pre-configured with InsForge backend URL/anon key | Only React and generic Next.js templates available (no optimized 3-module structure) |

### Recommended Approach

**Hybrid: `create-next-app` with explicit `--no-tailwind` flag, then manually add Tailwind v3.4.**

Rationale:
1. We get the official Next.js boilerplate (TS, ESLint, App Router, Turbopack) — these are well-tested defaults
2. We skip the default Tailwind v4 that `create-next-app` ships, avoiding a painful downgrade
3. We manually install Tailwind v3.4 + PostCSS + Autoprefixer, locking the version
4. We can then restructure `app/` for our 3-module architecture

**Exact command:**

```bash
npx create-next-app@latest . \
  --typescript \
  --no-tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --turbopack \
  --use-npm
```

Then install Tailwind v3.4:

```bash
npm install -D tailwindcss@3.4 postcss autoprefixer
npx tailwindcss init -p
```

---

## 2. Directory Structure: Organizing 3 Modules in App Router

### Approach Comparison

| Approach | Pros | Cons |
|----------|------|------|
| **Route Groups `(landing)`, `(shop)`, `(admin)`** | Clean URL separation (/landing, /shop, /admin), isolated layouts per group, no URL prefix needed for main page | Requires careful middleware to protect admin routes |
| **Single `app/` with page-specific subdirs** | Simpler initially | Becomes messy fast with 3 distinct layouts and auth boundaries |
| **Monorepo (turborepo/nx)** | Cleanest separation, independent deployments | Massive overkill for this scope, adds build complexity |

### Recommended: Route Groups

```
src/
├── app/
│   ├── (landing)/                 # Route group: public corporate site
│   │   ├── layout.tsx             # Landing page layout (header, footer)
│   │   ├── page.tsx               # / — main landing page
│   │   ├── about/page.tsx         # /about
│   │   ├── services/page.tsx      # /services
│   │   └── contact/page.tsx       # /contact
│   │
│   ├── (shop)/                    # Route group: TikTok-style catalog
│   │   ├── layout.tsx             # Shop layout (product header, cart)
│   │   ├── page.tsx               # /shop — product feed (TikTok-style)
│   │   ├── products/
│   │   │   └── [slug]/page.tsx    # /shop/products/[slug]
│   │   ├── cart/page.tsx          # /shop/cart
│   │   ├── checkout/
│   │   │   ├── page.tsx           # /shop/checkout
│   │   │   └── success/page.tsx   # /shop/checkout/success
│   │   └── auth/
│   │       ├── login/page.tsx     # /shop/auth/login
│   │       ├── register/page.tsx  # /shop/auth/register
│   │       └── callback/page.tsx  # OAuth callback handler
│   │
│   ├── (admin)/                   # Route group: admin dashboard
│   │   ├── layout.tsx             # Admin layout (sidebar, auth guard)
│   │   ├── page.tsx               # /admin — dashboard home
│   │   ├── products/
│   │   │   ├── page.tsx           # /admin/products — CRUD list
│   │   │   ├── new/page.tsx       # /admin/products/new
│   │   │   └── [id]/page.tsx      # /admin/products/[id] — edit
│   │   ├── categories/
│   │   │   ├── page.tsx           # /admin/categories
│   │   │   ├── new/page.tsx       # /admin/categories/new
│   │   │   └── [id]/page.tsx      # /admin/categories/[id] — edit
│   │   └── orders/
│   │       └── page.tsx           # /admin/orders
│   │
│   ├── api/
│   │   └── stripe/
│   │       └── webhook/route.ts   # Stripe webhook handler
│   │
│   ├── layout.tsx                 # Root layout (<html>, <body>, fonts)
│   ├── not-found.tsx              # 404 page
│   ├── loading.tsx                # Global loading state
│   └── error.tsx                  # Global error boundary
│
├── components/
│   ├── ui/                        # Shared UI primitives (Button, Card, etc.)
│   ├── landing/                   # Landing page specific components
│   ├── shop/                      # Catalog specific components
│   │   ├── ProductCard.tsx
│   │   ├── ProductFeed.tsx
│   │   └── TikTokPlayer.tsx       # Video-style product display
│   └── admin/                     # Dashboard specific components
│       ├── Sidebar.tsx
│       ├── DataTable.tsx
│       └── ProductForm.tsx
│
├── lib/
│   ├── insforge.ts                # createClient() instance
│   ├── stripe.ts                  # Stripe server instance
│   ├── stripe-client.ts           # Stripe client-side loader
│   └── utils.ts                   # Shared utilities (cn(), formatPrice(), etc.)
│
├── hooks/
│   ├── useAuth.ts                 # Auth state hook (wraps InsForge)
│   └── useCart.ts                 # Cart state hook
│
├── types/
│   ├── product.ts
│   ├── category.ts
│   └── order.ts
│
├── middleware.ts                  # Auth redirects, route protection
│
└── styles/
    └── globals.css                # Tailwind directives
```

**Key decisions:**
- Route groups `()` keep URLs clean: `/` (landing), `/shop`, `/admin`
- Each group has its own `layout.tsx` — separate headers/sidebars/auth
- `middleware.ts` at `src/` level protects `/admin/*` and `/shop/auth/*` redirects
- API routes stay outside groups at `app/api/`

---

## 3. Complete Dependency List

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | ^15 (latest stable) | Framework |
| `react` | ^19 | UI library |
| `react-dom` | ^19 | DOM rendering |
| `@insforge/sdk` | latest | InsForge backend client |
| `stripe` | latest | Stripe server-side SDK |
| `@stripe/stripe-js` | latest | Stripe client-side loader |
| `@stripe/react-stripe-js` | latest | Stripe React components (Elements, PaymentElement) |
| `lucide-react` | latest | Icons |
| `clsx` | latest | Conditional classnames |
| `tailwind-merge` | latest | Merge Tailwind classes (for `cn()` utility) |
| `zod` | latest | Schema validation (forms, env vars) |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | ^5 | Type checking |
| `@types/react` | ^19 | React types |
| `@types/react-dom` | ^19 | React DOM types |
| `tailwindcss` | **3.4** (LOCKED) | Utility CSS framework |
| `postcss` | ^8 | CSS processing |
| `autoprefixer` | ^10 | CSS vendor prefixes |
| `eslint` | ^9 | Linting |
| `eslint-config-next` | ^15 | Next.js ESLint config |
| `prettier` | ^3 | Code formatting |
| `prettier-plugin-tailwindcss` | latest | Sort Tailwind classes |
| `@tailwindcss/forms` | latest | Form reset/base styles |
| `@tailwindcss/typography` | latest | Prose styles for landing pages |

**Important:** Pin Tailwind in `package.json`:
```json
"tailwindcss": "3.4.17"
```

---

## 4. InsForge SDK Setup

### Client Configuration

Create `src/lib/insforge.ts`:

```typescript
import { createClient } from '@insforge/sdk';

export const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_BASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
});
```

**Key points:**
- `NEXT_PUBLIC_` prefix is correct here — the anon key is designed to be public (RLS-protected)
- The SDK returns `{ data, error }` for all operations
- Database inserts require array format: `[{...}]`
- Always call `insforge_fetch-docs` / `insforge_fetch-sdk-docs` before writing integration code
- For server-side operations (Admin CRUD), create a **server-only** client with elevated privileges if needed

### Database SDK Usage Pattern

```typescript
// Select with filters
const { data, error } = await insforge.database
  .from('products')
  .select('*')
  .eq('category_id', categoryId)
  .order('created_at', { ascending: false });

// Insert (array format!)
const { data, error } = await insforge.database
  .from('products')
  .insert([{ name, price, category_id }])
  .select();

// Update
const { data, error } = await insforge.database
  .from('products')
  .update({ price: newPrice })
  .eq('id', productId)
  .select();
```

---

## 5. Stripe Setup: API Routes vs Server Actions

### Comparison

| Aspect | API Route (`app/api/stripe/webhook/route.ts`) | Server Action (`'use server'`) |
|--------|-----------------------------------------------|-------------------------------|
| **Webhooks** | ✅ REQUIRED — Stripe sends POST events to a URL | ❌ Can't receive external webhooks |
| **Create Checkout Session** | ✅ Works, but needs manual fetch call | ✅ Server Action — direct function call from component |
| **Type Safety** | Manual (parse request) | Automatic (function calls) |
| **Caching** | GET routes cacheable | Not cacheable |
| **External callers** | Any HTTP client | React components only |
| **Stripe signature verification** | ✅ Need raw body | ❌ Can't verify webhook signatures |

### Recommended: Hybrid Approach

**Server Actions for checkout creation** (internal mutations):
```typescript
// src/lib/actions/stripe.ts
'use server';

import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';

export async function createCheckoutSession(productId: string) {
  const origin = (await headers()).get('origin');
  
  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: productId, quantity: 1 }],
    mode: 'payment',
    success_url: `${origin}/shop/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/shop/cart`,
  });

  return { url: session.url };
}
```

**Route Handler for webhook** (external events):
```typescript
// src/app/api/stripe/webhook/route.ts
import { stripe } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('stripe-signature')!;
  
  const event = stripe.webhooks.constructEvent(
    rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!
  );
  
  switch (event.type) {
    case 'checkout.session.completed':
      // Handle fulfillment
      break;
  }
  
  return NextResponse.json({ received: true });
}
```

### Stripe Config Files

```typescript
// src/lib/stripe.ts — Server-only
import Stripe from 'stripe';
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia', // latest stable
  typescript: true,
});

// src/lib/stripe-client.ts — Client-safe
import { loadStripe } from '@stripe/stripe-js';
let stripePromise: ReturnType<typeof loadStripe>;
export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
}
```

---

## 6. Complete Environment Variables

```bash
# .env.local

# === InsForge ===
NEXT_PUBLIC_INSFORGE_BASE_URL=https://your-app.region.insforge.app
NEXT_PUBLIC_INSFORGE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# === Stripe ===
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# === App ===
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Security Notes:**
- `NEXT_PUBLIC_*` vars are **safe to expose** — they go to the browser. Only anon keys and publishable keys belong here.
- `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` must **NEVER** be prefixed with `NEXT_PUBLIC_` — they stay server-only.
- InsForge base URL is public (it's where the SDK points).

Add validation with Zod:
```typescript
// src/lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_INSFORGE_BASE_URL: z.string().url(),
  NEXT_PUBLIC_INSFORGE_ANON_KEY: z.string(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});
```

---

## 7. Auth Strategy with InsForge in Next.js

### The InsForge Auth Model

InsForge uses:
- **JWT access tokens** returned from `signInWithPassword()` / `signUp()` / OAuth callbacks
- **httpOnly refresh cookie** for session persistence (set automatically by the SDK in browser)
- `getCurrentUser()` reads the session via the refresh cookie
- OAuth uses redirect with `insforge_code` exchange (automatic in SDK)

### Architecture

```
┌─────────────────────────────────────────────────┐
│                   Browser                         │
│  ┌─────────────────────────────────────────┐     │
│  │  Client Component                       │     │
│  │  useAuth() → insforge.auth.* methods    │     │
│  │  SDK manages cookies automatically      │     │
│  └──────────────┬──────────────────────────┘     │
│                 │                                 │
└─────────────────┼─────────────────────────────────┘
                  │
┌─────────────────┼─────────────────────────────────┐
│  Next.js Server  │                                 │
│                  ▼                                 │
│  ┌──────────────────────────┐                      │
│  │  Middleware (middleware.ts)│                     │
│  │  - Check session cookie   │                     │
│  │  - Redirect unauthenticated│                    │
│  │  - Protect /admin/*       │                     │
│  └──────────┬───────────────┘                      │
│             │                                      │
│  ┌──────────▼───────────────┐                      │
│  │  Server Components       │                      │
│  │  (layout.tsx, page.tsx)  │                      │
│  │  - Call insforge.auth.   │                      │
│  │    getCurrentUser()      │                      │
│  │  - Fetch per-user data   │                      │
│  └──────────────────────────┘                      │
└────────────────────────────────────────────────────┘
```

### Implementation Plan

**1. Auth Context (Client-side)** — `src/hooks/useAuth.ts`
- Wraps `insforge.auth.getCurrentUser()` in a React context
- Provides `user`, `loading`, `signIn`, `signUp`, `signOut`, `signInWithGoogle`, etc.
- Runs once on mount, syncs with InsForge session

**2. Middleware** — `src/middleware.ts`
- Check for session cookie on `/admin/*` and `/shop/auth/*` routes
- Redirect unauthenticated users to `/shop/auth/login`
- Must not run on static assets (`_next/static`, `_next/image`, `favicon.ico`)
- Note: Next.js 16 renamed `middleware.ts` to `proxy.ts` and `middleware` function to `proxy`. Need to verify the installed version.

**3. Server Component Auth**
- Admin layout calls `insforge.auth.getCurrentUser()` server-side
- If no user, redirect or show access denied
- Admin pages fetch data with user context

**4. Auth Pages** (in `(shop)/auth/`)
- `login/page.tsx` — email/password form calling `insforge.auth.signInWithPassword()`
- `register/page.tsx` — registration form calling `insforge.auth.signUp()`
- Google/GitHub OAuth buttons calling `insforge.auth.signInWithOAuth({ provider: 'google' })`

### ⚠️ Important Consideration

The InsForge SDK is primarily designed for **client-side** browser usage (cookies, OAuth redirects). For Next.js **Server Components** and **Server Actions**, we need to verify:

- Does `getCurrentUser()` work in a server context (can it read the httpOnly cookie)?
- Do we need to manually pass the access token for server-side database queries?
- This needs investigation during implementation — may need to wrap the SDK or use a server-side auth helper

---

## 8. Project Conventions

### ESLint
- Use `eslint-config-next` (comes with `create-next-app`)
- Add `eslint-plugin-tailwindcss` for class ordering
- Config in `eslint.config.mjs` (Next.js 15+ flat config)

### Prettier
```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### .gitignore
Create-next-app generates this, ensure these are included:
```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

### TypeScript — `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Commit Convention
Follow conventional commits as specified in skill registry:
```
feat(shop): add product card component
fix(auth): handle expired session redirect
chore(deps): pin tailwindcss to 3.4
```

---

## Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **Tailwind v4 vs v3.4 conflict** | Medium | High | Use `--no-tailwind` flag, install v3.4 manually, lock version in package.json |
| **InsForge SDK server-side auth** | Medium | High | Need to verify `getCurrentUser()` works in Server Components during implementation; may need fallback pattern |
| **create-next-app defaults change** | Low | Medium | Pin Next.js version if CLI behavior shifts |
| **Next.js middleware rename** (`middleware.ts` → `proxy.ts` in v16) | Low-Medium | Medium | Check installed version, use appropriate naming |
| **Stripe webhook raw body** | Low | Medium | Next.js App Router may parse body differently — need to use `req.text()` before JSON parse |
| **Stripe API version drift** | Low | Low | Pin `apiVersion` in Stripe constructor |
| **Module scope creep** | Medium | Low | Routes groups isolate each module — hard to accidentally couple them |

---

## Approaches Summary

| Decision | Option A | Option B | Recommended |
|----------|----------|----------|-------------|
| **Scaffold** | `create-next-app` with Tailwind | Full manual | `create-next-app --no-tailwind` + manual Tailwind v3.4 |
| **Directory** | Route groups for 3 modules | Single flat app/ | Route groups `(landing)`, `(shop)`, `(admin)` |
| **Stripe checkout** | API Routes | Server Actions | Server Actions for checkout, API Route for webhook |
| **Auth strategy** | Client-only SDK | Hybrid (middleware + server) | Hybrid — middleware for redirects, SDK for auth logic |
| **Linting** | ESLint only | ESLint + Prettier | ESLint + Prettier + prettier-plugin-tailwindcss |

---

## Recommendation

**Proceed with `setup-nextjs-scaffold` as the next SDD phase.** The scaffold should:

1. Run `create-next-app` with `--no-tailwind` and explicit flags
2. Install Tailwind v3.4 + all dependencies listed above
3. Set up the directory structure with route groups
4. Create all config files (`.env.local`, `.prettierrc`, insforge client, stripe clients)
5. Set up middleware with route protection skeleton
6. Create the auth hook and basic login/register pages
7. Verify `next build` passes before proceeding to feature work

The project is ready for the **Propose** phase — all approaches have been analyzed, risks identified, and a clear path forward exists.

## Ready for Proposal
**Yes.** The exploration is complete and all 8 investigation points have been analyzed with clear recommendations.
