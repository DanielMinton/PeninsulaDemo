x1# Phase 2 — Architecture Proposal

Stays inside Pages Router, the existing palette, and (mostly) the existing dep tree. Two new deps: `zod`, `@upstash/ratelimit` + `@upstash/redis`, `twilio`, `resend`, `libphonenumber-js`. No GSAP. No App Router migration. No new colors.

## 1. Typed content layer (the SSOT)

Three modules under `src/content/` plus one identity module:

- `site.ts` — `SITE` constant: canonical URL, NAP (name/address/phone in display + E.164 + raw), owner names, founding date, geo, business hours, full `sameAs` array (Yelp, Instagram, Facebook, Nextdoor, Alignable, JunkSpots, Google Business Profile). Single source for every page, schema generator, OG card, and sitemap.
- `services.ts` — `Service[]` with `{ slug, name, shortName, blurb, description, faqs[] }`. Drives `ServicesGrid`, `/services/[slug]`, the form dropdown, the footer link list, and `Service` JSON-LD.
- `areas.ts` — replaces `lib/serviceAreas.ts`. `Area[]` adds `{ coords: [x,y] for the SVG map, geo: {lat,lng}, isHomeBase, services: ServiceSlug[], faqs?, neighborhoods? }`. Drives the map, `/areas/[city]`, the form dropdown, the footer, the sitemap, the homepage `areaServed` array, and the OG `?city=` whitelist.
- `reviews.ts` — `Review[]` `{ source, rating, text, service, city, dateISO }`. Drives `TestimonialsSection` and the `AggregateRating` JSON-LD (computed average + count).

Every consumer reads from these. No string lists hardcoded in components.

## 2. Route map

- `/` — home (hero, **interactive map**, services, trust, quote selector, gallery, testimonials, FAQ).
- `/areas/[city]` — replaces flat `/[location]`. Old paths get permanent redirects via `next.config.js`.
- `/services/[slug]` — new.
- `/verify` — new (identity proof, see §7).
- `/privacy`, `/terms` — kept.
- `/api/og` — kept, gains a content-layer whitelist for `?city=` and `?service=`; 404 otherwise.
- `/api/lead` — new server-side proxy for the form pipeline.
- `pages/sitemap.xml.ts` + `pages/robots.txt.ts` — dynamic, generated from the content layer. Drop `next-sitemap`.
- `middleware.ts` — emits `X-Robots-Tag: noindex` when `VERCEL_ENV !== 'production'` and stamps a per-request CSP nonce.

## 3. Map component

`src/components/map/PeninsulaMap.tsx` — one SVG, 1000-unit viewBox, outline path stored as a static string in `content/map-outline.ts`. Markers are `<button>` elements positioned from `area.coords`. Loaded with `next/dynamic({ ssr: true })` so the server renders the SVG into HTML for SEO + zero CLS, JS hydrates after LCP.

Animations reuse **Framer Motion already in the bundle**: `motion.button` for stagger entrance, `useReducedMotion()` short-circuits to final state, San Carlos pulse uses the existing Tailwind `pulseGlow` keyframe. Hover/focus reveals a portal'd card (`role="dialog"`, ESC closes, `aria-label` per marker, tab order set by `coords` from north-to-south).

Budget: SVG path + 10 markers + ~30 lines of TS = well under 60kb gzipped on top of what FM already costs. **Skipping GSAP**, decision logged in `DECISIONS.md`.

## 4. Structured data

`src/lib/schema.ts` — pure functions, all reading from the content layer:

- `localBusiness()` — `LocalBusiness` with full `sameAs`, `geo`, hours, `aggregateRating` derived from `reviews.ts`.
- `serviceSchema(slug)`, `breadcrumbs(items)`, `faqPage(faqs)`, `organization()`.

Each page composes its needed schemas into one `<script type="application/ld+json">{ "@graph": [...] }`. Per-route metadata uses a thin `seo()` builder (still next-seo) that always pulls canonical from `SITE` so previews never drift.

## 5. Form lifecycle

Client: `react-hook-form` (already installed) + Zod resolver → submits to `/api/lead`.

Server (`/api/lead`, Node runtime):
1. **Zod parse** — E.164 phone via `libphonenumber-js`, RFC email, max-length all fields, reject `<`, `>`, `http(s)://` in name/message. Honeypot field must be empty.
2. **Turnstile** — verify token against Cloudflare's siteverify in invisible mode. Reject on failure.
3. **Rate limit** — `@upstash/ratelimit` (sliding window) on `x-forwarded-for`: 5/hr **and** 20/day; both must pass.
4. **Notify** — Twilio SMS to Don (primary), Resend email to ops inbox (secondary), `Promise.allSettled` so neither blocks the other.
5. **Store** — forward sanitized payload to Django `/api/leads/` server-to-server with a shared `X-Internal-Token` header. Django stops trusting the public.

Consent unchecked by default, TCPA disclosure inline, blocks submit, recorded in payload. Errors announced via `aria-live="polite"`.

## 6. Security headers (concrete)

`middleware.ts` issues a per-request nonce; `next.config.js` ships the rest:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-<N>' https://challenges.cloudflare.com;
  style-src  'self' 'nonce-<N>';
  img-src    'self' data: https:;
  font-src   'self' data:;
  connect-src 'self' https://challenges.cloudflare.com;
  frame-src  https://challenges.cloudflare.com;
  frame-ancestors 'none';
  base-uri 'self'; form-action 'self'; upgrade-insecure-requests
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
```

Inter migrates to `next/font/google` (self-hosted), so `style-src` doesn't need `fonts.googleapis.com` and the double-load (`<link>` + CSS `@import`) goes away.

## 7. /verify — anti-imposter UX

A single page that *proves* identity and links into schema:
- Real domain, real phone, real address, real owners, founding year — each as a verifiable card.
- A clear, factual "this site (`thepeninsulapickup.com`) is the legitimate Peninsula Pick Ups; the entity at `peninsulapickups.com` / (415) … is unaffiliated" callout. Phrased as public-record clarification, not legal accusation.
- Every legitimate profile (Yelp, Instagram, Facebook, Nextdoor, Alignable, JunkSpots, GBP) rendered as a cited card with logo + deep link + last-verified date.
- `<link rel="me">` for each profile in `_document.tsx`.
- The page is the canonical anchor for the `sameAs` array — every JSON-LD block on every route lists `https://thepeninsulapickup.com/verify` alongside the social profiles, so the verification page is a reciprocal identity signal.
- Linked from the homepage `VerifyStrip` "Verified" badge, the footer, and the `_document` head.

—

Stopping here. Awaiting **"approved"** before any code lands.
