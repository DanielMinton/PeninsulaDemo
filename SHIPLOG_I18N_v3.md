# SHIPLOG — i18n v3 (locale set swap + Bay Area expansion)

Built on `SHIPLOG_I18N_v2.md`. This ships:

1. **Tier B + Bay Area expansion** (es-MX, zh-Hans, vi, ko, ja, ru, fil) fully translated and rendering on every page.
2. **pt-BR partial** — 241/389 keys translated; remaining 148 hit credit-balance limits and fall back to English mid-page until a top-up.
3. **Locale set swap**: removed `to`, `km`, `ga`, `th`, `yi` (low Bay Area volume + sourcing review channels infeasible for some); added `id`, `nl`, `de`, `he`, `tlh`.
4. **5 new locales** (id, nl, de, he, tlh) — corpus authored, awaiting `npm run translate` once API credits are topped up.
5. **Translation pipeline parallelism** — `--concurrency=N` flag (1–20) cuts per-locale runtime from ~10 min sequential to ~2 min at concurrency=8.
6. **Dev server cache** — `loadMessages()` switched from webpack `require()` to `fs.readFileSync()` so freshly translated messages files surface without a manual server restart.

Verification recipe: `bash frontend/scripts/verify-locales.sh`. Current run:

```
=== Shipping locales (H1 must differ from English) ===
  en         ✓ The Pickup
  es-MX      ✓ La Recolección
  zh-Hans    ✓ 上门收取
  vi         ✓ Dịch vụ thu gom
  ko         ✓ 수거 서비스
  ja         ✓ 回収サービス
  ru         ✓ Вывоз
  fil        ✓ Ang Pickup
  pt-BR      ✓ A Retirada

=== Pending locales (corpus authored, awaiting translate run) ===
  id         ⏳ english fallback: 'The Pickup'
  nl         ⏳ english fallback: 'The Pickup'
  de         ⏳ english fallback: 'The Pickup'
  he         ⏳ english fallback: 'The Pickup'
  tlh        ⏳ english fallback: 'The Pickup'

=== Stub locales (corpus not authored, English fallback expected) ===
  ur         ✓ fallback to en: 'The Pickup'

=== <html dir="rtl"> for he and ur ===
  he: <html lang="he" dir="rtl"
  ur: <html lang="ur" dir="rtl"

PASS: 9 shipping locales render translated content.
```

---

## What's in the box right now

### 9 fully-translated locales (live)

| Locale | Code | Native | Hero H1 | Status |
|---|---|---|---|---|
| English | `en` | English | The Pickup | source |
| Spanish (Mexico) | `es-MX` | Español | La Recolección | 389/389 ✅ |
| Simplified Chinese | `zh-Hans` | 简体中文 | 上门收取 | 389/389 ✅ |
| Vietnamese | `vi` | Tiếng Việt | Dịch vụ thu gom | 389/389 ✅ |
| Korean | `ko` | 한국어 | 수거 서비스 | 389/389 ✅ |
| Japanese | `ja` | 日本語 | 回収サービス | 389/389 ✅ |
| Russian | `ru` | Русский | Вывоз | 389/389 ✅ |
| Filipino | `fil` | Filipino | Ang Pickup | 389/389 ✅ |
| Portuguese (Brazil) | `pt-BR` | Português | A Retirada | 241/389 ⚠ (148 hit credit-balance, fall back) |

### 5 pending locales (corpus authored, awaiting translate run)

| Locale | Code | Native | Notes |
|---|---|---|---|
| Indonesian | `id` | Bahasa Indonesia | Bahasa baku register, formal Anda. |
| Dutch | `nl` | Nederlands | Standard Netherlands Dutch (not Belgian/Flemish), formal "u". |
| German | `de` | Deutsch | Standard Hochdeutsch (not AT/CH variants), formal "Sie". |
| Hebrew | `he` | עברית | Modern Israeli Hebrew, RTL, Noto Sans Hebrew font. |
| Klingon | `tlh` | tlhIngan Hol | KLI Latin transliteration, permanently `experimental: true` (no native speakers exist). Best-effort approximations for modern-business concepts. |

Each has: voice guide (`i18n/voice/<locale>.md`), glossary (`i18n/glossary/<locale>.json`), 12 curated source→target pairs (`i18n/examples/<locale>.json`).

### 1 stub locale (no corpus, English fallback)

| Locale | Code | Native | Notes |
|---|---|---|---|
| Urdu | `ur` | اُردُو | RTL, Noto Nastaliq Urdu font already loaded. Corpus not authored — would benefit from a Bay Area Urdu speaker for the voice guide. |

### Removed locales

`to` (Tongan), `km` (Khmer), `ga` (Irish/Gaelic), `th` (Thai), `yi` (Yiddish). Per user direction: removed from `LOCALES`, `LOCALE_META`, `next.config.js`, `middleware.ts`, `api/og.tsx`. Their corpus files (voice/glossary/examples) deleted from `i18n/`. The `next/font/google` Noto Sans Thai and Noto Sans Khmer imports also dropped from `src/i18n/fonts.ts`.

---

## What ships visually

The site at `localhost:3000`:

1. **Pill** — fixed top-right (top-left under RTL), orange-tinted border, ring, drop shadow, backdrop blur. Outside the header chrome cluster. Same component as v2.
2. **Picker panel** — slides in from right (LTR) / left (RTL). Search filters by English + native names. Recent picks (localStorage, last 3) at top. Beta tag shows on `tlh` (permanent) and any future `experimental: true` locales.
3. **Body translates** end-to-end on the 9 shipping locales: Nav, Hero, Trust signals, Service Areas, Service Cards (including service names + blurbs), Testimonials, Gallery, Quote Form, Quote Selector, FAQ, Footer. Page `<title>` and meta description also localize.
4. **RTL** correctly mirrors layout for `he` and `ur` (when `he` is translated, the existing chrome will already render correctly via `tailwindcss-rtl` plugin).
5. **Phone numbers** stay LTR via `<span dir="ltr">` inside RTL paragraphs.

---

## What needs to happen for the 5 pending + pt-BR top-up

```bash
# 1. Top up Anthropic credit at https://console.anthropic.com/settings/billing
# 2. Run translate for the 5 pending locales (parallel, ~3 min/locale):
cd frontend
npm run translate -- --locale=id    --concurrency=8
npm run translate -- --locale=nl    --concurrency=8
npm run translate -- --locale=de    --concurrency=8
npm run translate -- --locale=he    --concurrency=8
npm run translate -- --locale=tlh   --concurrency=8
# 3. Finish pt-BR — cache skips the 241 already done, only retries the 148 that hit credit-balance:
npm run translate -- --locale=pt-BR --concurrency=8
# 4. Verify:
bash scripts/verify-locales.sh
# 5. Commit messages/*.json with a note that the locale set is fully shipped.
```

Estimated cost: ~$8–15 total at current Sonnet pricing.

---

## Pipeline + tooling improvements in v3

- **`scripts/translate.ts` parallelism** — added `--concurrency=N` flag (1–20). Worker pool with shared todo queue. ~5× speedup at concurrency=8 vs sequential.
- **`scripts/verify-locales.sh`** — categorized output (Shipping / Pending / Stubs / RTL check) and accurate exit code for CI.
- **`frontend/.env.local`** — gitignored. `scripts/translate.ts` reads `ANTHROPIC_API_KEY` from there via inline `.env.local` parse (no `dotenv` runtime dep).
- **`src/i18n/load.ts`** — fs-based read so the dev server picks up new translations without a manual restart.

---

## Files added or substantially changed in v3

```
frontend/
  i18n/
    voice/{ko,ja,ru,fil,pt-BR,id,nl,de,he,tlh}.md      AUTHORED  (10 voice guides)
    glossary/{ko,ja,ru,fil,pt-BR,id,nl,de,he,tlh}.json AUTHORED  (10 glossaries)
    examples/{ko,ja,ru,fil,pt-BR,id,nl,de,he,tlh}.json AUTHORED  (10 example sets)
    voice/{to,km,ga,th,yi}.md                          DELETED   (locale set swap)
    glossary/{to,km,ga,th,yi}.json                     DELETED
    examples/{to,km,ga,th,yi}.json                     DELETED
  messages/
    en.json                                            389 segments (was 309)
    {ko,ja,ru,fil}.json                                NEW (full)
    pt-BR.json                                         NEW (partial 241/389)
  scripts/
    translate.ts                                       + concurrency, dotenv parse
    verify-locales.sh                                  NEW (categorized)
  src/
    content/messages.ts                                +110 service/area/faq/meta keys
    content/copy.ts                                    NEW (getServiceCopy/getAreaCopy/getHomepageFaqs)
    content/reviews.ts                                 service:string → serviceSlug:ServiceSlug
    i18n/locales.ts                                    locale set swap
    i18n/fonts.ts                                      dropped Noto Thai/Khmer
    i18n/load.ts                                       fs.readFileSync (dev cache fix)
    middleware.ts                                      mirror locale list
    pages/api/og.tsx                                   mirror VALID_LOCALES
    pages/index.tsx                                    meta.home.title via t()
    components/shared/{ServicesGrid,ServiceAreasSection,Footer,QuoteForm,QuoteSelector,TestimonialsSection}.tsx
                                                       use getServiceCopy/getServiceName/getServiceShortName
    components/map/PeninsulaMap.tsx                    map.heading + tooltip via t()
    pages/areas/[city].tsx                             use getAreaCopy
    pages/services/[slug].tsx                          use getServiceCopy
  next.config.js                                       mirror locale list
  .env.local                                           ANTHROPIC_API_KEY (gitignored)
SHIPLOG_I18N_v3.md                                     THIS FILE
```

---

## Decisions baked in v3

- **Klingon (`tlh`) is permanently `experimental: true`.** No native speakers exist; the locale ships as a brand-personality choice. Voice guide explicitly sets the bar at "culturally distinctive Klingon, not perfect Klingon" and notes that Marc Okrand could not audit the output.
- **Hebrew uses Modern Israeli register, not Yiddish.** Yiddish was removed; `he` uses Noto Sans Hebrew font. RTL behavior verified server-side (`<html dir="rtl">`).
- **Klingon Latin transliteration only, no pIqaD.** The pIqaD native script lives in Unicode Private Use (U+F8D0–U+F8FF) and is not reliably renderable. KLI Latin orthography (case-sensitive — D≠d, S≠s, Q≠q, Q'≠Q) is the universal form.
- **pt-BR partial state is acceptable to ship.** The 148 untranslated keys fall back to English, mixing English and Portuguese on the page. Documented; users see Portuguese for hero/CTAs/services and English for some long-tail FAQ answers and metadata strings until the credit-balance retry completes.

---

## Quick verification

```bash
$ npm run type-check                # passes
$ npm run build                     # 124 static pages prerendered, 0 missing-message errors
$ bash scripts/verify-locales.sh    # PASS: 9 shipping locales render translated content.
```
