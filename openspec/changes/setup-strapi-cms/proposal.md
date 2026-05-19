# Proposal: Setup Strapi CMS Backend

## Intent

Strapi CMS manages non-transactional content: TikTok markets, creators, analyzed videos, auto-generated briefings, and video production tracking. InsForge handles auth/products/orders (transactional); Strapi handles editorial + AI-generated content. Bootstraps Strapi v5 with SQLite and models 5 content types.

## Scope

### In Scope
- Create Strapi v5 project with SQLite at `backend/`
- Model 5 content types: Market, Creator, Video, Briefing, VideoProduction
- Configure API permissions (public read for Markets/Creators, authenticated for Video/Briefing/VideoProduction)
- Create admin user for local development
- Export content type JSON schemas to `strapi-schemas/` for reproducibility

### Out of Scope
- Real data import from ScrapeCreators/Kalodata (Change 3)
- AI analysis pipeline (Change 3)
- Next.js ↔ Strapi integration (deferred to feature changes)
- Strapi deployment to production (deferred)
- Custom Strapi plugins, lifecycle hooks, or middleware
- Stripe or TikTok API integration within Strapi

## Capabilities

### New Capabilities
None — infrastructure setup. Content types consumed in subsequent feature changes where specs will be written.

### Modified Capabilities
None — no existing specs to modify.

## Approach

```bash
cd tik_tok_shop
npx create-strapi@latest backend --quickstart
```

Quickstart uses SQLite — ideal for dev. Model content types via Strapi Content-Type Builder UI. Configure permissions via Settings → Roles → Public/Authenticated. Export each content type's JSON schema to `openspec/changes/setup-strapi-cms/strapi-schemas/` for reproducibility.

Content types follow the field specs per user requirements (see Context in orchestrator prompt for full field listing).

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `backend/` | New | Strapi v5 project root with SQLite DB |
| `openspec/.../strapi-schemas/` | New | Exported content type JSON schemas |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Strapi v5 breaking changes in `create-strapi` | Low | Pin version; verify admin panel after install |
| Port 1337 already in use | Low | `lsof -i :1337` before start; kill or change port |
| SQLite unsuitable for concurrent prod access | Low-Med | Dev only; document PostgreSQL migration path |

## Rollback Plan

```bash
rm -rf backend/
```

If SQLite DB was modified, delete `.tmp/data.db` inside `backend/`.

## Dependencies

- Node.js >= 18
- npm / npx

## Success Criteria

- [ ] Strapi admin loads at `http://localhost:1337/admin`
- [ ] All 5 content types visible in Content Manager
- [ ] API endpoints respond: `GET /api/markets`, `/api/creators`, `/api/videos`, `/api/briefings`, `/api/video-productions`
- [ ] Public role can read Markets/Creators; authenticated required for Video/Briefing/VideoProduction
- [ ] Content type JSON schemas saved to `strapi-schemas/`
