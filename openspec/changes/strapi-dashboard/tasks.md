# Tasks: Strapi Dashboard

## Phase 1: Foundation — Strapi Client, Types & Server Actions

- [ ] 1.1 Extend `src/lib/strapi/types.ts` with missing fields: `saturation`, `color`, `active` on StrapiMarket; `avatar_url`, `tiktok_handle` on StrapiCreator; `creator_id`, `product_ids`, `transcript`, `analysis_json` structure on StrapiVideo; `script`, `shotlist`, `creator_id`, `video_id` on StrapiBriefing
- [ ] 1.2 Extend `src/lib/strapi/client.ts` with `updateMarket`, `deleteMarket`, `updateCreator`, `deleteCreator`, `getVideos`, `getVideo`, `updateVideo`, `getBriefings`, `getBriefing`, `updateBriefing`, `deleteBriefing` using existing `fetchAPI`/`fetchAPISingle` patterns
- [ ] 1.3 Create `src/lib/actions/strapi.ts` with Server Actions: `createMarket`, `updateMarket`, `deleteMarket` — Zod validation, call Strapi client, `revalidatePath`, return `{success, error}`
- [ ] 1.4 Add Server Actions to `src/lib/actions/strapi.ts`: `createCreator`, `updateCreator`, `deleteCreator` — same pattern, include niche filter support
- [ ] 1.5 Add Server Actions to `src/lib/actions/strapi.ts`: `analyzeVideo` — trigger AI pipeline, save analysis_json back to Strapi, `revalidatePath`
- [ ] 1.6 Add Server Actions to `src/lib/actions/strapi.ts`: `generateBriefing` — trigger AI briefing generation, save script/shotlist to Strapi, `revalidatePath`

## Phase 2: Markets Dashboard

- [ ] 2.1 Create `src/app/admin/markets/page.tsx` (Server Component) — fetch markets via `getMarkets()`, render DataTable with columns: name, currency, GMV, growth rate, saturation, status badge, actions (edit/delete)
- [ ] 2.2 Create `src/app/admin/markets/new/page.tsx` (Client Component) — form with FormField for name, slug, currency, language, GMV, growth rate, saturation, color, active toggle; submit via `createMarket` Server Action
- [ ] 2.3 Create `src/app/admin/markets/[id]/page.tsx` (Client Component) — edit form pre-filled with market data, submit via `updateMarket`; include DeleteButton with ConfirmDialog

## Phase 3: Creators Dashboard

- [ ] 3.1 Create `src/app/admin/creators/page.tsx` (Server Component) — fetch creators via `getCreators()`, integrate SearchBar for niche filtering, render DataTable with columns: username, display name, niche, followers, engagement rate, actions
- [ ] 3.2 Create `src/app/admin/creators/new/page.tsx` (Client Component) — form with FormField for username, display name, niche, followers, engagement rate, avatar URL, TikTok handle; submit via `createCreator`
- [ ] 3.3 Create `src/app/admin/creators/[id]/page.tsx` (Client Component) — edit form pre-filled, submit via `updateCreator`; include DeleteButton; show linked videos count if available

## Phase 4: Videos Dashboard

- [ ] 4.1 Create `src/app/admin/videos/page.tsx` (Server Component) — fetch videos via `getVideos()`, render DataTable with columns: URL, views, likes, AI analysis status badge (pending/analyzed/error), link to detail
- [ ] 4.2 Create `src/app/admin/videos/[id]/page.tsx` (Server Component + Client actions) — fetch single video via `getVideo()`, display video metadata; if analysis_json exists, render analysis results (hook, structure, CTA, sentiment); include "Analyze with AI" button calling `analyzeVideo` Server Action with loading state

## Phase 5: Briefings Dashboard

- [ ] 5.1 Create `src/app/admin/briefings/page.tsx` (Server Component) — fetch briefings via `getBriefings()`, render DataTable with columns: title, target audience, status badge (draft/approved/produced), link to detail
- [ ] 5.2 Create `src/app/admin/briefings/[id]/page.tsx` (Server Component + Client actions) — fetch single briefing via `getBriefing()`, display full script and shotlist; include "Generate with AI" button calling `generateBriefing` Server Action with loading state

## Phase 6: Navigation & Verification

- [ ] 6.1 Modify `src/app/admin/layout.tsx` — add new imports (BarChart3, Users, Video, FileText from lucide-react); restructure sidebar to include "Analytics" section group with Markets, Creators, Videos, Briefings links; preserve existing links unchanged
- [ ] 6.2 Run `next build` — verify 0 errors, all new routes compile, no TypeScript issues
