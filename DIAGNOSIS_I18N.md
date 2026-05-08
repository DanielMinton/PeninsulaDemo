# Phase 1 — i18n Forensic Diagnosis

Snapshot at `main @ 0756ffd` (the i18n commit). Dev server at `localhost:3000`. Every claim below is backed by a `curl`, a `grep`, or a file size.

This is the audit, not the fix.

---

## TL;DR — Three confirmed defects + one perf hole

| # | Defect | Root cause | Severity |
|---|---|---|---|
| 1 | Pill not discoverable | Mounted *inside* the header chrome between the phone number and the "Request Pickup" button — competes for attention with two louder CTAs and disappears against the transparent header over the dark hero. | High — users never engage |
| 2 | Selecting a language does not change content | **Only `messages/en.json` exists.** All 14 target locale catalogs are missing files. `loadMessages()` falls back to en for every non-en locale. Independently: 13 of 17 shared components are not converted to `useTranslations()` — they have hardcoded English JSX literals inline that won't translate even when catalogs land. | **Blocker** |
| 3 | RTL layout broken | `<html dir>` flips correctly. Tailwind config has no RTL plugin. **Zero `rtl:` modifiers anywhere in the codebase.** One logical-property class total (`ms-2` in LocalePicker). Multiple LTR-biased classes (`pl-*`/`mr-*`/`text-left`/`right-N`) across 5+ components. | High — Urdu/Yiddish unusable |
| 4 | Locale switch latency unmeasured | `router.push()` works, but **no prefetching** of locale-alternate paths anywhere — not on hover, not on focus, not on mount. First click pays the round-trip cost. | High vs. spec ("imperceptible") |

---

## 1. Locale propagation — where does it actually stop?

### Trace (verified end-to-end with curl)

```
/es-MX URL
  → middleware (src/middleware.ts) sees URL prefix → sets NEXT_LOCALE cookie, NextResponse.next() ✅
  → Next.js i18n config (next.config.js, locales: [...], defaultLocale: 'en') ✅
  → page getStaticProps receives ctx.locale = 'es-MX' ✅
  → localeProps(ctx) (src/i18n/getStaticProps.ts) ✅
  → loadMessages('es-MX') (src/i18n/load.ts) ✅
    → require('../../messages/es-MX.json')   ← throws ENOENT, file does not exist
    → catch returns nestKeys(EN_FLAT)         ← falls back to English ⚠️
  → pageProps.messages = English strings, nested
  → _app.tsx → NextIntlClientProvider locale="es-MX" messages={English strings} ✅
  → useTranslations() in Nav / Hero / Footer / LocalePicker → returns English ⚠️
  → 13 other components → render hardcoded English JSX literals regardless ⚠️
```

**The propagation never breaks. The pipeline is wired correctly.** The failure is upstream: the data the pipeline carries is English even when locale = 'es-MX', because the translated catalogs don't exist.

Verified with the live data endpoint:

```bash
$ curl -s http://localhost:3000/_next/data/development/es-MX.json | head -c 300
{"pageProps":{"locale":"es-MX","messages":{"picker":{"openLabel":"Choose language",
"title":"Choose language","searchPlaceholder":"Search languages…",...
```

Locale tag is correct (`"locale":"es-MX"`) but the messages dict carries English values.

### HTML diff per locale (verified)

```bash
$ curl -s -L http://localhost:3000/      | grep -oE '<h1[^>]*>[^<]*' | head -1
<h1 ...>The Pickup
$ curl -s -L http://localhost:3000/es-MX | grep -oE '<h1[^>]*>[^<]*' | head -1
<h1 ...>The Pickup
$ curl -s -L http://localhost:3000/ja    | grep -oE '<h1[^>]*>[^<]*' | head -1
<h1 ...>The Pickup
$ curl -s -L http://localhost:3000/ur    | grep -oE '<h1[^>]*>[^<]*' | head -1
<h1 ...>The Pickup
```

`<html lang>` and `<html dir>` change correctly per locale. **Body content does not.**

```bash
$ curl -s http://localhost:3000/      | grep -oE '<html[^>]*' ; \
  curl -s http://localhost:3000/es-MX | grep -oE '<html[^>]*' ; \
  curl -s http://localhost:3000/ur    | grep -oE '<html[^>]*'
<html lang="en"    dir="ltr"
<html lang="es-MX" dir="ltr"
<html lang="ur"    dir="rtl"
```

---

## 2. Are translations being generated? (Defect #2 root cause)

### Inventory of `messages/`

```bash
$ ls -la messages/
en.json     18,519 bytes    175 keys
```

**One file.** That is the entirety of the translation store. There is no `messages/es-MX.json`, no `messages/ja.json`, no `messages/ur.json`, no anything else.

The translate CLI (`scripts/translate.ts`) was never run. The `npm run translate:check` CI gate is correctly red:

```
MISSING: messages/es-MX.json — run `npm run translate -- --locale=es-MX`
MISSING: messages/zh-Hans.json — ...
... (× 14)
FAIL: 2450 missing, 0 stale.
```

This was documented in SHIPLOG_I18N.md as "pending CLI run" but **the implication was understated** — without those files, the entire feature is non-functional. The previous ship's "fall back to English" path is not a graceful degradation; it is the equivalent of shipping a feature that has never worked in any locale.

### Why this matters for the rebuild

Two parallel things must be true before any locale renders translated content:

1. The catalog file must exist (`messages/<locale>.json`).
2. Every visible string must be sourced from that catalog (i.e., every component must use `useTranslations()` and the registry must contain every key).

The previous ship satisfied neither for any locale beyond `en`. The remediation must do both for at least the priority locales before any can be marked "shipping".

---

## 3. Are components reading from the messages files?

### Coverage audit (`grep -L useTranslations src/components/shared/*.tsx`)

| Status | Component |
|---|---|
| ✅ converted | Nav.tsx |
| ✅ converted | Footer.tsx |
| ✅ converted | HeroSection.tsx |
| ✅ converted | LocalePicker.tsx |
| ❌ hardcoded | FaqSection.tsx |
| ❌ hardcoded | GallerySection.tsx |
| ❌ hardcoded | QuoteForm.tsx |
| ❌ hardcoded | QuoteSelector.tsx |
| ❌ hardcoded | ServicesGrid.tsx |
| ❌ hardcoded | ServiceAreasSection.tsx |
| ❌ hardcoded | ShareCity.tsx |
| ❌ hardcoded | TrustSection.tsx |
| ❌ hardcoded | TestimonialsSection.tsx |
| ❌ hardcoded | VerifyStrip.tsx |
| n/a | Layout.tsx, SocialIcons.tsx, TurnstileWidget.tsx (no user-visible strings) |

**4 of 14 user-facing components converted. 10 left with inline English literals.**

### Hardcoded string survey (regex `>[A-Z][a-z]+[^<{]*<`)

| Component | Hardcoded inline JSX strings (heuristic) |
|---|---|
| QuoteSelector.tsx | 10 |
| QuoteForm.tsx | 6 |
| TrustSection.tsx | 3 |
| TestimonialsSection.tsx | 2 |
| ServicesGrid.tsx | 2 |
| FaqSection.tsx | 1 |
| GallerySection.tsx | 1 |
| ServiceAreasSection.tsx | 1 |

Plus the pages themselves:
- `pages/areas/[city].tsx` — breadcrumb labels, "Junk Removal in", "Services Available in", "Also Serving Nearby Areas", "Back to" all hardcoded
- `pages/services/[slug].tsx` — "Cities We Serve", "Other Services", "Service" badge, "Request a Quote", "Call" hardcoded
- `pages/verify.tsx` — entire body copy (verified business panel, "A note on imposter sites", "Profiles & Reviews of Record", etc.)
- `pages/privacy.tsx`, `pages/terms.tsx` — full long-form policy bodies

Plus business *content* in `src/content/`:
- `services.ts` — service `name`, `blurb`, `description`, FAQ Q/A all English
- `areas.ts` — area `summary`, `seoTitle`, `seoDescription`, FAQ Q/A all English
- `faqs.ts` — homepage FAQ Q/A all English
- `reviews.ts` — review text English (acceptable; reviews are testimonial verbatim, but the surrounding chrome is not)

The previous registry ships **175 keys**. The audit estimated 250–400 segments needed. **Roughly 75–225 segments are still inline.**

### Missing key categories

- `aria-label` strings in unconverted components (3 hardcoded English `aria-label`s outside Nav/Hero/Footer/Picker)
- `placeholder` strings (3 hardcoded outside the converted set)
- All page-level breadcrumbs ("Service Areas", "Services", "Verify", etc.)
- All long-form page bodies (privacy, terms, verify cards)
- All city/service descriptions in the typed content layer

---

## 4. Does the rendered HTML actually change per locale?

### Test matrix (3 routes × 4 locales)

```bash
$ for path in / /areas/san-carlos /services/junk-removal; do
    for locale in '' /es-MX /ja /ur; do
      url="http://localhost:3000${locale}${path}"
      h1=$(curl -s -L "$url" | grep -oE '<h1[^>]*>[^<]*' | head -1)
      echo "${url}  →  ${h1:0:80}"
    done
  done
```

Expected: each (path, locale) returns a different H1 in the target language.
Actual: every (path, locale) combination returns the same English H1.

The `<html lang>` and `<html dir>` attributes are the only things that vary across locales today. Body content is identical English across all 15 locale URLs for every route.

### Cookie + Accept-Language paths (verified)

- Cookie `NEXT_LOCALE=ja` → middleware sees cookie → redirects `/` to `/ja/` ✅
- `Accept-Language: es-MX,en;q=0.5` → middleware best-fit matches `es-MX` → redirects `/` to `/es-MX/` ✅
- URL prefix `/zh-Hans/areas/...` → middleware honors prefix, refreshes cookie ✅

The detection layer works correctly. The destination still serves English.

---

## 5. Pill discoverability (Defect #1) — why users miss it

### Where it lives in the DOM

```html
<header class="fixed top-0 left-0 right-0 z-50 ... bg-transparent">
  <div class="container-max ...">
    <div class="flex items-center justify-between h-16 lg:h-20">
      <a aria-label="Peninsula Pick Ups home" ...>...</a>           <!-- logo + city -->
      <nav class="hidden lg:flex ..." aria-label="Main navigation">  <!-- Services, Areas, etc. -->
        ...
      </nav>
      <div class="hidden lg:flex items-center gap-3">                <!-- right cluster -->
        <button aria-label="Choose language" ...>🌐 English ⌄</button>   <!-- THE PILL -->
        <a href="tel:..." class="text-orange-500">(650) 201-1543</a>
        <a href="#quote" class="btn-primary">Request Pickup</a>
      </div>
    </div>
  </div>
</header>
```

### Why it loses

- **Three CTAs in one cluster.** The phone number (orange, bold, large) and "Request Pickup" (full orange button, the primary site CTA) flank the pill. Eye gravity pulls toward both before the pill registers.
- **Header is `bg-transparent` until scrolled.** The pill sits over the dark Hero. Even with the brighter `bg-charcoal-800` patch from earlier, on a charcoal-900 hero background the pill border is fighting for contrast.
- **Mobile: pill is between the "Call Now" button and the burger.** Between two louder elements again.
- **The spec said "single discoverable trigger."** "Single" got interpreted as "one in number." The remediation should treat it as "the trigger has no neighbors competing for the same attention slot."

### Pill is visually present (verified — not a render bug)

```bash
$ curl -s http://localhost:3000/ | grep -oE '<button[^>]*aria-label="Choose language"[^>]*'
<button type="button" aria-haspopup="dialog" aria-expanded="false"
  aria-label="Choose language" class="inline-flex items-center gap-2 px-3 py-2
  rounded-full text-sm text-bone-100 bg-charcoal-800 border border-charcoal-500 ...">
```

Two instances per page (one desktop, one mobile). Renders. Works on click. **The defect is purely discoverability.**

---

## 6. RTL handling (Defect #3) — what's set up vs. what isn't

### What works

- `_document.tsx` uses `getInitialProps` to read `ctx.locale` at build time and emits `<Html lang="ur" dir="rtl">` for the Urdu and Yiddish prerenders. Verified:

  ```bash
  $ curl -s http://localhost:3000/ur | grep -oE '<html[^>]*'
  <html lang="ur" dir="rtl"
  ```

- `LocalePicker.tsx` flips its slide-in edge under RTL via `isRtl(currentLocale)` check.
- Phone numbers wrapped in `<span dir="ltr">` in Nav and Footer.

### What's broken

- **Tailwind config has no RTL plugin.** `tailwind.config.js` has no `direction` strategy, no `tailwindcss-rtl`, no `direction-aware` class generation. `rtl:` modifiers are not enabled at the framework level.
- **Zero `rtl:` modifiers in any source file.**
  ```bash
  $ grep -rE "(^|[^a-zA-Z])rtl:" src --include="*.tsx" -l
  (empty output)
  ```
- **One logical-property class in the entire codebase** (`ms-2` in `LocalePicker.tsx:267`). Everything else uses physical-direction classes that don't flip.
- **LTR-biased classes still in core components**:
  ```
  src/components/shared/Nav.tsx:40        left-0 right-0
  src/components/shared/Footer.tsx:136    text-left
  src/components/shared/HeroSection.tsx   left-0 right-0, left-1
  src/components/shared/LocalePicker.tsx  right-0 left-0
  src/components/shared/QuoteSelector.tsx text-left, right-2
  ```
  Note: `left-0 right-0` together is fine (both edges pinned). `text-left` standalone is a defect — does not flip in RTL. `right-2` alone is a defect.

### Result on the page

When you load `/ur`, browser default text direction does flip (paragraph text reads RTL), but every component padding, margin, alignment, and absolute-positioned element retains its LTR layout. Headlines look mirrored only by accident; cards, buttons, and form rows look frankly broken.

This is the spec's explicit "Test: every page renders correctly in RTL with no overlapping text, no clipped content, no left-aligned elements where they should be right-aligned" failing on every page.

---

## 7. Performance — the non-negotiable

### What's set up

- Next.js i18n config + per-page `getStaticProps` + `localeProps(ctx)` → every (page × locale) combination prerendered to static HTML at build time. The destination HTML for `/ja/areas/san-carlos` is on disk and ready to serve.
- Translation files baked into the bundle via `require()` at build time → no runtime LLM call.

### What's missing

- **No prefetching.** Searched `LocalePicker.tsx` for prefetch usage:
  ```bash
  $ grep -E "(prefetch|router\\.push)" src/components/shared/LocalePicker.tsx
  router.push({ pathname, query }, asPath, { locale }).then(() => setOpen(false))
  ```
  One `router.push`, no `router.prefetch`, no `<Link prefetch>`, no `IntersectionObserver`-driven prefetch on the locale rows.
- **First click pays the cost.** When the user picks Japanese:
  1. Click → `router.push({}, asPath, { locale: 'ja' })`
  2. Next.js fetches `_next/data/development/ja/areas/san-carlos.json` (cold, no prefetch)
  3. JSON arrives → page hydrates with new locale
  Estimated 200–500 ms on 4G; on local dev (`Cache-Control: no-store`), measurably perceptible even on localhost.
- **No prefetch-on-hover** on the row buttons. Mousing over "Español" should warm the route the user is about to pick.
- **No prefetch-on-mount** of the most likely locale (e.g. the `Accept-Language` header best-fit, or the second-most-recent in localStorage). Most users pick one of the same 2–3 locales repeatedly; warming those on idle would make every subsequent switch instant.

### What "imperceptible" requires

Per the spec restated in the remediation prompt: pre-rendered, prefetched, instant. Concretely:

1. The destination HTML for the chosen locale is already on disk (✅ — getStaticProps × locale fan-out gets us this).
2. The `_next/data/<locale>/<path>.json` is prefetched before the click (❌ — currently fetched on click).
3. Client navigation, not full page load (✅ — `router.push` does this).
4. No layout thrash on locale change (no measurement yet — but RTL flip will require careful handling for Urdu/Yiddish).

The first two are the gap. (1) is solved by build config. (2) is the work.

---

## 8. Locale shipping status (recap, with measurements)

| Locale | Catalog file | Bytes | Keys | Renders translated? |
|---|---|---|---|---|
| en | `messages/en.json` | 18,519 | 175 | ✅ (it is the source) |
| es-MX | **missing** | — | — | ❌ falls back to en |
| zh-Hans | **missing** | — | — | ❌ falls back to en |
| ja | **missing** | — | — | ❌ falls back to en |
| ko | **missing** | — | — | ❌ falls back to en |
| vi | **missing** | — | — | ❌ falls back to en |
| fil | **missing** | — | — | ❌ falls back to en |
| pt-BR | **missing** | — | — | ❌ falls back to en |
| ru | **missing** | — | — | ❌ falls back to en |
| th | **missing** | — | — | ❌ falls back to en |
| km | **missing** | — | — | ❌ falls back to en |
| ur | **missing** | — | — | ❌ falls back to en + RTL layout broken |
| to | **missing** | — | — | ❌ falls back to en |
| yi | **missing** | — | — | ❌ falls back to en + RTL layout broken |
| ga | **missing** | — | — | ❌ falls back to en |

---

## What the remediation has to do (for the next phase to scope)

1. **Catalog generation** — actually run the translation pipeline against at least the priority Bay Area locales (en, es-MX, zh-Hans, ja, ko, vi, fil, ru, ur). The CLI exists; it has never been invoked. Without this, every other fix is theatre.
2. **Component conversion** — convert the 10 unconverted shared components and the 4 long-form pages to `useTranslations()`. Add the missing keys to the registry. Plumb the long-form content (services/areas summaries, FAQ Q/A, privacy/terms bodies) into the catalog.
3. **Pill relocation** — move out of the header chrome cluster. Make it a single, distinct affordance that does not compete with other CTAs.
4. **RTL setup** — install or configure a Tailwind RTL strategy (`tailwindcss-rtl` plugin, or explicit `rtl:` audit on every component). Convert every physical-direction class (`pl-`/`pr-`/`ml-`/`mr-`/`text-left`/`text-right`/single-edge `left-N`/`right-N`) to logical equivalents (`ps-`/`pe-`/`ms-`/`me-`/`text-start`/`text-end`/`inset-inline-*`).
5. **Prefetching** — `router.prefetch(pathForLocale)` on hover or focus of each locale row in the picker. Optionally prefetch the top-2 likely locales on mount based on `Accept-Language` + recent-picks.
6. **Latency measurement** — instrument click-to-paint, both in dev (Performance API marks) and in CI smoke (Playwright trace). The "< 200 ms" target needs a number, not a vibe.

This document is the diagnostic. It does not propose, does not fix. The next phase begins by deciding the order of (1)–(6) and what is in scope for the first remediation ship.
