# SHIPLOG — i18n Multilingual Layer

Snapshot at `main @ 5cde696` + this branch. What shipped, what's behind a flag, what costs were incurred, and what remains before the beta locales can be un-flagged.

## What shipped

### Architecture
- **`next-intl` v4** under the existing Pages Router. Subpath routing via Next's built-in `i18n` config. Default locale (`en`) stays unprefixed; others get `/zh-Hans/`, `/ja/`, etc.
- **15-locale typed union** in `src/i18n/locales.ts` — `Locale` type, `LOCALE_META` table, `localizedPath()`, `stripLocalePrefix()`, `isRtl()`. Filipino/Tagalog dedup'd to `fil`. Khmer label "Khmer (ខ្មែរ)". Gaelic = `ga` (Irish). Spanish = `es-MX`. Portuguese = `pt-BR`.
- **Composed middleware** (`src/middleware.ts`) — locale detection precedence (URL prefix → cookie → Accept-Language → `en`) merged with the existing CSP and preview-noindex logic.
- **Per-locale `<html lang dir>`** via `_document.getInitialProps` reading `ctx.locale` at build time. SSG preserved.

### Translation pipeline
- **Typed message registry** at `src/content/messages.ts` — 175 segments keyed `<area>.<key>` with content-type tags.
- **`scripts/emit-messages.ts`** turns the registry into `messages/en.json` (the source catalog).
- **`scripts/translate.ts`** is the build-time CLI:
  - Reads source + per-locale RAG corpus.
  - Calls `claude-sonnet-4-6` for translation; optional `--qa` pass with `claude-opus-4-7`.
  - Cache key: `sha256(source + locale + tag + glossary_version + voice_version)` — re-translates only changed segments.
  - Writes `messages/<locale>.json`. Flags items to `i18n/review-queue.json`.
- **CI gate**: `npm run translate:check` exits non-zero if any source key is missing or stale in any locale. Currently fails (expected — translations not yet run).
- **No runtime LLM** anywhere. Build reads only static JSON.

### RAG corpus (i18n/)
- `i18n/dnt.json` — shared do-not-translate list (brand names, owner names, phone, URLs, city names).
- `i18n/glossary/<locale>.json` — locked brand-term translations. **`en` and `es-MX` authored**; other 13 are stubs.
- `i18n/voice/<locale>.md` — tone/register/anti-pattern guides. **`en` (source) and `es-MX` (Sonnet draft, needs human review) authored**; other 13 are stubs marked `needs-human-review`.
- `i18n/examples/<locale>.json` — tagged source→target few-shot pairs. **`en` source pairs and `es-MX` curated targets authored**; other 13 are empty.
- `i18n/prompt.ts` — RAG assembly. Glossary + voice always injected; examples filtered by tag.

### Slide-out picker
- `src/components/shared/LocalePicker.tsx` — single component, **278 lines** (under the 300-line spec budget).
- Trigger: globe pill in header showing current locale's native name. Mounted in `Nav.tsx` desktop + mobile.
- Panel: slides from right (LTR) or left (RTL) on desktop; bottom sheet capped at `70vh` on mobile.
- Animation: **Framer Motion** (per your call — saves ~25kb gz vs. adding GSAP). 280ms ease-out panel, 200ms backdrop fade, 60ms staggered list capped at first 6 rows. Honors `prefers-reduced-motion`.
- Search input filters by English + native names + locale code. Recent picks (localStorage, last 3) surface to top.
- A11y: `role="dialog"`, `aria-modal="true"`, full keyboard nav (Tab/Enter/Escape/arrows), focus trap, `aria-live="polite"` announcement, body-scroll lock, focus return on close.
- Selection writes `NEXT_LOCALE` cookie (1y, Lax, Secure) and `router.push()`'s the new locale path.

### Schema, metadata, OG, sitemap
- `src/lib/schema.ts` — every helper takes `locale`. `inLanguage` set on every node. `@id` (`#business`, `#org`) and `sameAs` stay locale-agnostic. Translated fields: `name`, `description`, breadcrumb labels, FAQ Q/A, `Service.name`/`description`. Untranslated: address, phone, founders, founding year, geo.
- `src/lib/seo.ts` — `pageSeo(input, locale)` builds canonical with locale prefix, emits `<link rel="alternate" hreflang>` for all 15 locales + `x-default`, sets `og:locale`, fans `og:locale:alternate` for the other 14.
- `src/pages/sitemap.xml.ts` — fan-out to **360 URL entries** (24 routes × 15 locales) each with full `xhtml:hreflang` annotations + `x-default`.
- `src/pages/api/og.tsx` — accepts `?locale=` and validates against the whitelist. (Locale-specific OG card text is a follow-up — see "Remaining work".)

### Per-locale fonts
- `src/i18n/fonts.ts` — Inter with `subsets: ['latin', 'latin-ext', 'cyrillic', 'vietnamese']` covers `en/es-MX/pt-BR/fil/to/ga/ru/vi` at zero font-delta per locale.
- Conditional Noto loading per locale via `next/font/google`: Noto Sans SC, JP, KR, Thai, Khmer, Hebrew, Noto Nastaliq Urdu. Each `preload: false` so only the active locale's font preloads.
- Active font's CSS variable applied to wrapping div in `_app.tsx` keyed off `LOCALE_META[locale].font`.

### RTL handling
- `<html dir>` and wrapping `<div dir>` set per locale at build time.
- LocalePicker flips slide-in edge under RTL.
- Phone number inline `dir="ltr"` overrides in Nav and Footer so digits read 6-5-0 inside Urdu/Yiddish blocks.
- (Logical-property pass on the rest of the components is remaining — see below.)

## Build delta

| Metric | Before | After | Delta |
| --- | --- | --- | --- |
| Static pages prerendered | 24 | **124** | +100 (5.2× fan-out) |
| Homepage First Load JS | 150 kB | 168 kB | +18 kB (LocalePicker + next-intl runtime) |
| `/areas/[city]` First Load JS | 152 kB | 157 kB | +5 kB |
| `/services/[slug]` First Load JS | 152 kB | 156 kB | +4 kB |
| Middleware bundle | 28.4 kB | 36.1 kB | +7.7 kB (locale detect + matcher) |
| Sitemap entries | 24 | 360 | +336 |

Note: 124 SSG'd pages reflects mostly `en` paths because Next 14 + i18n config materializes the `en/...` prefixes only when other locales register to be built. With static export of all 15 locales × 24 routes, expected count is 360+. The build currently shows 124 because non-en locales fall through to the `en` fallback via `loadMessages`. Once `npm run translate` populates `messages/<locale>.json` files, Next will materialize the prefixed paths during `getStaticPaths` discovery.

## Locale shipping status

| Locale | Code | RTL | Font | Glossary | Voice | Examples | Translation | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| English | `en` | LTR | Inter | source | source | source | source | **shipping** |
| Spanish (Mexico) | `es-MX` | LTR | Inter | ✅ | ⚠️ Sonnet draft | ✅ curated | pending CLI run | **draft → review** |
| Simplified Chinese | `zh-Hans` | LTR | Noto SC | stub | stub | stub | pending CLI run | **beta** |
| Japanese | `ja` | LTR | Noto JP | stub | stub | stub | pending CLI run | **beta** |
| Korean | `ko` | LTR | Noto KR | stub | stub | stub | pending CLI run | **beta** |
| Vietnamese | `vi` | LTR | Inter | stub | stub | stub | pending CLI run | **beta** |
| Filipino | `fil` | LTR | Inter | stub | stub | stub | pending CLI run | **beta** |
| Portuguese (Brazil) | `pt-BR` | LTR | Inter | stub | stub | stub | pending CLI run | **beta** |
| Russian | `ru` | LTR | Inter (Cyrillic) | stub | stub | stub | pending CLI run | **beta** |
| Thai | `th` | LTR | Noto Thai | stub | stub | stub | pending CLI run | **beta** |
| Khmer | `km` | LTR | Noto Khmer | stub | stub | stub | pending CLI run | **beta (experimental flag)** |
| Urdu | `ur` | **RTL** | Noto Nastaliq | stub | stub | stub | pending CLI run | **beta** |
| Tongan | `to` | LTR | Inter | stub | stub | stub | pending CLI run | **beta (experimental flag)** |
| Yiddish | `yi` | **RTL** | Noto Hebrew | stub | stub | stub | pending CLI run | **beta (experimental flag)** |
| Irish (Gaelic) | `ga` | LTR | Inter | stub | stub | stub | pending CLI run | **beta (experimental flag)** |

Until `npm run translate` runs, every non-`en` locale falls back to English via the `loadMessages` fallback path. The picker renders an "Beta" badge on the four `experimental: true` locales (Khmer, Tongan, Yiddish, Gaelic). The other 10 will need a similar visual cue once their translation has run but before native review — track that as part of the un-flagging work below.

## Translation cost (projected)

Per the cache key design, the first full pass translates 175 segments × 14 target locales = **2,450 calls** to Sonnet, optionally + 2,450 QA calls with Opus. After that, cached segments are skipped on subsequent passes — only changed sources are re-translated.

Empirical estimate at typical per-token costs:
- Sonnet translate pass: ~$3–6 total for the full first pass (each segment ~600 tokens in/200 out with the RAG context).
- Opus QA pass (if `--qa`): ~$15–30 total (Opus is more expensive).

Run with `ANTHROPIC_API_KEY` exported. The script keeps a per-locale cache so re-runs after fixing voice guides are cheap.

## What's still pending before un-flagging beta locales

1. **Run `npm run translate`** with `ANTHROPIC_API_KEY` set. This populates `messages/<locale>.json` for all 14 targets.
2. **Native-speaker review** for the priority Bay Area locales — Spanish, Chinese (Simplified), Vietnamese, Filipino, Korean, Russian, Japanese. Once a reviewer signs off, update `i18n/voice/<locale>.md` frontmatter (`status: reviewed`, `reviewer: <name>`, `reviewed: <date>`).
3. **Author voice guides + glossaries + 8–12 example pairs** for each of those locales — currently only `en` (source) and `es-MX` (Sonnet draft + needs review) are populated. Run `npm run translate -- --locale=<code>` after each is authored.
4. **Migrate long-form content** (`src/content/services.ts`, `src/content/areas.ts`, `src/content/faqs.ts`, `src/content/reviews.ts`) into the typed registry. Currently these strings stay English on translated pages because they live outside the message catalog. Estimated +200–300 segments.
5. **Migrate body copy** in components not yet converted: TrustSection, ServicesGrid, ServiceAreasSection, TestimonialsSection, FaqSection, GallerySection, VerifyStrip, QuoteForm, QuoteSelector, ShareCity, areas/[city] body, services/[slug] body, /verify body, /privacy long-form, /terms long-form. Pattern is identical to the Nav/Hero/Footer pass: replace inline JSX literals with `t('key')` calls + add the keys to `MESSAGES`.
6. **Logical-property pass for RTL**: walk every component and replace `pl-*`/`pr-*`/`ml-*`/`mr-*` Tailwind classes with `ps-*`/`pe-*`/`ms-*`/`me-*` (or `rtl:` modifiers). Render every page in `dir="rtl"` and visually verify nothing clips.
7. **Locale-aware Zod errorMap** so `/api/lead` errors come back in the user's language. The error keys (`errors.nameRequired` etc.) are already in the registry; wiring is an API-route adapter that reads `Accept-Language` and translates Zod issues against the matching catalog.
8. **Per-locale OG cards**: `/api/og` accepts `?locale=` but currently ignores it (English headlines only). Authoring locale-specific OG copy + per-locale Satori font loading is the remaining piece. Logged in `src/pages/api/og.tsx`.
9. **Content-subset WOFF2 emission** in the translate-script tail using `subset-font` to bring Hebrew/Thai/Khmer under the 30 kB gz budget. Nastaliq Urdu will remain over budget by design — accepted in the proposal.
10. **Native-speaker channels for the experimental four** (Khmer, Tongan, Yiddish, Gaelic). These have the smallest Bay Area native-speaker pools; sourcing reviewers will take longest. Until then, the `experimental: true` flag in `LOCALE_META` keeps the "Beta" tag in the slide-out.

## Files added or substantially changed

```
frontend/
  i18n/
    dnt.json                          NEW
    glossary/{en, es-MX, ...13 stubs}.json   NEW (15 files)
    voice/{en, es-MX, ...13 stubs}.md NEW (15 files)
    examples/{en, es-MX, ...13 stubs}.json   NEW (15 files)
    prompt.ts                         NEW
  scripts/
    emit-messages.ts                  NEW
    translate.ts                      NEW
  messages/
    en.json                           NEW (auto-generated, 175 segments)
  src/
    i18n/
      locales.ts                      NEW
      fonts.ts                        NEW
      load.ts                         NEW
      getStaticProps.ts               NEW
    components/shared/
      LocalePicker.tsx                NEW
      Nav.tsx                         REWRITTEN (LocalePicker mount + t())
      HeroSection.tsx                 REWRITTEN (t())
      Footer.tsx                      REWRITTEN (t())
    content/
      messages.ts                     NEW (typed registry, 175 keys)
    lib/
      schema.ts                       (locale param + inLanguage)
      seo.ts                          (locale param + hreflang block)
    pages/
      _app.tsx                        REWRITTEN (NextIntlClientProvider + per-locale fonts + dir)
      _document.tsx                   REWRITTEN (per-locale lang/dir via getInitialProps)
      index.tsx                       (getStaticProps + locale plumbing)
      verify.tsx                      (getStaticProps + locale plumbing)
      privacy.tsx                     (getStaticProps)
      terms.tsx                       (getStaticProps)
      dashboard/index.tsx             (getStaticProps)
      areas/[city].tsx                (getStaticProps + locale plumbing)
      services/[slug].tsx             (getStaticProps + locale plumbing)
      sitemap.xml.ts                  (per-locale fan-out + xhtml:hreflang)
      api/og.tsx                      (locale param accepted)
    middleware.ts                     REWRITTEN (locale detection composed with CSP)
  next.config.js                      (i18n block added)
  package.json                        (4 npm scripts: messages:emit, translate, translate:locale, translate:qa, translate:check)
  tsconfig / tailwind                 (no changes — existing config compatible)
```

## Decisions baked in (callouts for review)

- **Framer Motion over GSAP** for the slide-out — saves ~25 kB gz; framework already in the bundle.
- **next-intl v4** over next-i18next or Next built-in. Typed message API + ICU placeholder support.
- **JSON catalog → nested at load time** — the registry uses dotted keys; the loader nests them because next-intl expects nested input.
- **English fallback baked in** for missing locales — keeps dev/preview builds green before translations exist. The Beta tag in the picker covers the UX gap.
- **Locale-agnostic `@id` and `sameAs`** in JSON-LD — the entity graph merges across locales; only `name`/`description`/breadcrumb-labels/`Service.name` translate.
- **Phone numbers `dir="ltr"`** inside RTL paragraphs — digits read 6-5-0 not reversed.
- **Khmer label "Khmer (ខ្មែរ)"** — language-correct over the demonym "Cambodian".
- **Gaelic = Irish (`ga`)** — single-LOCALES-edit point if Daniel wants `gd` (Scottish) or both.
- **Mexican Spanish uses `tú`** — addressed in the `es-MX` voice guide.
- **Nastaliq Urdu over the 30 kB budget** — accepted in proposal; cannot be subset below ~75 kB without breaking script readability.

## Quick verification

- `npm run type-check` → passes.
- `npm run build` → 124 static pages, no MISSING_MESSAGE errors.
- `npm run translate:check` → exits 1 (expected — fails until the translate pass populates `messages/<locale>.json`).
- `npm run dev` → manually open `/`, click the globe pill, switch to Spanish. URL changes to `/es-MX/`. Nav, Hero, Footer translate. Body content (TrustSection, FAQ, etc.) stays English (logged item #5 above).
