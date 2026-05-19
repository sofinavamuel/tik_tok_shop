# Strapi Content-Type Schemas

Exported JSON schemas for the 6 Strapi v5 content types defined for the TikTok Shop CMS.

## Content Types

| File | Collection Name | Purpose |
|------|----------------|---------|
| `market.schema.json` | `markets` | TikTok Shop market regions (UK, US, Mexico) |
| `creator.schema.json` | `creators` | TikTok creators tracked in the system |
| `video.schema.json` | `videos` | Analyzed TikTok videos with performance metrics |
| `product.schema.json` | `products` | Products (placeholder — enriched when InsForge sync is built) |
| `briefing.schema.json` | `briefings` | AI-generated or manual briefings for video production |
| `video-production.schema.json` | `video-productions` | Track video production from briefing to final delivery |

## Relations

- **Creator → Video**: one-to-many (a creator has many videos)
- **Video → Creator**: many-to-one (a video belongs to one creator)
- **Product → Briefing**: one-to-many (a product has many briefings)
- **Briefing → Product**: many-to-one (a briefing belongs to one product)
- **Briefing → VideoProduction**: one-to-one (inverse side, mapped by briefing)
- **VideoProduction → Briefing**: one-to-one (owning side, required)

## Usage

These schemas define the data structure for Strapi's Content-Type Builder.
To recreate, place each file at `backend/src/api/<name>/content-types/<name>/schema.json`
and start Strapi — it auto-migrates on startup.

## Generated

Generated from Strapi v5.10.4 on 2026-05-19.
