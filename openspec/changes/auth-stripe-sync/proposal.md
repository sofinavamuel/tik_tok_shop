# Proposal: Auth, Stripe Sync & TikTok Shop Alignment

## Intent

Replace placeholder auth pages with real InsForge SDK authentication (email/password + OAuth), protect admin routes with session checks, sync InsForge products to Stripe using proper price IDs (replacing inline price_data), and add skeleton TikTok Shop product sync alignment.

## Scope

### In Scope
- **Auth System** — `src/lib/auth.ts`, `AuthProvider`, `useAuth` hook, real login/register/callback pages
- **Admin Route Protection** — `src/proxy.ts` session cookie check, redirect unauthenticated, show user in header
- **Stripe Product Sync** — Server Action creates Stripe products + prices from InsForge data, stores `stripe_price_id` mapping
- **Checkout Update** — Use stored `price_id` instead of inline `price_data` in `createCheckoutSession`
- **TikTok Shop Skeleton** — `src/lib/tiktok-shop/sync.ts` field mapping function, admin UI button (no real API calls)

### Out of Scope
- Password reset flow
- Email verification
- User profile editing
- Role-based access (admin vs customer)
- Real TikTok Shop API calls (pending partner approval)

## Capabilities

### New Capabilities
- `user-auth`: InsForge SDK auth — signIn, signUp, signOut, getCurrentUser, session management via httpOnly cookies, OAuth callback handling
- `admin-guard`: Middleware-based route protection — reads InsForge session cookie, redirects unauthenticated `/admin/*` to `/shop/auth/login`, displays user info in admin header
- `stripe-product-sync`: Server Action syncs InsForge products to Stripe catalog, creates products + prices, stores `stripe_price_id` mapping for checkout use
- `tiktok-shop-sync`: Skeleton sync function mapping InsForge product fields to TikTok Shop API format, admin UI trigger button (API not yet approved)

### Modified Capabilities
- `stripe-checkout`: Replace inline `price_data` with stored Stripe `price_id` from sync mapping

## Approach

- **Auth**: InsForge SDK manages auth via httpOnly cookies. `AuthProvider` (client) wraps app in root layout, exposes `useAuth()` hook. Login/register pages call SDK methods directly. Callback page handles OAuth redirect resolution.
- **Admin Guard**: `proxy.ts` reads `insforge_session` cookie, validates via SDK, redirects to `/shop/auth/login` if missing. Admin layout header shows authenticated user email/name.
- **Stripe Sync**: Server Action iterates InsForge products, calls `stripe.products.create` + `stripe.prices.create`, stores `stripe_price_id` in InsForge product metadata. Admin products page gets "Sync to Stripe" button.
- **Checkout**: `createCheckoutSession` receives `price_id` from product mapping instead of building `price_data` inline.
- **TikTok Shop**: Pure mapping function + skeleton UI. No HTTP calls until partner API approval.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/lib/auth.ts` | **New** | Auth helper functions (signIn, signUp, signOut, getCurrentUser) |
| `src/hooks/useAuth.ts` | **New** | React hook wrapping auth context |
| `src/components/auth/AuthProvider.tsx` | **New** | Client-side auth context provider |
| `src/app/shop/auth/login/page.tsx` | **Modified** | Replace placeholder with real email/password + OAuth login |
| `src/app/shop/auth/register/page.tsx` | **Modified** | Replace placeholder with real registration form |
| `src/app/shop/auth/callback/page.tsx` | **Modified** | Real OAuth callback handler |
| `src/proxy.ts` | **Modified** | Real session cookie check, redirect logic |
| `src/app/admin/layout.tsx` | **Modified** | Show authenticated user info in header |
| `src/lib/actions/sync-products.ts` | **New** | Server Action: sync InsForge products to Stripe |
| `src/lib/actions/stripe.ts` | **Modified** | Use `price_id` instead of inline `price_data` |
| `src/lib/tiktok-shop/sync.ts` | **New** | Field mapping function for TikTok Shop format |
| `src/app/admin/products/page.tsx` | **Modified** | Add "Sync to Stripe" and "Sync to TikTok Shop" buttons |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| InsForge cookie name differs from expected | Medium | Fetch SDK docs, verify cookie name from metadata |
| Stripe sync creates duplicate products on re-run | Medium | Check existing Stripe product by `metadata.insforge_id` before creating |
| OAuth callback URL misconfigured | Low | Verify redirect URLs in InsForge dashboard match `/shop/auth/callback` |
| Checkout breaks if `price_id` missing on product | Low | Fallback to inline `price_data` when `price_id` is absent |

## Rollback Plan

Remove `src/lib/auth.ts`, `src/hooks/useAuth.ts`, `src/components/auth/AuthProvider.tsx`. Restore placeholder auth pages. Revert `src/proxy.ts` to TODO state. Remove `src/lib/actions/sync-products.ts` and `src/lib/tiktok-shop/sync.ts`. Revert `src/lib/actions/stripe.ts` to inline `price_data`. Remove sync buttons from admin products page.

## Dependencies

- `@insforge/sdk` — already installed
- `stripe` — already installed
- InsForge auth providers (Google, GitHub) configured in dashboard
- Stripe API keys in `.env.local`
- TikTok Shop API credentials (skeleton only — not required for this change)

## Success Criteria

- [ ] Login with email/password creates session, redirects to shop
- [ ] Google/GitHub OAuth flow completes via callback page
- [ ] Unauthenticated access to `/admin/*` redirects to `/shop/auth/login`
- [ ] Admin header shows authenticated user email
- [ ] "Sync to Stripe" creates Stripe products + prices from InsForge data
- [ ] Checkout session uses Stripe `price_id` (not inline `price_data`)
- [ ] "Sync to TikTok Shop" button triggers mapping function (no API call)
- [ ] `next build` passes with 0 errors
