# Decisions

Two-paths-and-picked-the-simpler log. One line per call. Entries are ordered by when they were made.

- Map animations: GSAP vs Framer Motion (already in deps). Picked **Framer Motion** — it's already costing bundle, the map is 10 markers, GSAP would add ~25kb gz for animation power we don't need.
- City route shape: `/[slug]` flat vs `/areas/[slug]` nested. Picked **`/areas/[slug]`** with permanent redirects from old paths — the namespace makes the sitemap and breadcrumbs cleaner and pairs with `/services/[slug]`.
- Schema attachment: per-page inline `JSON.stringify(SCHEMA)` vs single `@graph` per route from `lib/schema.ts`. Picked **`@graph` helper** (Step 2) — one source of truth for `sameAs`, ratings, and breadcrumbs.
- Form notify channel: webhook vs Twilio SMS + Resend email. Picked **Twilio + Resend** — text reaches Don fastest in the field, email is the durable record.
- Rate limit store: in-memory vs Upstash Redis. Picked **Upstash Redis** — survives serverless cold starts and works across Vercel regions.
- CSP `script-src`: nonce + `'strict-dynamic'` (proposal) vs `'unsafe-inline'`. Picked **`'unsafe-inline'`** for `script-src` and `style-src` — Pages Router + `getStaticProps` cannot thread per-request nonces into page-level inline JSON-LD without moving every page off SSG or pre-computing hashes at build. All other directives (`frame-ancestors`, `connect-src`, `form-action`, `base-uri`, etc.) stay strict; HSTS, X-Frame-Options DENY, and the Referrer/Permissions policies are untouched. Tracked as a follow-up.
- Sitemap/robots: `next-sitemap` postbuild static files vs dynamic Pages Router routes. Picked **dynamic `pages/sitemap.xml.ts` + `pages/robots.txt.ts`** — they read straight from the typed content layer, so adding/removing a city or service updates the sitemap with no extra build step. Drops the `next-sitemap` dep.
- Inter font: Google Fonts CDN vs `next/font/google`. Picked **`next/font/google`** — self-hosts the woff2, removes `fonts.googleapis.com` from the request map, and keeps the CSP from needing extra origins.
