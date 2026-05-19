# Proposal: Strapi Dashboard

## Intent

The admin dashboard currently only manages InsForge data (products, categories, orders). Strapi CMS is running with 6 content types but has no admin UI in the Next.js app. This change connects the admin panel to Strapi, giving the merchant a unified dashboard to manage markets, creators, videos, and briefings — the editorial + AI content layer.

## Scope

### In Scope
1. **Markets Dashboard** (`/admin/markets`) — List, add, edit markets with GMV, growth rate, saturation, color-coded status
2. **Creators Dashboard** (`/admin/creators`) — List, search/filter by niche, add/edit creators with followers, engagement rate
3. **Videos Dashboard** (`/admin/videos`) — List videos with views, likes, AI analysis status; detail view with analysis results; "Analyze with AI" button
4. **Briefings Dashboard** (`/admin/briefings`) — List briefings by status; detail with script/shotlist; "Generate with AI" button; save to Strapi
5. **Admin Navigation Update** — Add Markets, Creators, Videos, Briefings to sidebar under "Analytics" section
6. **Data Sync** — Server Actions for CRUD on Strapi, loading states, error handling

### Out of Scope
- VideoProduction CRUD (deferred)
- Real video downloading/transcription
- Automated data import from ScrapeCreators
- Charts/graphs (basic tables for now)

## Capabilities

### New Capabilities
- `admin-markets`: Markets CRUD — list with GMV/growth/saturation, create/edit forms, color-coded active/inactive status
- `admin-creators`: Creators CRUD — list with search/filter by niche, detail view with linked videos, create/edit forms
- `admin-videos`: Videos read + AI trigger — list with views/likes/analysis status, detail showing hook/structure/CTA/sentiment, "Analyze with AI" action
- `admin-briefings`: Briefings read + AI generation — list by status (draft/approved/produced), detail with script/shotlist, "Generate with AI" action, save result to Strapi
- `admin-analytics-nav`: Sidebar navigation group "Analytics" containing Markets, Creators, Videos, Briefings links

### Modified Capabilities
- `admin-layout`: Sidebar gains "Analytics" section with 4 new navigation items; existing links unchanged

## Approach

- **Server Components** for list pages — fetch from Strapi REST API via existing `src/lib/strapi/client.ts`
- **Client Components** for forms, search/filter, interactive buttons
- **Reuse existing components**: `DataTable`, `FormField`, `ConfirmDialog` from `src/components/admin/`
- **Extend Strapi client** with update/delete operations (currently only has `getMarkets`, `getCreators`, `createVideo`, `createBriefing`)
- **Server Actions** for mutations — call Strapi REST API, `revalidatePath`, return `{data, error}`
- **AI integration**: "Analyze with AI" and "Generate with AI" buttons trigger existing AI pipeline via Server Actions, save results back to Strapi

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/admin/layout.tsx` | **Modified** | Add "Analytics" section with 4 new sidebar links |
| `src/app/admin/markets/page.tsx` | **New** | Markets list (Server Component) |
| `src/app/admin/markets/new/page.tsx` | **New** | Market create form |
| `src/app/admin/markets/[id]/page.tsx` | **New** | Market edit form |
| `src/app/admin/creators/page.tsx` | **New** | Creators list with search/filter |
| `src/app/admin/creators/new/page.tsx` | **New** | Creator create form |
| `src/app/admin/creators/[id]/page.tsx` | **New** | Creator edit form + linked videos |
| `src/app/admin/videos/page.tsx` | **New** | Videos list with AI status |
| `src/app/admin/videos/[id]/page.tsx` | **New** | Video detail + "Analyze with AI" |
| `src/app/admin/briefings/page.tsx` | **New** | Briefings list by status |
| `src/app/admin/briefings/[id]/page.tsx` | **New** | Briefing detail + "Generate with AI" |
| `src/lib/strapi/client.ts` | **Modified** | Add update/delete operations for all content types |
| `src/lib/strapi/types.ts` | **Modified** | Extend types with additional fields |
| `src/lib/actions/strapi.ts` | **New** | Server Actions for Strapi CRUD + AI triggers |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Strapi API token missing or expired | Low | Check `STRAPI_API_TOKEN` env var; document setup |
| Strapi REST API pagination differs from InsForge | Low | Use existing `fetchAPI` wrapper which already handles pagination |
| AI pipeline not yet implemented | Med | "Analyze/Generate" buttons show pending state; trigger via Server Action that calls existing AI route |
| Large Strapi responses slow page load | Low-Med | Implement pagination in DataTable component |

## Rollback Plan

Remove all new `src/app/admin/{markets,creators,videos,briefings}/` directories. Restore `src/app/admin/layout.tsx` to original sidebar (remove "Analytics" section). Delete `src/lib/actions/strapi.ts`. Revert `src/lib/strapi/client.ts` and `types.ts` to pre-change state.

## Dependencies

- Strapi CMS running at `localhost:1337` with 6 content types ✅
- `STRAPI_API_TOKEN` environment variable configured ✅
- Existing `DataTable`, `FormField`, `ConfirmDialog` components ✅
- Existing AI pipeline for video analysis and briefing generation (Change 3)

## Success Criteria

- [ ] Markets dashboard loads all markets from Strapi with GMV, growth, status
- [ ] Create/edit market forms save to Strapi successfully
- [ ] Creators dashboard loads with search/filter by niche
- [ ] Create/edit creator forms save to Strapi successfully
- [ ] Videos dashboard shows list with views, likes, AI analysis status
- [ ] Video detail page shows analysis results (hook, structure, CTA, sentiment)
- [ ] "Analyze with AI" button triggers AI pipeline
- [ ] Briefings dashboard lists by status (draft/approved/produced)
- [ ] Briefing detail shows full script and shotlist
- [ ] "Generate with AI" button triggers AI briefing generator and saves to Strapi
- [ ] Sidebar shows "Analytics" section with 4 new links
- [ ] `next build` passes with 0 errors
