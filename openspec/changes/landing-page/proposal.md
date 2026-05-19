# Proposal: Landing Page — Espacio EME Agency

## Intent

Landing routes exist as TikTok Shop placeholders but the agency is "Espacio EME". Replace with professional agency pages showcasing services, methodology, and brand. Homogeneous identity across all landing routes.

## Scope

### In Scope
- **Hero** — Bold headline, subtitle, dual CTA (Shop Now / Learn More), gradient bg
- **Services Section** — Cards: Branding & Design, Social Commerce, Content Production, Web Development
- **Methodology Section** — 7-phase timeline: Research → Analysis → References → Briefing → Production → Documentation → Presentation
- **Stats Section** — Counter stats: 12+ Products, 4 Categories, 3 Markets, 60h Methodology
- **About Page** (/about) — Agency story, values
- **Services Page** (/services) — Detailed service descriptions
- **Contact Page** (/contact) — Form UI (no backend), email, social links
- **Footer** — Links, copyright, social icons
- **SEO** — Metadata exports per page

### Out of Scope
Form backend, blog, i18n, animations beyond Tailwind, CMS.

## Capabilities

### New Capabilities
- `landing-layout`: Shared header/footer — Espacio EME branding, nav, social links
- `landing-home`: Homepage — hero, services cards, methodology timeline, stats
- `landing-about`: About page — agency story, values
- `landing-services`: Services page — detailed 4-service breakdown
- `landing-contact`: Contact page — form UI, contact info, social links

### Modified Capabilities
None.

## Approach

1. Rebrand `(landing)/layout.tsx` header/footer from "TikTok Shop" to "Espacio EME"
2. Build section components under `components/landing/` (Hero, ServicesSection, MethodologySection, StatsSection)
3. Replace `/about`, `/services`, `/contact` with agency copy
4. Add `generateMetadata()` for SEO per page
5. Wire "Shop Now" → `/shop`, "Learn More" → `/about`

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/(landing)/layout.tsx` | Modified | Rebrand header/footer |
| `src/app/(landing)/page.tsx` | Replaced | Homepage with hero, services, methodology, stats |
| `src/app/(landing)/about/page.tsx` | Replaced | Agency story |
| `src/app/(landing)/services/page.tsx` | Replaced | Service details |
| `src/app/(landing)/contact/page.tsx` | Replaced | Contact form UI |
| `src/components/landing/` | New | Section components |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Content mismatch | Low | Copy reviewed in scope |

## Rollback Plan

```bash
git checkout HEAD -- src/app/\(landing\)/ && rm -rf src/components/landing/
```

## Dependencies

Tailwind CSS v3.4, lucide-react — both already installed.

## Success Criteria

- [ ] Professional Espacio EME content on all pages
- [ ] SEO metadata on all 5 pages (home + 4 interior)
- [ ] Responsive at 375px, 768px, 1280px
- [ ] `npm run build` passes
- [ ] No TikTok Shop placeholders remain on landing routes
