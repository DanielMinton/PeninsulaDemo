# MAP_AUDIT.md — Service Area Map (Phase 1)

Audit of the existing "Where Peninsula Pick Ups Works" map component, in preparation for the geographic-realism rebuild. **Findings only — no code changed.**

---

## 1. Component location & shape

**Primary file:** `frontend/src/components/map/PeninsulaMap.tsx` (225 lines, 9.3 KB source)

**Imports / dependencies:**

| Dependency        | Version    | Role                                                  |
| ----------------- | ---------- | ----------------------------------------------------- |
| `framer-motion`   | 11.1.7     | Marker stagger-in animation + `useReducedMotion()`    |
| `next-intl`       | (project)  | i18n strings for badge, heading, sub, tooltip copy    |
| `next/link`       | —          | City links (sidebar list + each marker)               |
| `@/content/areas` | local      | `AREAS` typed array — single source of marker truth   |
| `@/content/map-outline` | local | `LAND_PATH`, `SPINE_PATH`, `MAP_VIEWBOX` (1000×1100)  |
| `@/content/site`  | local      | Imported but appears unused in the rendered output    |

**Render method:** inline SVG (`<svg>` with two `<path>` elements, gradients, compass/region labels) wrapped in a `relative aspect-[10/11]` container, with HTML markers absolutely positioned over the SVG using `left: %`, `top: %` derived from each area's pre-computed `coords.x / coords.y`. **No canvas, no tile library, no map library.**

**Render path:** the homepage (`src/pages/index.tsx:17`) imports it via `next/dynamic` with `ssr: true`. It is the **second section after `<HeroSection />`** (line 46). So it ships in the SSR HTML and on mobile the SVG sits in the first viewport (`lg:order-2 order-1`); on desktop it sits in the right half of the second viewport.

---

## 2. City data — confirmed sourced from typed content layer

`src/content/areas.ts` exports `AREAS: readonly Area[]` — 10 cities, each with `geo: {lat, lng}` and pre-projected `coords: {x, y}` inside the 1000×1100 viewBox. The projection is documented at the top of the file:

```
x = 100 + (lng + 122.50) * 2125
y =  50 + (37.70 - lat)  * 3373
```

Cities: San Carlos (homeBase), San Mateo, Redwood City, Belmont, Burlingame, Palo Alto, Menlo Park, South San Francisco, Daly City, Millbrae.

The map component **never hardcodes city names or pin positions** — it iterates `AREAS` and reads `coords` and `services.length`. This is good and must be preserved through the rebuild. The new coordinate-transform helper should consume `geo: {lat, lng}` directly so the projection lives in one place.

`ALL_CITIES` and `HOME_BASE` are also exported from the same file; `getAreaBySlug()` is the lookup helper.

---

## 3. Animation & accessibility — what wraps the new base

> ⚠️ **Brief discrepancy:** the brief says "the existing GSAP animations." There is no GSAP in this project (`gsap` is not in `package.json`, and there are no GSAP imports anywhere in `src/`). The actual animation library is **Framer Motion 11.1.7**. Calling this out so the proposal doesn't carry the wrong assumption forward.

### Animation behavior to preserve

- **Marker stagger-in.** Each pin animates `{opacity: 0, scale: 0} → {opacity: 1, scale: 1}` with `delay: 0.05 * i`, `duration: 0.45`, ease `[0.22, 1, 0.36, 1]`. Order is north-to-south via `useMemo(() => [...AREAS].sort((a, b) => a.coords.y - b.coords.y), [])` (line 53).
- **Home-base pulse.** San Carlos pin uses Tailwind's `animate-pulse-glow` keyframe (`tailwind.config.js:69, 84-87`) — `box-shadow` pulse at 2s. Other pins are static dots inside an `orange-400/30` ring.
- **Hover/focus marker scale.** `scale-110` when active, `hover:scale-105` otherwise — pure CSS transform.
- **`useReducedMotion()` guard** (line 49): when `prefers-reduced-motion: reduce`, the stagger is suppressed (`initial={false}` and `delay/duration: 0`). The Tailwind `animate-pulse-glow` is **not** disabled by this hook — it currently keeps pulsing for reduced-motion users. Worth fixing during the rebuild.

### Accessibility behavior to preserve

- `<section aria-labelledby="map-heading">` and an inner `<div role="region" aria-label="Peninsula service area map">` around the SVG.
- The SVG is `aria-hidden="true"` and `focusable="false"` — decorative.
- Every marker is a `<Link>` with `aria-label="${city}, CA — ${count} services. Open city page."` and an `sr-only` city-name span (defense in depth).
- Tab order: the sidebar text-link list comes first in DOM, then the markers — both lists are sorted north-to-south.
- Hover **and** focus both open the marker card (`onMouseEnter / onFocus`). Both handlers fire from both the sidebar links and the map pins, so focusing a sidebar link previews the corresponding pin's card. Closing happens on blur/leave or on the Escape key (effect at line 55–61).
- The hover preview `MarkerCard` has `role="dialog"` and `aria-label={t('map.tooltipPreview', {city})}`, but is `pointer-events-none` (purely visual; the link target is the marker itself).

---

## 4. DOM-node count — measured estimate

Counting the rendered tree at idle (no marker active):

| Block                             | Nodes |
| --------------------------------- | ----- |
| Section frame + grid wrappers     | ~5    |
| Left column (badge, h2, p, button)| ~5    |
| Sidebar city list (10 × link+dot) | ~30   |
| SVG static (defs, gradients, paths, compass labels) | ~21 |
| Marker layer wrapper              | 1     |
| 10 markers × (motion.div + Link + dot span + ring span + sr-only span) | 50 |
| **Total at idle**                 | **~112** |
| When one marker is active, +`MarkerCard` (~8 nodes) | **~120** |

This is light. The new design can spend a few dozen extra nodes on real geography without paying a meaningful DOM-size cost.

---

## 5. LCP impact

The map renders SSR (`ssr: true` on the dynamic import) and sits in the second section, so it's part of the initial HTML. There is **no image fetch** — everything is inline SVG and CSS. The current LCP candidate on the homepage is almost certainly the Hero section's text/CTA, not the map.

**No production Lighthouse run was performed for this audit** — the dev server was not started. Before the rebuild ships, we should re-measure to confirm the new raster basemap doesn't displace the Hero as LCP. The `aspect-[10/11]` container reserves vertical space, so CLS should remain ~0 if the new basemap inherits the same container.

---

## 6. `sharp` availability (for build-time image processing)

✅ **`sharp` is installed** at `frontend/node_modules/sharp` — pulled in transitively by Next.js 16 / `next/image`. It is **not** declared in `frontend/package.json` `dependencies`. For the build-time basemap generator we should add it as an explicit `devDependency` so the dependency is durable and not at the mercy of Next's transitive graph.

---

## 7. Open questions surfaced by the audit (flag for Phase 2)

These don't block Phase 1, but they're decisions the proposal will need to make:

1. **GSAP vs. Framer Motion.** The brief assumes GSAP. Confirm we're keeping Framer Motion (already in the bundle, already powering the stagger and `useReducedMotion`) rather than adding a second animation lib for the new "interactive flourish."
2. **Reduced-motion + `animate-pulse-glow`.** The home-base pulse currently ignores `prefers-reduced-motion`. Should the rebuild gate it on `useReducedMotion()` alongside the stagger?
3. **Mobile viewport order.** On `<lg`, the map is `order-1` and the text-link list is `order-2`. With a real raster basemap on mobile we'll want to confirm this still reads well — and whether "lower-resolution basemap" for mobile means a separate raster asset or the same asset at a smaller intrinsic size.
4. **Coord projection.** `areas.ts` already encodes a linear lat/lng→SVG projection. The new transform helper should derive its bounding box from the same lat/lng anchors used to generate the basemap raster, so markers land exactly on the right streets.
5. **`SITE` import.** `PeninsulaMap.tsx:8` imports `SITE` but never uses it. Drop on rebuild.

---

## Summary

| Question                                | Answer                                             |
| --------------------------------------- | -------------------------------------------------- |
| Where is the map?                       | `frontend/src/components/map/PeninsulaMap.tsx`     |
| How does it render?                     | Inline SVG + absolutely-positioned HTML markers    |
| What library?                           | Framer Motion (not GSAP — flag in brief)           |
| City source?                            | `src/content/areas.ts` typed `AREAS` array — clean |
| DOM nodes at idle?                      | ~112 (manageable; rebuild has headroom)            |
| LCP impact today?                       | Low — inline SVG, no image fetch, SSR'd            |
| `sharp` available for build-time?       | Yes (transitively); should be promoted to devDep   |
| What carries forward?                   | `AREAS` data, a11y wiring, reduced-motion gate, north→south stagger, pulse for home base |
| What gets replaced?                     | The stylized `LAND_PATH` / `SPINE_PATH` SVG; replaced by a real raster basemap + brand SVG overlay |

**Status:** Phase 1 complete. Awaiting approval before writing `MAP_PROPOSAL.md`.
