# MAP_PROPOSAL.md — Service Area Map (Phase 2)

Architecture for the geographic-realism rebuild. One choice per section, no buffet. Numbers where numbers matter.

---

## 1. Basemap approach

**Tile source:** Stadia Maps' **"Stamen Terrain Background"** (no labels). Stadia now hosts the Stamen tile catalog under a CC BY 4.0 + OSM ODbL attribution model, free for commercial use up to 200K tiles/month. We fetch ~30 tiles **once at build time** behind an API key kept in `.env.local` (never shipped to the client). Attribution surfaces in the site footer's existing credits area.

Why this style: it gives us the Bay on the east, the Pacific coastline on the west, and visible hillshade across the Santa Cruz Mountains spine — exactly the legibility the brief asks for. Roads and hillshade are baked into the raster, so we don't need a separate hillshade overlay.

**Bounding box:** SW `(37.395, -122.560)` → NE `(37.725, -122.105)`. Pads ~3 km past Daly City (north) and Palo Alto (south) so no marker hugs the edge.

**Target resolution:** stitched at zoom 11, cropped to a 1024×1126 source raster (matches the existing 10/11 aspect). `sharp` then runs a brand pass: desaturate to ~55%, multiply with `#1c1c1c` at ~70%, light blue tint to the bay, export to WebP `q=78` and AVIF `q=55`.

**Target file size:** WebP ≤ 90 KB, AVIF ≤ 65 KB. Output to `frontend/public/maps/peninsula-basemap.{webp,avif}`.

## 2. Projection + transform helper

**Projection:** Web Mercator (EPSG:3857) — the only sane choice when overlaying SVG on an OSM-derived raster. The current `areas.ts` linear projection becomes wrong against a real basemap and gets retired.

**New helper:** `src/lib/map-projection.ts` exports `MAP_BBOX` (the exact bbox the basemap script used) and `latLngToSvg(lat, lng): {x, y}` which Mercator-projects against `MAP_BBOX` into the 1000×1100 viewBox. The stored `coords` field on each `Area` in `areas.ts` is removed; the component derives marker positions from `geo.lat / geo.lng` via the helper at module load. Single source of truth, no drift between basemap bbox and marker math.

## 3. Layering order (bottom → top)

1. **Basemap raster** — `<picture>` with AVIF + WebP via `next/image` (roads + hillshade baked in)
2. **Service-area shading** — soft orange convex hull around the 10 cities, fill `rgba(232,93,26,0.10)`, stroke `rgba(232,93,26,0.25)`
3. **Routes** — one dashed SVG path per non-home-base city, San Carlos → city, hidden by default
4. **Markers** — current HTML pattern preserved (motion.div + Link + dot + ring + sr-only)
5. **Labels** — SVG `<text>` for "SF BAY" and "PACIFIC" in brand typography, plus a small "HOME BASE" callout near San Carlos

## 4. Interactive flourish (exactly one)

**Animated dashed routes from San Carlos.** Hover/focus any pin or sidebar link → that city's route draws from the San Carlos pin via Framer Motion `pathLength: 0 → 1`, 600 ms, ease `[0.22, 1, 0.36, 1]`. Reinforces the "home base in San Carlos" narrative, layers cleanly onto the existing `active` state, and adds **zero** new dependencies.

## 5. Mobile strategy

Same WebP basemap — at 90 KB it serves both. The route flourish becomes tap-driven on touch: tap a marker → route draws → auto-clears after 4 s on next tap or 8 s timeout. Marker stagger and reduced-motion guard unchanged. We also fix the existing bug where `animate-pulse-glow` ignores `prefers-reduced-motion` and gate it on the hook.

## 6. Performance budget

| Asset                                  | Budget          | Notes                              |
| -------------------------------------- | --------------- | ---------------------------------- |
| Basemap (AVIF preferred, WebP fallback)| ≤ 90 KB on wire | Lazy-loaded via `next/image`       |
| Inline SVG overlays + labels           | ~6 KB gz        | Routes + service-area shape + text |
| `map-projection.ts` + component diff   | ~1.5 KB gz      | Pure functions, no new lib         |
| **Total new bytes**                    | **~100 KB**     | 60% under the 250 KB ceiling       |

**LCP:** basemap image uses `loading="lazy"` and a 20-byte LQIP blur placeholder; the Hero remains the LCP candidate. **CLS:** container's `aspect-[10/11]` is unchanged → 0. **TTI:** no new JS framework; Framer Motion is already in the bundle.

---

**Status:** Phase 2 complete. Awaiting approval before Phase 3 implementation.
