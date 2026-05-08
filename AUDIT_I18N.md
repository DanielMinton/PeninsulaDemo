# Phase 1 — i18n Audit

Snapshot at `main @ 5cde696`. The site shipped in single-locale (`en`) form one commit ago. This audit is what's true *today* against your spec, with the gaps the i18n layer needs to close.

## Stack & router (the first thing to flag)

1. **The spec says "App Router assumed." The codebase is Pages Router.** Next.js 14.2.3, `src/pages/*`, `_app.tsx`/`_document.tsx`, no `app/` directory. This is a load-bearing fact: it changes which i18n library is the right pick (`next-intl` works in both routers; `next-i18next` is Pages-only and battle-tested; Next's built-in `i18n` config in `next.config.js` works in Pages Router but not App Router). Whatever we choose has to honor the existing `getStaticProps`/`getStaticPaths` patterns rather than a server-component render model.
2. **No i18n library installed.** `next-intl`, `next-i18next`, `react-intl`, `formatjs` — none in `node_modules`. No `i18n` block in `next.config.js`. No locale-aware middleware logic.
3. **GSAP is not installed.** The slide-out spec mandates GSAP. Framer Motion is in the bundle and powers the existing `PeninsulaMap` and `Nav` animations. Adding GSAP for the slide-out is a known incremental cost; logged for the proposal.

## The typed content layer — partial coverage

4. **The content layer holds *data*, not UI chrome.** `src/content/{site,services,areas,reviews,faqs,map-outline}.ts` is the single source of truth for **business data only**: city names, service descriptions, FAQs, review text, owner names, NAP, social URLs. About 1,070 lines total across content + lib.
5. **UI-chrome strings are still inline JSX literals across components.** A quick `grep -hroE '>[A-Z][a-zA-Z ...]<'` finds **55 distinct JSX-text strings** just from the `>foo<` form, and that's the lowest-density signal — it misses `aria-label`, `placeholder`, `alt`, `title` props, multi-line paragraphs split across JSX expressions, and the const arrays inside components (e.g. `TRUST_SIGNALS`, `STEP_LABELS`, `SERVICE_OPTIONS`, `DASHBOARD_SECTIONS`). Realistic estimate: **250–400 unique segments** need to be keyed before translation can begin. Sample of what's still inline: "Where We Work", "What We Do", "From One Item to the Whole Property", "Verified Business Line", "Find Us Online", "Had a Good Experience?", "Need to confirm something live?", "Business of Record", every step label in `QuoteSelector`, every FAQ section heading, every breadcrumb segment, the privacy/terms body copy.
6. **Side-effect of #5**: a one-line "extract all strings" script will not work. Either (a) we walk every component and key every string into a typed message catalog (the Right Way; ~200–400 keys to author once), or (b) we narrow scope to the pages most likely to convert non-English speakers and leave admin pages (`/dashboard`, `/privacy`, `/terms`) English-only with a documented carveout. The proposal will recommend (a) but flag the scope.
7. **Form errors come from Zod and are English-only.** `src/lib/lead-schema.ts` hardcodes user-facing copy ("Tell us your name", "Enter a valid phone number", "No URLs allowed", "Consent is required"). These need a Zod `errorMap` per locale, or a thin "key → locale" wrapper.
8. **API/notify side messages**: `src/lib/notify.ts` and `src/pages/api/lead.ts` produce English log lines for ops only. Those are not user-visible and don't need translation; flag for completeness.

## Schema, metadata, OG, sitemap, robots — all locale-blind

9. **`src/lib/schema.ts`**: pure functions (`organization`, `localBusiness`, `service`, `breadcrumbs`, `faqPage`) that read directly from `SITE`/`AREAS`/`SERVICES`/`REVIEWS` and emit `@graph`. **No locale parameter, no `inLanguage` field.** `name`, `description`, breadcrumb labels, FAQ Q/A all currently English. The graph generator will need a `(locale)` arg and the helpers it pulls from will need to read locale-tagged copy.
10. **`@id` discipline**: `@id` fragments today are already locale-agnostic (`#business`, `#org`, `${SITE.url}/#business`) — that's good and matches the spec's requirement that the entity graph merge across locales.
11. **`sameAs` array**: globally consistent in `SITE.sameAs` — also good. Spec says it stays a single array across all locales; current shape supports that with no change.
12. **`src/lib/seo.ts` `pageSeo()` helper**: builds `NextSeoProps` with `canonical`, `openGraph`, `twitter`, `noindex`. Takes only English title/description. Will need `(locale, path)` signature so canonicals include the locale prefix and `og:locale` is set per-locale.
13. **`_app.tsx` `DefaultSeo`**: `siteName`, `og:locale: 'en_US'`, geo meta tags — all hardcoded. Needs locale plumbing.
14. **`src/pages/api/og.tsx`**: edge route, accepts `?city=` and `?service=` whitelisted against the content layer. Headlines and CTAs are inline English (`'Junk Removal in'`, `'On the SF Peninsula'`, `'Licensed & Insured · Family Owned'`, `'Junk Removal'`, `'Hauling'`, `'Cleanouts'`). Needs a `?locale=` param (whitelisted), the strings sourced from a small server-side message accessor, and font subset loading per locale (Satori needs the right glyphs available).
15. **`src/pages/sitemap.xml.ts`**: enumerates 24 routes from the typed content layer. **No `xhtml:hreflang`, no per-locale entries.** With 14 target locales, the entry count goes from 24 → 360 (24 × 15 including English).
16. **`src/pages/robots.txt.ts`**: produces a single sitemap link, no locale concept — fine; the per-locale entries live inside the sitemap itself, so the robots file is unchanged.

## Routing & middleware

17. **`src/middleware.ts`**: only does CSP and preview `noindex`. **No locale detection, no `Accept-Language` parsing, no cookie read, no path rewrite.** When the i18n middleware lands, it has to compose with the existing CSP middleware (Next.js only allows one `middleware.ts` — so the CSP and locale logic live in the same file).
18. **`next.config.js`**: has redirects for legacy flat-slug city paths (`/san-carlos` → `/areas/san-carlos`). When subpath locales ship, those redirects need to expand to cover prefixed forms (`/zh-Hans/san-carlos` → `/zh-Hans/areas/san-carlos`) — or the legacy redirect rule needs to land before the locale rewrite.
19. **`<html lang="en">`** is hardcoded in `_document.tsx`. Pages Router can't conditionally render `<Html>` per request without `getInitialProps` on `_document`, which kills static optimization. The fix: drive `lang` and `dir` from the resolved locale via `getStaticProps` on each page and pass through, OR override in `_document` with `getInitialProps` and accept the SSG cost. Both are documented next-i18next/next-intl patterns; the proposal will pick.

## Fonts

20. **One font today**: `Inter` via `next/font/google`, weights 300–900, subset `['latin']`. Inter ships glyph coverage for **Latin, Latin Extended, Cyrillic, and Vietnamese** in its source — but `next/font/google` only includes the subsets you list. Russian and Vietnamese could be served by extending the Inter `subsets` array (`['latin', 'cyrillic', 'vietnamese']`) at near-zero added weight, no second font needed. Same for Spanish/Portuguese/Filipino/Tongan/Gaelic — already covered by `latin` + `latin-ext`.
21. **What the locale set genuinely demands as new fonts**: Noto Sans SC (`zh-Hans`), Noto Sans JP (`ja`), Noto Sans KR (`ko`), Noto Sans Thai (`th`), Noto Sans Khmer (`km`), Noto Sans Hebrew (`yi`), Noto Nastaliq Urdu (`ur`). Seven additional font families, each loaded only on its own locale's pages. The spec budget of **< 30kb gz delta per locale** is achievable for Latin/Cyrillic locales (zero delta — same font), comfortable for Hebrew/Thai/Khmer (Noto subsets at 60–120kb un-gz / 25–50kb gz with the build-time content subset), and **tight for Nastaliq Urdu and CJK**. Proposal will project per-locale.
22. **Subsetting strategy**: spec says subset against the actual translated content. `next/font` doesn't auto-subset arbitrary glyph sets; we'll need `glyphhanger` or `subset-font` in the translate script's tail to emit a per-locale `.woff2` and have `next/font` load the local file.

## Existing performance and budget posture

23. **Last build**: 24 static pages, homepage `21.8 kB / 150 kB First Load JS` uncompressed, middleware `28.4 kB`. With 15 locales × the same pages, prerender count goes to 360 — feasible but the build time delta needs measuring before we bake it into CI. The spec's "**< 200ms perceived locale switch**" is achievable if every locale's page is statically pre-rendered (matches our current SSG default) and we use `router.push()` with prefetch-on-hover from the slide-out — but that means committing to `getStaticPaths` per `(page × locale)`, which is 360 paths in production.

## Decision points the proposal must resolve

24. **i18n library**: `next-intl` (modern, App-and-Pages, works with our SSG patterns) vs `next-i18next` (Pages-Router veteran) vs Next built-in (`i18n` in `next.config.js`, lighter but no message-catalog runtime). My lean is `next-intl` for the typed message API + ICU plural support, but proposal will compare. Next built-in alone won't satisfy the "messages catalog with build-time validation" requirement.
25. **Filipino/Tagalog**: ship `fil` only, do not duplicate. Display label: "Filipino". Confirmed.
26. **Khmer label**: recommend "Khmer (ខ្មែរ)" — the language is Khmer; "Cambodian" is the demonym, technically imprecise. Will surface in proposal.
27. **Gaelic**: default to `ga` (Irish) per spec. Will surface in proposal — Daniel can flip to `gd` (Scottish Gaelic) or ship both.
28. **Spanish region**: `es-MX` is correct for San Mateo County. Confirmed.
29. **Portuguese region**: `pt-BR` is the dominant Brazilian variant; East Bay/Peninsula Portuguese-speaking population is mostly Brazilian, not Continental. Confirmed unless audit reveals otherwise.
30. **Beta-flag candidates**: Tongan, Yiddish, Gaelic, Khmer — each has limited Bay Area native-speaker review channels. These ship behind `i18n.experimental: true` per spec; the slide-out marks them "Beta".

— end of audit. Awaiting approval before Phase 2 (architecture proposal, ~700 words).
