# Proposal: API Integrations & AI Pipeline

## Intent

Equip the admin with AI-powered video analysis and briefing generation using InsForge AI (no external keys). Lay groundwork for TikTok Shop API and ScrapeCreators integrations. Bridge InsForge (products) and Strapi (videos, briefings, creators) via a sync layer.

## Scope

### In Scope
1. **AI Pipeline** — `analyze-video.ts`, `generate-briefing.ts`, `pipeline.ts`, `prompts.ts` using `insforge.ai.chat.completions.create()` with tool_use for structured JSON
2. **ScrapeCreators Client** — HTTP client with types + mock data fallback (needs $29/mo key)
3. **TikTok Shop API Skeleton** — OAuth flow + HMAC signing, no real calls (needs Partner approval)
4. **Strapi Integration** — REST client + sync: push AI analysis to Video, briefings to Briefing
5. **Admin Analysis Dashboard** — `/admin/analysis` with video analysis form + briefing generator

### Out of Scope
- Real video downloading/transcription (Whisper needs separate key)
- TikTok Shop real API calls (pending Partner approval)
- ScrapeCreators real data feeds (pending subscription)
- Automated cron jobs or webhook processing

## Capabilities

### New Capabilities
- `ai-pipeline`: Video analysis → briefing generation via InsForge AI. Structured JSON output with tool_use. Centralized prompts.
- `strapi-integration`: REST client to Strapi CMS. Sync AI analysis (Video CT) and briefings (Briefing CT).
- `scrape-creators-client`: HTTP client with typed responses + mock fallback for development.
- `tiktok-shop-client`: Skeleton client with OAuth + HMAC signing — no real API calls yet.
- `admin-analysis`: Interactive AI tools UI at `/admin/analysis` — analyze videos, generate briefings, save to Strapi.

### Modified Capabilities
None — no existing specs to modify.

## Approach

- **AI Pipeline**: `pipeline.ts` orchestrates `analyzeVideo()` → `generateBriefing()`. Each calls `insforge.ai.chat.completions.create()` with `tools: [defineTool()]` for structured JSON extraction. `prompts.ts` centralizes prompt templates.
- **ScrapeCreators**: Typed HTTP client. `mockData` object returned when `SCRAPECREATORS_API_KEY` is absent. Ready for production when key is set.
- **TikTok Shop**: Client with OAuth token refresh + HMAC-SHA256 signing for `TikTok-Shop-Api-Sign` header. All methods throw `NotImplementedError` until approval.
- **Strapi**: REST calls to `localhost:1337/api/`. Uses Strapi token from env. Sync: push analysis → `POST /api/videos`, push briefing → `POST /api/briefings`.
- **Admin UI**: Client Component with tabs (Analyze / Briefing). Form inputs, result display, "Save to Strapi" button.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/lib/ai/` | **New** | Pipeline, analyzers, prompts |
| `src/lib/scrape-creators/` | **New** | Client + types + mock data |
| `src/lib/tiktok-shop/` | **New** | Skeleton OAuth client |
| `src/lib/strapi/` | **New** | REST client + sync helpers |
| `src/app/admin/analysis/` | **New** | Analysis dashboard page |
| `src/app/admin/layout.tsx` | **Modified** | Add "Analysis" nav link |
| `.env.example` | **Modified** | Add `STRAPI_URL`, `STRAPI_TOKEN`, `SCRAPECREATORS_API_KEY` |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| InsForge AI tool_use not available for Claude models | Low | Confirm model supports tools; fallback to JSON-in-prompt |
| Strapi schema changes invalidate sync | Low | Typed payloads matching current schemas |
| Mock data diverges from real API shapes | Med | Use real ScrapeCreators types; mock implements same interface |

## Rollback Plan

Delete `src/lib/ai/`, `src/lib/scrape-creators/`, `src/lib/tiktok-shop/`, `src/lib/strapi/`. Remove `src/app/admin/analysis/`. Revert `layout.tsx` nav links and `.env.example`.

## Dependencies

- `@insforge/sdk` — already installed ✅
- Strapi running on localhost:1337 (or configured STRAPI_URL)

## Success Criteria

- [ ] AI analysis returns structured JSON (hook, structure, CTA, sentiment, audience)
- [ ] AI briefing generation returns complete briefing (hook options, script, shotlist)
- [ ] Admin analysis page renders with working video analysis and briefing generation forms
- [ ] ScrapeCreators client compiles with mock data fallback
- [ ] TikTok Shop client skeleton compiles (all methods throw placeholder)
- [ ] Strapi client can push analysis to Video CT and briefings to Briefing CT
- [ ] `next build` passes with 0 errors
