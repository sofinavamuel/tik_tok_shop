# Apply Progress: Admin Dashboard

## Phase 1: Reusable Components & Server Actions

- [x] 1.1 Fetch InsForge SDK docs — confirmed `.ilike()`, `.range()`, `.select('*', { count: 'exact' })`, `.insert([...])` patterns
- [x] 1.2 Create `src/lib/actions/admin.ts` — 6 Server Actions with Zod validation (create/update/delete for products and categories), auto-slug generation, category delete safety check
- [x] 1.3 Create `src/components/admin/DataTable.tsx` — generic table with sortable columns, loading skeleton rows, empty state; search handled by separate SearchBar component
- [x] 1.4 Create `src/components/admin/FormField.tsx` — wrapper for text, number, textarea, select, and file inputs with label, error display, required asterisk
- [x] 1.5 Create `src/components/admin/ConfirmDialog.tsx` — modal overlay with AlertTriangle icon, cancel/confirm buttons, loading state
- [x] Created `src/components/admin/SearchBar.tsx` — client component with URL param-based search, debounced enter-to-search pattern
- [x] Created `src/components/admin/Pagination.tsx` — client component with prev/next navigation via URL params
- [x] Created `src/components/admin/DeleteButton.tsx` — unified delete button with ConfirmDialog and error display for both products and categories

## Phase 2: Layout & Dashboard Home

- [x] 2.1 Rewrote `src/app/admin/layout.tsx` — client component with `usePathname()` active-link highlighting, `useState` mobile collapse toggle with overlay, responsive breakpoint
- [x] 2.2 Rewrote `src/app/admin/page.tsx` — async Server Component fetching product/category/order counts via `insforge.database.from(...).select('*', { count: 'exact', head: true })`, 4 stats cards with colored icons, Recent Activity and Quick Actions sections

## Phase 3: Products CRUD

- [x] 3.1 Rewrote `src/app/admin/products/page.tsx` — async Server Component with getProducts(search, page, limit), DataTable with columns (Image, Name, Price, Category, Stock, Actions), SearchBar, Pagination, "New Product" button
- [x] 3.2 Rewrote `src/app/admin/products/new/page.tsx` — Client Component form with FormFields (name, price, description, category select, material, origin, image URL, in_stock checkbox), calls createProduct Server Action, redirects on success
- [x] 3.3 Rewrote `src/app/admin/products/[id]/page.tsx` — Client Component resolving params via Promise, fetches product + categories, pre-populated form, calls updateProduct, loading skeleton, 404 state, delete button with ConfirmDialog
- [x] 3.4 Delete wired in both list (DeleteButton) and edit page (ConfirmDialog) — calls deleteProduct, revalidates, redirects to list

## Phase 4: Categories CRUD

- [x] 4.1 Rewrote `src/app/admin/categories/page.tsx` — async Server Component with getCategoriesWithProductCount(), DataTable with (Name, Slug, Products Count, Actions)
- [x] 4.2 Rewrote `src/app/admin/categories/new/page.tsx` — Client Component form with FormFields (name, description, image URL), calls createCategory
- [x] 4.3 Rewrote `src/app/admin/categories/[id]/page.tsx` — Client Component with params Promise, fetches category, pre-populated form, calls updateCategory, loading skeleton, 404 state, delete button
- [x] 4.4 Delete for categories includes safety check in deleteCategory Server Action — counts products with .eq('category_id', id) before deleting, returns error if count > 0, shown in DeleteButton error dialog

## Phase 5: Orders & Build Verification

- [x] 5.1 Rewrote `src/app/admin/orders/page.tsx` — async Server Component with DataTable, placeholder columns (Order ID, Customer, Items, Total, Status, Date), status color badges (pending=amber, completed=green, failed=red), empty state message
- [x] 5.2 Run `next build` — passed with 0 errors

## Files Changed/Created

| File | Action |
|------|--------|
| `src/components/admin/ConfirmDialog.tsx` | Created |
| `src/components/admin/FormField.tsx` | Created |
| `src/components/admin/DataTable.tsx` | Created |
| `src/components/admin/SearchBar.tsx` | Created |
| `src/components/admin/Pagination.tsx` | Created |
| `src/components/admin/DeleteButton.tsx` | Created |
| `src/lib/actions/admin.ts` | Created |
| `src/lib/admin.ts` | Created |
| `src/app/admin/layout.tsx` | Rewritten |
| `src/app/admin/page.tsx` | Rewritten |
| `src/app/admin/products/page.tsx` | Rewritten |
| `src/app/admin/products/new/page.tsx` | Rewritten |
| `src/app/admin/products/[id]/page.tsx` | Rewritten |
| `src/app/admin/categories/page.tsx` | Rewritten |
| `src/app/admin/categories/new/page.tsx` | Rewritten |
| `src/app/admin/categories/[id]/page.tsx` | Rewritten |
| `src/app/admin/orders/page.tsx` | Rewritten |
| `src/lib/actions/stripe.ts` | Unchanged |
| `src/proxy.ts` | Unchanged |

## Deviations

- DataTable does NOT include built-in search input — search is handled by a separate SearchBar component for better separation of concerns and URL-based search pattern
- Added `src/components/admin/SearchBar.tsx`, `src/components/admin/Pagination.tsx`, `src/components/admin/DeleteButton.tsx` as additional components needed by the pages
- Orders page shows empty state permanently (no live data source configured yet — orders will come from Stripe webhooks)
