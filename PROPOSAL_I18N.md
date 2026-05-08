# Phase 2 — i18n Architecture Proposal

Snapshot at `main @ 5cde696`. Built on the audit. Target: ship 14 translation locales + English source through a build-time RAG pipeline, surfaced behind a single slide-out picker.

## Locale set & ambiguity decisions

Fifteen entries: `en` (source, default), `zh-Hans`, `ja`, `fil`, `ru`, `ko`, `th`, `km`, `ur`, `vi`, `to`, `es-MX`, `pt-BR`, `yi`, `ga`. Filipino and Tagalog ship as a single `fil` entry (Filipino is the standardized register of Tagalog; duplicating would split the audience). Khmer label reads "Khmer (ខ្មែរ)" — language-correct over demonym. Gaelic defaults to Irish (`ga`); the `LOCALES` union is the only edit point if Daniel wants to flip to `gd` or ship both. Spanish is `es-MX` (Mexican variant dominant in San Mateo County). Portuguese is `pt-BR`.

Codes live as a `readonly` typed union in `src/i18n/locales.ts` — every locale-aware function consumes `Locale`, never `string`. The slide-out, middleware, schema helpers, and message accessor all import from this single source.

## Library + routing

**`next-intl` v3** under the existing Pages Router. Works with `getStaticProps`/`getStaticPaths`, ships a typed message API, and the message-key union can be generated from the source catalog so missing keys fail at compile time. `next-i18next` is the alternative; chosen `next-intl` for the tighter type story and active maintenance.

Subpath strategy via Next's built-in `i18n` config (`locales`, `defaultLocale: 'en'`, `localeDetection: false` — we own detection). Default locale stays unprefixed (`/`); others get `/zh-Hans/`, `/ja/`, etc. Detection precedence runs in our middleware: explicit URL prefix → `NEXT_LOCALE` cookie (1y, `Lax`, `Secure`) → `Accept-Language` (BCP-47 best-fit via `@formatjs/intl-localematcher`) → `en`. CSP and locale logic compose in the existing `src/middleware.ts`.

Canonical URL per locale: `pageSeo()` composes `SITE.url + (locale === 'en' ? '' : '/' + locale) + path`. `<link rel="alternate" hreflang>` emits all 15 locales plus `x-default` pointing to the unprefixed English root.

## Translation pipeline (build-time, no runtime LLM)

`scripts/translate.ts` is a Node CLI. The build path never calls the LLM.

1. Reads the source catalog `messages/en.json` (compiled from a typed registry in `src/content/messages.ts` — every UI string keyed `<page>.<component>.<key>`; Zod `errorMap` reads from the same registry).
2. For each segment × target locale, computes `sha256(source + locale + tag + glossary_version + voice_version)` and skips if the existing `messages/<locale>.json` entry matches.
3. Otherwise assembles the RAG prompt and calls `claude-sonnet-4-6`. Result is written back with the cache key.
4. With `--qa`, re-reads every translation in context with `claude-opus-4-7`; flagged items go to `i18n/review-queue.json`.

Scripts: `npm run translate`, `translate:locale -- --locale=ja`, `translate:check` (CI gate, fails on missing keys). `next build` reads only static JSON. All `messages/*.json` committed.

## RAG layer

Lightweight and file-based — no vector store at this corpus size (~300 segments × 14 targets). Per locale: `i18n/glossary/<locale>.json` (locked brand terms — phone rendering, "Don and Melissa", city names), `i18n/voice/<locale>.md` (300-word tone guide), `i18n/examples/<locale>.json` (8–12 tagged source→target pairs). Shared `i18n/dnt.json` (phone, URLs, brand names).

Retrieval per segment: glossary + voice guide always injected; examples filtered to those whose `tag` matches the segment (`cta`, `legal`, `testimonial`, `service-description`, etc.). Prompt assembled in `i18n/prompt.ts`. Locales without verified native-speaker review (likely Tongan, Khmer, Yiddish, Gaelic) ship behind `experimental: true` and the slide-out marks them "Beta".

## Slide-out UI

Single `<LocalePicker />` component, < 300 lines. Trigger: globe pill in the header showing the current locale's native name, always visible, always tappable. Panel slides from the right (LTR) or left (RTL) on desktop; bottom sheet on mobile capped at `70vh`. **GSAP** timeline (new dependency, ~25kb gz, accepted): 280ms panel ease-out, 200ms backdrop fade, 60ms staggered list items capped at the first 6 rows. Under `prefers-reduced-motion`: skip animations, render final state.

`role="dialog"`, `aria-modal="true"`, `aria-label="Choose language"`. List is `role="listbox"` with `aria-selected`. Full keyboard nav (Tab, Enter, Escape, arrows). Focus trap; focus returns to trigger on close. Hidden `aria-live="polite"` region announces "Language changed to [native name]". Search input filters by English name and native script. Recent picks (cookie) surface to top. Footer line: "Translations are reviewed for cultural accuracy. [Report a translation issue →]".

## RTL handling (Urdu, Yiddish)

`<Html lang dir>` set per locale via `_document.getInitialProps` — Pages Router + `i18n` config runs `_document` once per (page × locale) at build time, so SSG is preserved. Tailwind `rtl:` modifiers enabled; codebase pass swaps every `margin-left` / `pl-*` for logical equivalents (`margin-inline-start`, `ps-*`). Phone numbers wrapped in `<span dir="ltr">` so digits read 6-5-0 inside RTL paragraphs. Slide-out flips its slide-in edge under RTL. Regression: every page renders in both directions in CI.

## Per-locale fonts

`en`, `es-MX`, `pt-BR`, `fil`, `to`, `ga`, `ru`, `vi`: Inter with `subsets: ['latin', 'latin-ext', 'cyrillic', 'vietnamese']` — one font, ~0kb delta per locale. New families, conditionally loaded via `next/font/local` keyed off the active locale: Noto Sans SC/JP/KR/Thai/Khmer (weights 400/600), Noto Sans Hebrew (`yi`), Noto Nastaliq Urdu. Each subset against actual translated content using `subset-font` in the translate script tail.

Projected gz delta: Latin/Cyrillic/Vietnamese **0kb**; Hebrew/Thai/Khmer **~25–40kb** (within budget); JP/KR **~45–60kb** (within budget); SC **~55–70kb** (within budget); Nastaliq Urdu **~75–90kb** (over the 30kb budget — accepted with note; Nastaliq cannot be subset below this without becoming unreadable).

## Performance budgets

Every (page × locale) statically pre-rendered → 360 paths. Slide-out prefetches the destination locale on hover/focus, so click-to-paint stays < 200ms. Per-locale message catalog ships as a lazy `import()` (~2–6kb gz active locale only — non-active catalogs never reach the client). LCP per locale on 4G targeted < 1.8s; CI runs Lighthouse on a representative sample (en, ja, ur).

## Schema graph & metadata

`organization()`, `localBusiness()`, `service()`, `breadcrumbs()`, `faqPage()` all gain `(locale)`. `inLanguage` set on every node. **`@id` fragments stay locale-agnostic** (`#business`, `#org`, `${SITE.url}/#business`) so the entity graph merges across locales — already the case today. **`sameAs` stays a single global array** — entity property, not per-locale. Translated fields per locale: `name`, `description`, `BreadcrumbList.name`, `Service.name`/`description`, `FAQPage` Q/A, `reviewBody`. Untranslated: address, phone, founder names, founding year, geo. `/api/og` accepts `?locale=` (whitelisted), routes Satori through the right font subset, and renders translated headlines from the same catalog. `pageSeo()` becomes `pageSeo(input, locale)` and emits the `hreflang` block. Sitemap fans 24 → 360 entries with `xhtml:hreflang` annotations.

— end of proposal. Awaiting approval before Phase 3 (implementation).
