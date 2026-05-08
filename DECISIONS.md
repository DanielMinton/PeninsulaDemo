# Decisions

Two-paths-and-picked-the-simpler log. One line per call. Entries are ordered by when they were made.

- Map animations: GSAP vs Framer Motion (already in deps). Picked **Framer Motion** — it's already costing bundle, the map is 10 markers, GSAP would add ~25kb gz for animation power we don't need.
- City route shape: `/[slug]` flat vs `/areas/[slug]` nested. Picked **`/areas/[slug]`** with permanent redirects from old paths — the namespace makes the sitemap and breadcrumbs cleaner and pairs with `/services/[slug]`.
- Schema attachment: per-page inline `JSON.stringify(SCHEMA)` vs single `@graph` per route from `lib/schema.ts`. Picked **`@graph` helper** (Step 2) — one source of truth for `sameAs`, ratings, and breadcrumbs.
- Form notify channel: webhook vs Twilio SMS + Resend email. Picked **Twilio + Resend** — text reaches Don fastest in the field, email is the durable record.
- Rate limit store: in-memory vs Upstash Redis. Picked **Upstash Redis** — survives serverless cold starts and works across Vercel regions.
