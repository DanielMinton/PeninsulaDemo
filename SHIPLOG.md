# SHIPLOG — Peninsula Pick Ups recovery v2

Built across one session, six commits, no migrations beyond Pages Router. Build passes (24 static pages prerendered), `tsc --noEmit` clean, `next lint` clean. New `main` is at the recovery baseline.

## What changed

**Identity.** A typed content layer (`src/content/{site,services,areas,reviews,faqs,map-outline}.ts`) is now the single source of truth for every page, dropdown, footer, JSON-LD block, OG card, sitemap entry, and dynamic robots response. The full `sameAs` array — Yelp, Instagram, Facebook, Nextdoor, Alignable, JunkSpots, and Google Business Profile — is centralized in `SITE.sameAs` and emitted on every page. `<link rel="me">` for each profile in `_document.tsx`. No more drift between the homepage city list, the sitemap config, and `areaServed`.

**Schema.** `src/lib/schema.ts` emits one `@graph` block per route from pure functions: `organization`, `localBusiness` (with `AggregateRating` derived from typed reviews + 3 sample `Review` nodes), `service` (city-scoped on `/areas/[city]`, generic on `/services/[slug]`), `breadcrumbs`, and `faqPage`. The homepage now ships LocalBusiness + Organization + FAQPage; city pages ship LocalBusiness + Service + Breadcrumbs + optional FAQPage; service pages mirror that with the global `Service`; `/verify` ships Organization + LocalBusiness + Breadcrumbs.

**Routes.** `/[location]` flat paths replaced by `/areas/[city]` with permanent redirects from each old slug. New `/services/[slug]` for each of the seven services. New `/verify` — the anti-imposter identity page, linked from the footer header, the legal row, every social `rel="me"` anchor, and listed inside `SITE.sameAs` as a reciprocal anchor. Dynamic `pages/sitemap.xml.ts` and `pages/robots.txt.ts` replace the `next-sitemap` postbuild — preview environments now serve `Disallow: /`.

**Map.** `src/components/map/PeninsulaMap.tsx` — a stylized SVG of San Mateo County (plus the SF tip and lower Santa Clara) with a marker per service area. Markers tab in north-to-south geographic order, hover/focus reveals a card that flips to the marker's left when needed, ESC dismisses, San Carlos pulses, all of it routed through Framer Motion (already in the bundle) with `useReducedMotion` short-circuiting to a final-state render. Loaded via `next/dynamic({ ssr: true })` so the SVG ships in static HTML for SEO + zero CLS.

**Form.** `/api/lead` — a Node API route running every submission through Zod parse, honeypot check, Cloudflare Turnstile siteverify, Upstash sliding-window rate limit (5/hr + 20/day per IP), Twilio SMS, Resend email, and finally forwarding the sanitized payload to the Django CRM with a shared `X-Internal-Token` header. Each integration is config-checked: missing secrets fail closed in production and skip cleanly in dev. Phone numbers parse to E.164 via `libphonenumber-js`. TCPA-compliant consent disclosure with SMS opt-out language. Per-field errors get `aria-invalid` + `aria-describedby`; the summary region is `role="alert" aria-live="polite"`.

**Security headers.** `middleware.ts` ships a strict-but-pragmatic CSP (`frame-ancestors 'none'`, locked `connect-src`, `form-action 'self'`, only Cloudflare Turnstile allowed externally) plus `X-Robots-Tag: noindex` for any preview or non-canonical host. `next.config.js` carries the static set: HSTS preload, `X-Frame-Options: DENY`, `Permissions-Policy` with `interest-cohort=()`, `Referrer-Policy`, `X-Content-Type-Options`. Inter migrated to `next/font/google`, removing `fonts.googleapis.com` from the request map. The CSP `'unsafe-inline'` trade-off for inline JSON-LD is documented in `DECISIONS.md`.

**OG image.** `/api/og` now whitelists `?city=` and `?service=` against the typed content layer and 404s anything else, closing the open-rendering hole. Edge runtime, aggressive cache headers.

**Cleanup.** `lib/serviceAreas.ts`, `[location].tsx`, `next-sitemap.config.js`, `public/sitemap*.xml`, `public/robots.txt`, the dead `three`/`@react-three/*`/`@types/three` deps, and `next-sitemap`/`axios`/`clsx`/`react-hook-form` are gone. `business-cover.jpeg` and the misplaced `junkspots-featured.png` are removed from `public/images/gallery/`.

## What's now possible

- Adding a service area is a one-line edit to `src/content/areas.ts` — sitemap, dropdowns, the map marker, schema `areaServed`, the OG whitelist, and the per-city page all update from that single source.
- Adding a service is the same: edit `src/content/services.ts`, the dropdowns, the footer, ServicesGrid, and `/services/[slug]` all follow.
- The lead pipeline is fully production-ready as soon as Don provisions Upstash, Turnstile, Twilio, and Resend keys (documented in `.env.example`). Until then the form still works in dev and stores via Django.
- `/verify` is the canonical anchor every JSON-LD `sameAs` lists alongside the social profiles — Google can confirm reciprocal identity.
- Preview deployments are now indexing-safe: middleware emits `X-Robots-Tag: noindex` and the dynamic robots response returns `Disallow: /` outside production.

## Where I cut scope (intentionally)

- **Pure nonce-based CSP.** Pages Router + `getStaticProps` cannot thread per-request nonces into page-level JSON-LD without moving every page off SSG or pre-computing hashes at build. Shipped a strict CSP with `'unsafe-inline'` on `script-src`/`style-src` and locked everything else; tracked as a follow-up in `DECISIONS.md`.
- **Map data accuracy.** The Peninsula outline is illustrative, not survey-grade. Cities are projected from real lat/lng so they land where you'd expect, but the coastline is hand-drawn for character. Good enough for a recruiter-of-clicks; if Don wants USGS-precision, swap `LAND_PATH` for an imported GeoJSON.
- **Tests.** I did not add unit tests for `lead-schema.ts` or the schema generators. Both are pure and easy to test; the rebuild prioritized the recovery surface area over the test pyramid. Recommended next.

## What I'd build next, given another day

1. **Real job photos from Don.** The current gallery has 5 real photos, several at 2048×1536. A targeted shoot of trucks, hands-on loading, and finished cleanouts would let me retire the weakest stock-feeling tile and re-balance the priority/LCP image around something more documentary.
2. **Nextdoor "Recommended" badge artwork.** The TestimonialsSection now links to Nextdoor, but a real recommendation count or screenshot card would carry more weight than the current text badge.
3. **Tests for the lead pipeline.** Unit tests for `LeadSchema` (E.164 normalization, anti-HTML rejection, honeypot pass-through), and a small integration test that mocks Turnstile + Upstash + Twilio + Resend and runs the route end-to-end.
4. **Hash-based CSP.** Compute SHA-256 of every page's inline JSON-LD at build, emit a manifest, and inject the hashes into the CSP via `next.config.js`. Removes `'unsafe-inline'` while staying on `getStaticProps`.
5. **`/api/og` city overlay.** Rendering the SVG land outline + the marker for the requested city inside the OG card would make the share preview unmistakably ours and reinforce the recovery story.
