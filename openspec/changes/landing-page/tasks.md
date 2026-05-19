# Tasks: Landing Page

## Phase 1: Shared Components & Layout

- [x] 1.1 Create `src/components/ui/container.tsx` — reusable max-w-7xl wrapper with responsive padding
- [x] 1.2 Create `src/components/ui/section.tsx` — reusable section shell (heading, subtitle, children)
- [x] 1.3 Rewrite `src/app/(landing)/layout.tsx` — extract Header into `src/components/landing/header.tsx` with sticky nav, mobile hamburger menu
- [x] 1.4 Create `src/components/landing/footer.tsx` — multi-column footer with link groups, social icons, newsletter CTA
- [x] 1.5 Add SEO metadata to all `(landing)/**/page.tsx` — unique title, description, open graph per route
- [x] 1.6 Verify responsive breakpoints across all Phase 1 components (mobile-first)

## Phase 2: Pages & Sections

- [x] 2.1 Rewrite `src/app/(landing)/page.tsx` — enhanced hero (headline, subtitle, 2 CTAs, background gradient/pattern)
- [x] 2.2 Add Services section to homepage — 4 cards in a grid (Branding & Design, Social Commerce, Content AI, Web Development)
- [x] 2.3 Add Methodology section to homepage — 7-phase timeline/steps (Research, Analysis, References, Briefing, Production, Documentation, Delivery)
- [x] 2.4 Add Stats section to homepage — stat counters (12+ Productos, 4 Categorías, 3 Mercados, 60h Metodología)
- [x] 2.5 Rewrite `src/app/(landing)/about/page.tsx` — agency story, values section with 4 value cards, approach section
- [x] 2.6 Create detail pages for each service under `src/app/(landing)/services/[slug]/page.tsx` — dynamic route with service content
- [x] 2.7 Rewrite `src/app/(landing)/contact/page.tsx` — contact form UI (Name, Email, Phone, Service select, Message textarea), success state, contact info, social links
- [x] 2.8 Integrate Footer into `(landing)/layout.tsx` — replace inline footer with `<Footer />`
