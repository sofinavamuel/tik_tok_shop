# Tasks: auth-stripe-sync

## Phase 1: Auth Foundation

- [x] **1.1** Create `src/lib/auth.ts` — Auth helper functions
  - `signIn(email, password)` — calls `insforge.auth.signInWithPassword`, returns `{ data, error }`
  - `signUp(email, password, name)` — calls `insforge.auth.signUp`, returns `{ data, error }`
  - `signOut()` — calls `insforge.auth.signOut`, clears session
  - `getCurrentUser()` — calls `insforge.auth.getCurrentUser`, returns user or null
  - `signInWithGoogle()` — calls `insforge.auth.signInWithOAuth('google')`, redirects to OAuth
  - `signInWithGitHub()` — calls `insforge.auth.signInWithOAuth('github')`, redirects to OAuth
  - Follow InsForge SDK `{data, error}` pattern
  - Fetch auth-sdk docs first: `insforge_fetch-sdk-docs` with `auth` + `typescript`

- [x] **1.2** Create `src/components/auth/AuthProvider.tsx` — Client-side auth context provider
  - React context wrapping `useAuth` state
  - Fetches `getCurrentUser()` on mount
  - Exposes `{ user, loading, signIn, signUp, signOut }` via context
  - `'use client'` directive required

- [x] **1.3** Create `src/hooks/useAuth.ts` — React hook for auth context
  - `useAuth()` hook returning context value
  - Throws if used outside `AuthProvider`

- [x] **1.4** Wrap root layout with `AuthProvider`
  - Modify `src/app/layout.tsx` to wrap `{children}` with `<AuthProvider>`
  - Must be client component boundary — `AuthProvider` is `'use client'`

## Phase 2: Auth Pages

- [x] **2.1** Update `src/app/shop/auth/login/page.tsx` — Real login form
  - `'use client'` directive
  - Email + password form with `useState` for inputs
  - Calls `signIn()` from `src/lib/auth.ts` on submit
  - Loading state on button during sign-in
  - Error display for failed login
  - Google + GitHub OAuth buttons calling `signInWithGoogle()` / `signInWithGitHub()`
  - On success: `router.push('/shop')`
  - Link to `/shop/auth/register`

- [x] **2.2** Update `src/app/shop/auth/register/page.tsx` — Real registration form
  - `'use client'` directive
  - Name + email + password form with `useState` for inputs
  - Calls `signUp()` from `src/lib/auth.ts` on submit
  - Loading state, error display
  - On success: `router.push('/shop')`
  - Link to `/shop/auth/login`

- [x] **2.3** Update `src/app/shop/auth/callback/page.tsx` — OAuth callback handler
  - `'use client'` directive
  - On mount: call `insforge.auth.handleOAuthCallback()` or equivalent SDK method
  - Loading spinner while processing
  - On success: `router.push('/shop')`
  - On error: display error message with link back to login

## Phase 3: Route Protection & Admin Header

- [x] **3.1** Update `src/proxy.ts` — Real session cookie check
  - Import auth helper or use `insforge.auth` to validate session
  - For `/admin/*` paths: check for valid InsForge session cookie
  - If no valid session: `NextResponse.redirect` to `/shop/auth/login`
  - For `/shop/auth/login` and `/shop/auth/register`: if session exists, redirect to `/shop`
  - Remove all TODO comments
  - Fetch SDK docs to confirm correct cookie name / session validation method

- [x] **3.2** Update `src/app/admin/layout.tsx` — Show authenticated user in header
  - Import `useAuth` hook
  - Add user email/name display in sidebar footer (replaces "Back to Shop" or alongside it)
  - Add sign-out button calling `signOut()` with redirect to `/shop`
  - Handle loading state gracefully

## Phase 4: Stripe Product Sync

- [x] **4.1** Create `src/lib/actions/sync-products.ts` — Server Action for Stripe sync
  - `'use server'` directive
  - Fetches all products from InsForge (`insforge.database.from('products').select('*')`)
  - For each product:
    - Check if already synced via Stripe `metadata.insforge_id` (prevent duplicates)
    - If not synced: `stripe.products.create({ name, description, metadata: { insforge_id: product.id } })`
    - Then `stripe.prices.create({ product: stripeProductId, unit_amount: price * 100, currency: 'eur' })`
    - Update InsForge product with `stripe_product_id` and `stripe_price_id` in metadata or a new column
  - Returns `{ success: boolean, synced: number, errors: string[] }`
  - Handle Stripe not configured error
  - Handle per-product errors gracefully (continue on failure, collect errors)

- [x] **4.2** Add `stripe_price_id` field to Product type
  - Update `src/types/index.ts` — add optional `stripe_price_id?: string` to `Product` interface
  - If InsForge products table doesn't have this column, create a migration or use metadata

- [x] **4.3** Update `src/lib/actions/stripe.ts` — Use `price_id` instead of inline `price_data`
  - Modify `createCheckoutSession` to accept items with `price_id`
  - If `price_id` exists on product: use `{ price: item.product.stripe_price_id, quantity }` in line_items
  - Fallback: keep inline `price_data` when `price_id` is absent (risk mitigation from proposal)
  - Update type signature accordingly

## Phase 5: TikTok Shop Skeleton & Admin UI

- [x] **5.1** Create `src/lib/tiktok-shop/sync.ts` — Field mapping function
  - Function `mapProductToTikTokFormat(product: Product): TikTokProduct`
  - Maps InsForge product fields to TikTok Shop API format
  - Uses existing `TikTokProduct` type from `src/lib/tiktok-shop/types.ts`
  - No HTTP calls — pure mapping function only
  - Add `syncProductsToTikTokShop(products: Product[]): { mapped: TikTokProduct[], skipped: string[] }` skeleton

- [x] **5.2** Update `src/app/admin/products/page.tsx` — Add sync buttons
  - Add "Sync to Stripe" button that calls `syncProductsToStripe` server action
  - Add "Sync to TikTok Shop" button that calls mapping function (logs result, no API call)
  - Show loading state during sync
  - Show success/error toast or inline message with count of synced products

- [x] **5.3** Update `src/app/admin/products/products-table-client.tsx` — Show Stripe sync status
  - Add optional column showing `stripe_price_id` status (synced / not synced)
  - Or add badge indicator on products that have been synced to Stripe
