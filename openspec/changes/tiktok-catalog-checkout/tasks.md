# Tasks: TikTok Catalog & Checkout

## Phase 1: Foundation — Types & Helpers

- [x] 1.1 Create `src/types/index.ts` — Product, Category, CartItem interfaces matching InsForge table schema (id, slug, name, price, description, images, material, origin, featured, in_stock, category_id, created_at)
- [x] 1.2 Create `src/lib/products.ts` — fetchProducts() with category/featured/limit filters, fetchProductBySlug(slug) with `.eq('slug', slug).single()`, returning `{data, error}`
- [x] 1.3 Create `src/lib/categories.ts` — fetchCategories() via `insforge.from('categories').select('*').order('name')`, returning `{data, error}`

## Phase 2: Cart Context

- [x] 2.1 Create `src/lib/cart-context.tsx` — CartProvider with useReducer (addItem, removeItem, updateQuantity, clearCart), clamp qty 1–99, localStorage persist on change + hydrate on mount, totalPrice computed, export useCart() hook

## Phase 3: Shop UI — Feed, Detail, Cart

- [x] 3.1 Update `src/app/shop/layout.tsx` — Wrap in CartProvider, replace static badge "0" with dynamic count from useCart()
- [x] 3.2 Rewrite `src/app/shop/page.tsx` — Client component, fetch products + categories on mount, horizontal category tab filter, TikTok-style vertical card grid (image, name, price), loading skeleton state
- [x] 3.3 Rewrite `src/app/shop/products/[slug]/page.tsx` — Fetch product by slug, display images (carousel/grid), name, price, description, material, origin, stock badge, "Add to Cart" button wired to useCart(), related products section, loading state
- [x] 3.4 Rewrite `src/app/shop/cart/page.tsx` — Client component, render cart items from useCart() with image thumbnail, name, quantity controls (+/-), line total, remove button, order summary (subtotal, item count), "Proceed to Checkout" link, empty state

## Phase 4: Payment — Stripe Checkout

- [x] 4.1 Create `src/lib/actions/stripe.ts` — Server Action `createCheckoutSession(items)` creates `stripe.checkout.sessions.create()` with line_items (price_data, quantity), returns session URL or error; also exports `verifyCheckoutSession(sessionId)` that calls `stripe.checkout.sessions.retrieve()`
- [x] 4.2 Rewrite `src/app/shop/checkout/page.tsx` — Client component, read cart from useCart(), display order summary, "Pay with Stripe" button that calls createCheckoutSession and redirects to session.url
- [x] 4.3 Rewrite `src/app/shop/checkout/success/page.tsx` — Read session_id from URL searchParams, call stripe.checkout.sessions.retrieve() via verifyCheckoutSession to verify, clear cart via useCart().clearCart(), show confirmation, loading state while verifying

## Phase 5: Polish — Loading & Error States

- [x] 5.1 Add loading skeletons to product feed (card-shaped shimmer placeholders) and product detail page (full-page skeleton)
- [x] 5.2 Add error boundaries / fallback UI — product fetch failure shows retry button, empty cart shows "Continue Shopping" CTA, Stripe errors show inline message
- [x] 5.3 Run `next build` — fix TypeScript errors (excluded backend/ from tsconfig), lint issues, verify all routes render without crashes
