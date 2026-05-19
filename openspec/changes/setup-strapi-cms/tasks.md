# Tasks: Setup Strapi CMS Backend

## Phase 1: Strapi Project Scaffold

- [x] 1.1 Verify Node.js >= 18 with `node --version` and free port 1337 (`lsof -i :1337` then `kill` if needed)
- [x] 1.2 Run `npx create-strapi@latest backend --quickstart` — scaffolds Strapi v5 with SQLite at `backend/`
- [x] 1.3 Start dev server and create admin user via `npm run strapi admin:create-user -- --email=admin@espacioeme.com --password=Admin12345! --firstname=Admin --lastname=EME`
- [x] 1.4 Verify admin panel loads at `http://localhost:1337/admin` and login succeeds

## Phase 2: Content Type Modeling (via JSON schema + API structure)

- [x] 2.1 Create **Market** collection type: name (text), slug (UID from name), currency (text), language (text), tiktok_shop_active (boolean), gmv_total (decimal), growth_rate (decimal), saturation_score (decimal)
- [x] 2.2 Create **Creator** collection type: username (text, unique), display_name (text), avatar (media — single), followers (integer), engagement_rate (decimal), avg_views (integer), niche (text), notes (richtext)
- [x] 2.3 Create **Video** collection type: tiktok_url (text), creator (relation — many-to-one with Creator), views (integer), likes (integer), shares (integer), comments (integer), gmv_attributed (decimal), duration_seconds (integer), hook_text (text), transcript (richtext), analysis_json (JSON)
- [x] 2.4 Create minimal **Product** collection type (relation target for Briefing): name (text), slug (UID from name), description (richtext), price (decimal), images (JSON), in_stock (boolean). Placeholder — enriched when InsForge sync is built
- [x] 2.5 Create **Briefing** collection type: title (text), product (relation — many-to-one with Product), target_audience (text), hook_options (JSON), script (richtext), shotlist (JSON), status (enumeration: draft, approved, produced), ai_generated (boolean)
- [x] 2.6 Create **VideoProduction** collection type: briefing (relation — one-to-one with Briefing, required), final_video (media — single), tools_used (JSON), production_time_minutes (integer), cost_eur (decimal), status (enumeration: in_progress, completed, failed)
- [x] 2.7 Create the API structure (routes, controllers, services, index.js → .ts) for each content type

## Phase 3: Permissions Configuration

- [x] 3.1 Configure **Public** role: enable find + findOne for Market, Creator, Video, and Product (via bootstrap function in `src/index.ts`)
- [x] 3.2 Configure **Authenticated** role: enable full CRUD for Briefing and VideoProduction (via bootstrap function)
- [x] 3.3 Seed initial data: 3 Markets (UK, US, Mexico) created via API; seed.js script created for future use

## Phase 4: Schema Export & API Verification

- [x] 4.1 Copy Content-Type JSON schemas from `backend/src/api/*/content-types/*/schema.json` to `openspec/changes/setup-strapi-cms/strapi-schemas/` (all 6 types)
- [x] 4.2 Verify all 6 API endpoints respond: `GET /api/{markets|creators|videos|products|briefings|video-productions}` return 200 with paginated Strapi response
- [x] 4.3 Create `start.sh` startup script at `backend/start.sh`
- [x] 4.4 Create `seed.js` for initial market data seeding
