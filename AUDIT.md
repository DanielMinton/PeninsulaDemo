# Peninsula Pick Ups — Phase 1 Audit

Snapshot of the existing site as of `main @ aee01eb`. All paths are relative to `frontend/` unless noted. No code yet — this is the recovery target.

## Stack and shape

1. **Next.js 14.2.3, Pages Router** (`src/pages`), TS strict, Tailwind 3.4, Framer Motion 11, axios, next-seo, next-sitemap (postbuild), `react-hook-form` (installed, never imported). Node runtime everywhere except `pages/api/og.tsx` which already declares `runtime: 'edge'`. tsconfig path alias `@/*` → `src/*`.
2. **Dead 3D deps shipping in the bundle config**: `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three` are in `package.json` with zero imports anywhere in `src/`. Free wins on bundle and a chance to delete `~components/canvas/` references that the README still claims exist (they don't).
3. **Routes are flat at the root**: `/`, `/[location]`, `/dashboard`, `/privacy`, `/terms`, `/api/og`. No `/areas/[city]`, no `/services/[slug]`, no `/verify`. The README mentions a `/dashboard` client portal — it's a static stub (`pages/dashboard/index.tsx`) with no auth.
4. **Companion Django backend** under `backend/` exposes `POST /api/leads/`. The current frontend forms submit there directly from the browser via axios using `NEXT_PUBLIC_API_URL`. On a Vercel-only deployment of the marketing site, this path is broken unless Django is live at `api.thepeninsulapickup.com` with CORS — and even then, every submission is fully client-trusted with no server-side guardrails.

## Content sources (the single-source-of-truth opportunity)

5. **Cities are typed and centralized** in `src/lib/serviceAreas.ts` (10 cities, `ServiceAreaData` interface). Good. But the same list is **duplicated three more places**: hardcoded `areaServed` array in the homepage `LocalBusiness` JSON-LD (`pages/index.tsx:38-49`), a hardcoded `locations` array in `next-sitemap.config.js:13-17`, and the `Footer.tsx` slice. Move all consumers to `serviceAreas.ts`.
6. **Services are hardcoded in four files**: `ServicesGrid.tsx` (6 cards with icons + descriptions), `QuoteForm.tsx` (`SERVICE_OPTIONS` enum of 8), `QuoteSelector.tsx` (separate `SERVICES` enum of 8), and `Footer.tsx` (`SERVICES` link list of 7). Each has slightly different labels and slug conventions. There is no `Service` type and no `services.ts`.
7. **Reviews are hardcoded** in `TestimonialsSection.tsx:7-26` (3 entries, attributed to Yelp but not pulled from anywhere). Star count, review text, service tag and city are inline literals. No `AggregateRating` is emitted anywhere.
8. **Two parallel quote forms exist**: `QuoteSelector.tsx` (multi-step wizard backed by `useLeadForm` hook) and `QuoteForm.tsx` (single-page form, duplicates `axios.post` logic). The homepage renders both — `QuoteSelector` mid-page and `QuoteForm` again at the bottom. Pick one.

## Schema / SEO surface

9. **JSON-LD present but thin**: `LocalBusiness` on home (`pages/index.tsx:14-66`) and `Service` per city (`pages/[location].tsx:16-42`). Missing: `AggregateRating`, `FAQPage`, `BreadcrumbList`, `Organization`, `Service` per service slug. `sameAs` only lists Yelp / Instagram / Facebook — **Nextdoor, Alignable, JunkSpots, and Google Business Profile are absent**, which is exactly the array doing the heaviest anti-imposter lifting.
10. **Per-route metadata uses `next-seo`** (`DefaultSeo` in `_app.tsx`, `NextSeo` per page). Canonicals point at `thepeninsulapickup.com` correctly. OG image on home points at `/api/og` (good); on city pages at `/api/og?city=X` (good). On a vercel.app preview deployment **everything still claims canonical = production domain** — fine, but there's no `noindex` guard for previews, so previews are indexable in principle.
11. **`/api/og` is unguarded**: `pages/api/og.tsx:11-13` reads `?city=` and renders it verbatim with no whitelist against `serviceAreas.ts`. Anyone can craft `/api/og?city=<arbitrary>` and have Vercel render branded image cards for arbitrary copy. Validate against the typed content layer; 404 anything else.
12. **Sitemap/robots are static**, generated at build time by `next-sitemap` postbuild into `public/sitemap.xml` + `public/robots.txt`. There's no `app/sitemap.ts` / `app/robots.ts` (Pages Router shop), and no `manifest.ts`, `apple-touch-icon`, or favicon present (`_app.tsx:39` references `/favicon.ico` but the file does not exist in `public/`). The homepage OG also claims `/og-image.jpg` (`_app.tsx:23`) — also missing. Both are 404s today.
13. **No analytics, no tag manager, no third-party scripts** anywhere in `_document.tsx` / `_app.tsx`. Clean slate for CSP. The only external network at runtime is the Inter Google Font, loaded **twice** — once via `<link>` in `_document.tsx:7-12` and again via `@import url(...)` at the top of `globals.css:1`. Replace both with `next/font/google` for self-hosting + CSP.

## Form pipeline

14. **Quote submissions are pure client → external API**. `useLeadForm.ts:65` and `QuoteForm.tsx:60` both `axios.post` directly to `${NEXT_PUBLIC_API_URL}/api/leads/`. No server action, no `/api/leads` proxy on the Next side, no Zod validation, no rate limit, no honeypot, no Turnstile, no Twilio/SMS notify, no email notify. Consent checkbox exists (`QuoteForm.tsx:316-323`) and blocks submit, but TCPA disclosure copy is generic and the checkbox in `QuoteSelector.tsx:421-426` has identical UX. Both submit identical payloads minus a couple of fields.
15. **Validation is thin**: `QuoteSelector.tsx` checks `name.length >= 2` and 10 digits in phone; `QuoteForm.tsx` only blocks the disabled state on truthy fields. Neither rejects HTML / `http(s)://` / oversized payloads in name/message. Phone is not normalized to E.164. Email is not validated.

## Imagery

16. **Eight assets in `public/images/gallery/`**: `business-cover.jpeg` (750×429, **unused** in source), `job-debris-01.jpeg` (1200×967), `job-work-01..05.jpeg` (mostly 2048×1536, one 1536×2048 portrait, one 815×1200 portrait), and `junkspots-featured.png` (1024×576, a partner badge / brand graphic, currently slotted into the photo grid as if it were a job photo — visually mismatched). Total ~3.2MB raw. All run through `next/image` in `GallerySection.tsx`, but **the LCP candidate** (`featured` = `job-work-05.jpeg` at 1536×2048 portrait, 770KB) is loaded with `priority` and `sizes` set, which is correct — but a 770KB portrait JPEG is heavy for a hero asset.
17. **People exposure check**: I grepped imagery and copy for "Melissa", "Don", "Donovan", "team", "portrait", "founder". **No image file references depict named people**, but the alt text and on-page copy reference Don and Melissa frequently (`VerifyStrip.tsx:60`, `TrustSection.tsx:74`, `[location].tsx:174`, etc.) — that's body copy, which the requirements allow. The current gallery has no portrait / team photo — good baseline. Hard requirement holds going forward: no portrait imagery of Melissa.
18. **Stock cliché check**: nothing in the gallery currently reads as "smiling worker in PPE" stock. Photos appear to be real job shots. The weakest is `junkspots-featured.png` (a partner badge masquerading as a job tile) — pull it out of the grid.

## Security headers

19. **`next.config.js:7-19` sets four headers**: `X-Frame-Options: SAMEORIGIN` (requirements say `DENY`), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()` (missing `interest-cohort=()`). **No `Strict-Transport-Security`. No `Content-Security-Policy`.** No `vercel.json`, no `middleware.ts`. Need a strict CSP with nonces, HSTS preload, and the policy gaps closed.
20. **No preview-environment guard**: there's no `middleware.ts` to inject `X-Robots-Tag: noindex` when `VERCEL_ENV !== 'production'`, so the demo `*.vercel.app` host is indexable in principle and could itself become a duplicate-content footgun against the real domain.

## Identity / anti-imposter signals

21. **`sameAs` is the missing weapon** (see #9). The auto-memory has the full social profile inventory — Yelp, Instagram, Facebook, Nextdoor, Alignable, JunkSpots — but only three are wired into JSON-LD. The footer's "Find Us Online" cluster currently shows just Instagram + Yelp (`Footer.tsx:140-163`). No `<link rel="me">` tags in `_document.tsx`. No `/verify` page exists. No "Recommended on Nextdoor" badge in testimonials. No `sms:` CTA variant. No `navigator.share` affordance on city pages. Each of these is small individually, large in aggregate — they are the recovery story.

## Performance / accessibility quick reads

22. **First-load JS is fine but not measured**: hero, both forms, nav, and Framer Motion all load with the homepage. Framer Motion is used for hover/scroll fades that could be replaced with CSS or a lighter primitive in many places (`FadeIn.tsx` is already a wrapper) — relevant when the new map component lands and we have to live inside the 110kb gzip homepage budget.
23. **Accessibility is pretty good for a v1**: focus ring tokens in `globals.css:27-29`, aria-labels on icon buttons, `noValidate` forms with native `required`, breadcrumbs marked up. Gaps: form errors aren't announced via `aria-live`, the multi-step `QuoteSelector` step indicator isn't tied to assistive tech (`role="progressbar"` + `aria-valuenow`), the consent checkbox has no TCPA-specific disclosure, and color contrast on `text-steel-500` against `bg-charcoal-800` (#6b7585 on #1a1a1a) is borderline for body text — should verify in the rebuild.

## Budget / open questions for Phase 2

24. **Map**: nothing exists yet. No SVG outline, no map component, no service-area path data. Hard requirement is custom SVG + GSAP under 60kb gzipped — GSAP isn't installed yet (Framer Motion is). Need to decide whether to add GSAP for the map only (it's ~25kb gzipped for `gsap` core) or use Framer Motion's animate APIs we already pay for and stay strictly inside the existing dep tree.
25. **Domain story to lock down**: site URL constants are duplicated across `_app.tsx`, `pages/index.tsx`, `pages/[location].tsx`, `next.config.js`, and `next-sitemap.config.js`. The rebuild should centralize `siteConfig` (canonical URL, NAP, owner names, social `sameAs` array, business hours, geo) so every schema generator, OG card, sitemap entry, and metadata helper reads from the same module — same principle as the typed content layer, applied to the business identity.

— end of audit. Next: Phase 2 architecture proposal (~600 words). Holding until you say go.
