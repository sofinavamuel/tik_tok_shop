# Proposal: Scaffold Next.js Project for TikTok Shop

## Intent

The project is an empty repo with a pre-configured InsForge backend and SDD initialized. No frontend code or infrastructure exists. This change bootstraps the full Next.js project so feature work can begin: project structure, dependency tree, config files, route groups for 3 modules, and integration stubs for InsForge, Stripe, and auth.

## Scope

### In Scope
- Scaffold Next.js 15 + TypeScript + App Router via `create-next-app --no-tailwind`
- Install all production and dev dependencies (see exploration §3)
- Pin Tailwind 3.4 manually — NOT v4
- Create route group structure: `(landing)/`, `(shop)/`, `(admin)/`
- Create `src/lib/` config files: insforge.ts, stripe.ts, stripe-client.ts, env.ts, utils.ts
- Create `src/middleware.ts` (route protection skeleton — admin + auth redirects)
- Create `.env.local` with all variable templates
- Create `.prettierrc` with `prettier-plugin-tailwindcss`
- Create `src/styles/globals.css` with Tailwind directives
- Create root layout, error/loading/not-found boundaries
- All stub route pages return placeholders (no feature implementation)

### Out of Scope
- Feature implementation (product pages, cart logic, checkout flow, admin CRUD)
- Auth hook (`useAuth.ts`), cart hook (`useCart.ts`) — deferred to feature changes
- Stripe webhook handler logic — only route file stub created
- ScrapeCreators API integration (Opción 3a) — deferred
- Strapi CMS setup — deferred
- TikTok Shop Open API integration — deferred
- Testing framework setup — deferred (no test runner detected)

## Capabilities

### New Capabilities
None — this is infrastructure scaffolding. No spec-level behaviors introduced. All capabilities (landing pages, shop catalog, admin dashboard, auth, payments) will be spec'd and implemented in subsequent changes.

### Modified Capabilities
None — no existing specs to modify.

## Approach

Hybrid: `create-next-app` with explicit `--no-tailwind` flag, then manually install Tailwind v3.4:

```bash
npx create-next-app@latest . \
  --typescript --no-tailwind --eslint --app \
  --src-dir --import-alias "@/*" --turbopack --use-npm

npm install -D tailwindcss@3.4.17 postcss autoprefixer
```

Then install remaining deps, create directory structure, write all config and stub files. Route groups isolate 3 modules with independent layouts. Middleware skeleton protects `/admin/*`. Root `layout.tsx` wraps all groups with `<html>`/`<body>`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| root/ | New | `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `.prettierrc`, `.env.local`, `.gitignore`, `postcss.config.mjs` |
| src/app/ | New | Route groups: `(landing)/`, `(shop)/`, `(admin)/`, `api/stripe/webhook/`, root layout, not-found, loading, error |
| src/lib/ | New | `insforge.ts`, `stripe.ts`, `stripe-client.ts`, `env.ts`, `utils.ts` |
| src/middleware.ts | New | Route protection skeleton |
| src/styles/ | New | `globals.css` with Tailwind directives |
| src/components/ | New | Empty `ui/`, `landing/`, `shop/`, `admin/` placeholder dirs |
| src/types/ | New | `product.ts`, `category.ts`, `order.ts` type stubs |
| src/hooks/ | New | Empty placeholder dirs |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Tailwind v4 installed by accident | Medium | `--no-tailwind` flag + manual pin to `3.4.17` in package.json |
| InsForge SDK server-side auth incompatibility | Medium | Investigate during apply; have fallback with manual token passthrough |
| Next.js middleware rename in v16 | Low-Med | Check installed version; use `middleware.ts` or `proxy.ts` accordingly |
| Stripe webhook raw body parsing in App Router | Low | Use `req.text()` before signature verification |

## Rollback Plan

```bash
# Option A: git reset (recommended)
git reset --hard HEAD && git clean -fd

# Option B: manual cleanup
rm -rf node_modules .next package.json package-lock.json \
  next.config.ts tsconfig.json tailwind.config.ts \
  postcss.config.mjs .prettierrc .env.local src/
```

## Dependencies

- Node.js >= 18 (LTS recommended)
- npm (comes with Node.js)
- InsForge backend URL + anon key (already provisioned)
- Stripe test keys (already provided — `sk_test_...`, `pk_test_...`)

## Success Criteria

- [ ] `npx next build` completes without errors
- [ ] `npx next dev` serves `/`, `/shop`, `/admin` without 404s
- [ ] Tailwind CSS renders correctly (verify with a test class)
- [ ] InsForge client instantiates without runtime error
- [ ] All env vars validated by Zod schema at startup
- [ ] Prettier formats `.tsx` files (verify with `npx prettier --check`)
- [ ] ESLint passes on existing files (verify with `npx next lint`)
