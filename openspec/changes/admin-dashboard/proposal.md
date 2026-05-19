# Proposal: Admin Dashboard

## Intent

Replace admin placeholder pages with live CRUD against InsForge. Give the merchant a professional dashboard to manage products, categories, and orders — directly from the app, no external tools.

## Scope

### In Scope
1. **Admin Layout** — Responsive sidebar with active-link highlighting, mobile collapse toggle
2. **Dashboard Home** (`/admin`) — Summary cards: total products, categories, orders, revenue (mocked)
3. **Products CRUD** — Table with search/pagination, create/edit form, delete with confirmation
4. **Categories CRUD** — Table with product count, create/edit form, delete blocked if products exist
5. **Orders List** (`/admin/orders`) — Read-only table with customer, items, total, status, date

### Out of Scope
- Auth/login page (deferred — middleware guard exists)
- User management
- Real Stripe webhook processing (Change 6)
- Analytics/charts
- Strapi data management

## Capabilities

### New Capabilities
- `admin-layout`: Responsive sidebar with navigation (Products, Categories, Orders, Dashboard), collapse, active-route highlighting
- `admin-products`: Products CRUD — server-side list with search/pagination, create/edit forms, delete with confirmation
- `admin-categories`: Categories CRUD — list with product count, create/edit forms, delete blocked when products exist
- `admin-orders`: Read-only orders table from InsForge or Stripe data
- `admin-dashboard`: Summary stats cards fetching live counts from InsForge

### Modified Capabilities
None — no existing specs to modify.

## Approach

- **Server Components** for list pages — fetch via InsForge SDK in `async` RSC
- **Client Components** (`"use client"`) for interactive forms, tables, dialogs
- **Server Actions** for mutations (create/update/delete) — call InsForge SDK, revalidate path, return `{data, error}`
- **Reusable components**: `DataTable` (search + sort + pagination), `FormField` (label + input + error), `ConfirmDialog`
- **Delete guard for categories**: check product count in `categories` table before allowing delete
- **Orders**: query `orders` table from InsForge (seeded by future webhook), show placeholder if empty
- **Sidebar**: `usePathname()` for active state, `useState` for mobile collapse toggle

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/admin/page.tsx` | **Modified** | Live summary stats from InsForge |
| `src/app/admin/layout.tsx` | **Modified** | Responsive sidebar, active link, mobile collapse |
| `src/app/admin/products/page.tsx` | **Modified** | DataTable + search + pagination |
| `src/app/admin/products/new/page.tsx` | **Modified** | Product create form (Client Component) |
| `src/app/admin/products/[id]/page.tsx` | **Modified** | Pre-filled edit form, update action |
| `src/app/admin/categories/page.tsx` | **Modified** | DataTable with product count |
| `src/app/admin/categories/new/page.tsx` | **Modified** | Category create form |
| `src/app/admin/categories/[id]/page.tsx` | **Modified** | Pre-filled edit form, update action |
| `src/app/admin/orders/page.tsx` | **Modified** | Orders table from InsForge |
| `src/components/admin/` | **New** | DataTable, FormField, ConfirmDialog, Sidebar |
| `src/lib/actions/admin.ts` | **New** | Server Actions for products/categories CRUD |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| InsForge SDK query patterns differ for admin operations | Low | Fetch docs before writing |
| Category delete allowed when products exist | Low | Query product count in delete action, reject with error |
| Form validation gaps cause bad data | Low | Zod schemas on all Server Actions |

## Rollback Plan

Revert all modified `src/app/admin/*` page files to their placeholder state. Delete `src/components/admin/` and `src/lib/actions/admin.ts`. Restore original `layout.tsx` and `page.tsx`.

## Dependencies

- `@insforge/sdk` — already installed ✅
- `zod` — already installed ✅
- InsForge tables `products`, `categories`, `orders` — populated ✅

## Success Criteria

- [ ] Sidebar navigation highlights active route, collapses on mobile
- [ ] Dashboard cards show real product/category/order counts from InsForge
- [ ] Products list renders all 12 products with search filtering
- [ ] Product create form validates required fields, inserts into InsForge
- [ ] Product edit form pre-fills, updates record
- [ ] Product delete shows confirmation, removes record
- [ ] Categories list shows product count per category
- [ ] Category delete fails with message if category has products
- [ ] Orders page renders table (empty state or from existing data)
- [ ] `next build` passes with 0 errors
