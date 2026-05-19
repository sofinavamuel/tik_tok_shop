# Tasks: Admin Dashboard

## Phase 1: Reusable Components & Server Actions

- [x] 1.1 Fetch InsForge SDK docs (`fetch-sdk-docs db typescript`) — confirm query patterns before writing
- [x] 1.2 Create `src/lib/actions/admin.ts` — Zod schemas + Server Actions: `createProduct`, `updateProduct`, `deleteProduct`, `createCategory`, `updateCategory`, `deleteCategory`
- [x] 1.3 Create `src/components/admin/DataTable.tsx` — generic table with search input, column sort, range-based pagination
- [x] 1.4 Create `src/components/admin/FormField.tsx` — label + input + error display wrapper
- [x] 1.5 Create `src/components/admin/ConfirmDialog.tsx` — modal overlay with cancel/confirm buttons

## Phase 2: Layout & Dashboard Home

- [x] 2.1 Rewrite `src/app/admin/layout.tsx` — add `usePathname()` active-link highlighting, mobile sidebar collapse toggle
- [x] 2.2 Rewrite `src/app/admin/page.tsx` — Server Component fetching live counts from InsForge (`products`, `categories`, `orders`)

## Phase 3: Products CRUD

- [x] 3.1 Rewrite `src/app/admin/products/page.tsx` — Server Component with DataTable, search via `.ilike()`, pagination via `.range()`
- [x] 3.2 Rewrite `src/app/admin/products/new/page.tsx` — Client Component form with FormFields, calls `createProduct` action
- [x] 3.3 Rewrite `src/app/admin/products/[id]/page.tsx` — fetch product via `.eq('id', id).single()`, pre-filled edit form, calls `updateProduct`
- [x] 3.4 Wire delete button in products DataTable — ConfirmDialog → `deleteProduct` action → `revalidatePath('/admin/products')`

## Phase 4: Categories CRUD

- [x] 4.1 Rewrite `src/app/admin/categories/page.tsx` — Server Component with DataTable, product count via separate count query
- [x] 4.2 Rewrite `src/app/admin/categories/new/page.tsx` — Client Component form with FormFields, calls `createCategory` action
- [x] 4.3 Rewrite `src/app/admin/categories/[id]/page.tsx` — fetch category, pre-filled edit form, calls `updateCategory`
- [x] 4.4 Wire delete in categories DataTable — safety check: reject if product count > 0, show error

## Phase 5: Orders & Build Verification

- [x] 5.1 Rewrite `src/app/admin/orders/page.tsx` — Server Component with DataTable, fetch orders from InsForge, empty-state handling
- [x] 5.2 Run `next build` — fix TypeScript/lint errors, verify 0 build errors
