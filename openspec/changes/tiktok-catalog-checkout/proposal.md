# Proposal: TikTok Catalog & Checkout

## Intent

Replace placeholder shop pages with live data from InsForge and a working checkout flow. Users should be able to browse products, filter by category, view details, manage a cart, and pay via Stripe — all with zero backend code beyond InsForge SDK queries.

## Scope

### In Scope
1. InsForge SDK queries — fetch products (with category join) and categories
2. Product feed page (`/shop`) — TikTok-style vertical scrolling card grid
3. Category filter — horizontal tab bar filtering products client-side
4. Product detail page (`/shop/products/[slug]`) — images, price, material, origin, add-to-cart
5. Shopping cart — React Context + localStorage, add/remove/update qty
6. Cart page (`/shop/cart`) — line items, totals, checkout button
7. Stripe Checkout — Server Action creates session, redirects to Stripe, success page verifies session
8. Cart indicator badge — shows item count in shop layout header

### Out of Scope
- Order management in admin (Change 4)
- User auth for checkout (guest checkout only)
- Strapi product sync
- TikTok Shop API integration (Change 5)
- Reviews/ratings

## Capabilities

### New Capabilities
- `product-catalog`: Product feed, category filter, and product detail page with InsForge data
- `shopping-cart`: React Context cart with localStorage persistence, add/remove/update qty
- `stripe-checkout`: Stripe Checkout Session creation via Server Action, success verification, cancel redirect

### Modified Capabilities
None — no existing specs to modify.

## Approach

- **Data layer**: `insforge` client in `src/lib/insforge.ts` queries `products` (with `category_id` → `categories` join) and `categories` tables via SDK. Client components use `useEffect` + state; product detail page uses async server component with `insforge.from('products').select('*').eq('slug', slug).single()`.
- **Cart**: `React.createContext` + `useReducer` inside `CartProvider` wrapping shop layout. `useEffect` syncs to localStorage on mount and on change. Expose `useCart()` hook.
- **Stripe**: Server Action in `src/app/shop/checkout/actions.ts` creates `stripe.checkout.sessions.create()` with line items from cart data. Returns session URL for redirect. Success page reads `session_id` from URL search params and calls `stripe.checkout.sessions.retrieve()` to verify payment status.
- **Category filter**: Fetch categories on mount, render as horizontal scrollable tabs. Selecting a tab filters product list client-side by `category_id`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/lib/insforge.ts` | Unchanged | Already created, used as-is |
| `src/lib/cart-context.tsx` | **New** | Cart provider, reducer, hook |
| `src/lib/types.ts` | **New** | Product, Category, CartItem types |
| `src/app/shop/page.tsx` | **Modified** | Replace skeletons with live product feed + category tabs |
| `src/app/shop/layout.tsx` | **Modified** | Wrap with CartProvider, wire badge count |
| `src/app/shop/products/[slug]/page.tsx` | **Modified** | Fetch product by slug, render full detail |
| `src/app/shop/cart/page.tsx` | **Modified** | Render real cart items from context |
| `src/app/shop/checkout/page.tsx` | **Modified** | Render cart summary + "Pay with Stripe" button calling Server Action |
| `src/app/shop/checkout/success/page.tsx` | **Modified** | Verify session, show confirmation |
| `src/app/shop/checkout/actions.ts` | **New** | Stripe Checkout Session Server Action |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| InsForge SDK query patterns differ from Supabase | Low | Fetch docs first per config rule |
| Stripe session creation fails (env errors) | Low | .env.local already has test keys; fail with descriptive error |
| Cart serialization edge cases (NaN qty, negative) | Low | Clamp qty to 1..99 in reducer |
| Products without images in feed layout | Low | Render placeholder bg if `images` array is empty |

## Rollback Plan

Revert all modified files under `src/app/shop/*` and delete `src/lib/cart-context.tsx`, `src/lib/types.ts`, and `src/app/shop/checkout/actions.ts`. Stripe sessions run in test mode only — no real charges.

## Dependencies

- `@insforge/sdk` — already installed ✅
- `stripe` (server) + `@stripe/stripe-js` (client) — already installed ✅
- `.env.local` with `NEXT_PUBLIC_INSFORGE_*`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — all set ✅

## Success Criteria

- [ ] `/shop` renders 12 products from InsForge with images, name, price
- [ ] Category filter tabs render and filter products on click
- [ ] `/shop/products/[slug]` shows full product detail with add-to-cart button
- [ ] Cart persists items across page refreshes
- [ ] Stripe Checkout redirects to Stripe, returns to success page with green checkmark
- [ ] Cart badge shows correct item count in layout header
- [ ] `next build` passes with 0 errors
