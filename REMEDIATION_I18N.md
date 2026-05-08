# Phase 2 — i18n Remediation Plan

Built on `DIAGNOSIS_I18N.md`. Four confirmed defects, one ordering principle, three scope tiers. Approve the tier and the open decisions, then Phase 3 implements.

---

## Ordering principle

The pipeline is plumbed correctly; the data it carries is English. So **fix the data first**, fix the structural pass second (RTL touches every component, so it has to land before re-touching components a third time), then fix discovery, then fix latency. Cosmetic fixes before the catalogs exist would just make a broken feature look better.

```
1. Pipeline data       (#2 root cause)   — runs the translation CLI, ships catalogs
2. Component coverage  (#2 final mile)   — converts the 10 unconverted components + 4 long-form pages
3. RTL pass            (#3)              — plugin + logical-property sweep, before discovery rework
4. Pill relocation     (#1)              — single standalone affordance, not header chrome
5. Prefetch + measure  (#4)              — router.prefetch on hover, Performance.mark in CI
```

Steps 1 and 2 unlock everything else. Step 3 lands before Step 4 because the picker itself needs the RTL flip rules to be plugin-driven, not bespoke. Step 5 is the easiest and most measurable; it goes last because the rest must be working before "fast" is meaningful.

---

## Scope decision (needs your call)

The previous ship signed up for 15 locales without delivering one. I'm not repeating that. Three honest tiers:

**Tier A — Spanish only (es-MX)** · *Proves the pipeline, ships value Monday*
- One locale fully translated, QA'd, native-speaker reviewed, shipping un-flagged.
- All 15 locales remain selectable in the picker; non-es-MX locales fall back to English with a "Beta" tag until each gets the same treatment.
- ~285 segments × 1 locale = ~285 Sonnet calls + optional Opus QA. Estimated cost: $1–3.
- Best for: shipping a real working language switch this week, then expanding.

**Tier B — Spanish, Chinese (Simplified), Vietnamese** *(recommended)* · *Three Bay Area priority locales*
- es-MX, zh-Hans, vi all fully translated, native-speaker review queued.
- Covers the three largest non-English language groups in San Mateo County by census.
- ~285 × 3 = ~855 Sonnet calls + Opus QA. Estimated cost: $5–12.
- Best for: visible scope that matches the demographic reality, with the rest expanding later.

**Tier C — All 14 target locales** · *Full multilingual ship including RTL*
- Every locale translated. Urdu and Yiddish get the full RTL pass and Nastaliq font subset validation.
- ~285 × 14 = ~4,000 Sonnet calls + Opus QA. Estimated cost: $25–60.
- Best for: completing the original spec in one push. Highest verification surface.

**My recommendation: Tier B**, with the framework hardened to make Tier C a one-command expansion (`npm run translate` + native-speaker review). The 4 experimental locales (Khmer, Tongan, Yiddish, Gaelic) ship with the "Beta" tag until reviewers source-verify them — that's the spec's own quality gate.

---

## Step-by-step

### Step 1 — Pipeline data (Defect #2 root cause)

- Run `npm run translate -- --locale=<each>` for the chosen tier. Real Sonnet calls against the existing RAG corpus + glossary + voice + examples.
- Run `--qa` pass with Opus. Items flagged go to `i18n/review-queue.json`. Resolve all flags before declaring the locale "shipping" (vs. "Beta").
- Authoring required before run for tier B: voice guides + 8–12 example pairs for `zh-Hans` and `vi` (currently stubs). Spanish already has a Sonnet draft; needs human review.
- **Verification**: `curl /es-MX` returns response body containing specific Spanish strings (e.g. `"Solicita una recolección"`, `"Cotización gratis"`). Automated assertion in CI smoke, not eyeballed.

### Step 2 — Component coverage (Defect #2 final mile)

- Convert the 10 unconverted shared components + 4 long-form pages to `useTranslations()`. List in DIAGNOSIS §3.
- Migrate the long-form content currently in `src/content/services.ts` / `areas.ts` / `faqs.ts` into the typed registry. Pattern: keep `src/content/` as the *typed shape* (slugs, IDs, geo, FAQs structure), move *strings* into `MESSAGES`, expose via `getServiceCopy(slug, t)` accessors.
- Net registry growth: 175 → ~285 keys. Re-run `npm run translate` after every batch (cache key skips unchanged).
- **Verification**: `grep -L useTranslations src/components/shared/*.tsx` returns only utility components (Layout, SocialIcons, TurnstileWidget, TrustSection-icons-only). `npm run translate:check` exits 0.

### Step 3 — RTL pass (Defect #3)

- **Decision**: install `tailwindcss-rtl` plugin. Manual logical-property sweep is tedious and error-prone; plugin is one-line in `tailwind.config.js` and gives `rtl:` modifiers framework-wide.
- Walk every component. Replace physical-direction classes:
  ```
  pl-* / pr-*  →  ps-* / pe-*
  ml-* / mr-*  →  ms-* / me-*
  text-left    →  text-start
  text-right   →  text-end
  left-N (single edge)  →  start-N
  right-N (single edge) →  end-N
  ```
- Phone numbers stay `<span dir="ltr">` (already done in Nav/Footer; needs adding to QuoteForm/QuoteSelector/area pages where phone appears).
- Slide-out picker already flips correctly per `isRtl(currentLocale)` — verified.
- **Verification**: visual regression test using Playwright. Capture `/ur/`, `/yi/`, `/en/` for the 4 main routes. Diff. Manual approval on first pass; thereafter `git diff` on snapshots gates the build.

### Step 4 — Pill relocation (Defect #1)

The fix is structural, not stylistic. Pull it out of the header chrome entirely.

**Proposed placement**: a fixed-position pill anchored to the **top-right corner of the viewport, OUTSIDE the header element**, on its own stacking context with `z-index: 60` (above the header's `z-50`). On mobile, same corner — small enough not to obstruct content, prominent enough to be the only "language" affordance on the page. Mirrors to top-left under RTL.

- Removed from `<Nav>` entirely. Mounted once in `<Layout>` (or `_app.tsx`) so it renders on every page.
- Visual: charcoal-800 background, orange-tinted globe, native locale name, chevron-down. Subtle pulse on first visit (one-shot, dismissed via cookie) to draw the eye.
- Clicking still opens the existing slide-out (already built, already a11y-correct).
- **Verification**: Playwright finds the pill within the top-right 200×60 viewport region on every route, every breakpoint. User-test sample of 3+ people: pill noticed within 3 seconds of page load.

Alternative placement options (call your shot if the FAB-style pill doesn't suit):
- Edge tab (vertical, right edge under LTR / left edge under RTL).
- Top utility strip above the nav (full-width 28px tall band with locale + native name).

### Step 5 — Prefetch + measurement (Defect #4 / spec)

- `router.prefetch(localizedPath(locale, asPath))` on **mouse-enter and focus** of every locale row in the picker.
- On picker mount: prefetch the top 2 candidate locales (cookie value if set, else top 2 from `Accept-Language`). Idle-time work via `requestIdleCallback`.
- Add `<Performance.mark>` boundaries around the locale switch: `pup.locale.switch.start` on click, `pup.locale.switch.paint` on next paint after route resolves. CI extracts the 95p across a 20-iteration loop.
- **Verification**: Playwright trace records click-to-paint. 95p < 200 ms on local with throttled "Fast 3G". Recorded in CI; regression beyond 200 ms fails the build.

---

## Open decisions for your call

1. **Scope tier**: A, B, or C? *(My recommendation: B.)*
2. **Pill placement**: top-right floating pill (recommended), edge tab, or top utility strip?
3. **Tailwind RTL**: plugin (`tailwindcss-rtl`) or manual sweep? *(My recommendation: plugin.)*
4. **Long-form content (privacy, terms, verify-page body)**: include in this remediation, or carve out as a separate follow-up since the body is policy text that warrants legal review per locale? *(My recommendation: carve out — translate the chrome, defer the body.)*
5. **Native-speaker review**: do you have reviewers lined up for es-MX, zh-Hans, vi, or do we ship as "Sonnet + Opus QA only" with an explicit "Beta" tag until reviewed?

---

## What ships at end of Phase 3

For Tier B (recommended):

- es-MX, zh-Hans, vi — all routes, all chrome, every visible string translated and rendered.
- Other 11 locales — selectable, fall back to English with the "Beta" tag (no regression vs. today's broken state).
- RTL framework in place; ur, yi, all other locales render with no layout breakage even on English fallback.
- Pill repositioned; user-discovered in <3 s.
- Click-to-paint < 200 ms 95p, measured, regression-gated in CI.
- `DIAGNOSIS_I18N.md` claims invalidated by passing automated checks; replaced by `SHIPLOG_I18N_v2.md` with the new measurements.

This is the proposal. Awaiting your call on the open decisions before I touch a line of code.
