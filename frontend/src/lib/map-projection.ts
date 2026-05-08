/**
 * Web-Mercator projection for the Peninsula service-area map.
 *
 * Single source of truth for the bbox + viewBox shared between the build-time
 * basemap raster (scripts/build-basemap.ts) and the SVG overlay rendered by
 * components/map/PeninsulaMap.tsx. If you change BBOX or VIEWBOX here, also
 * update the build script and re-run `npm run build:basemap -- --force`.
 */

export const MAP_BBOX = {
  swLat: 37.395,
  swLng: -122.56,
  neLat: 37.725,
  neLng: -122.105,
} as const

export const MAP_VIEWBOX = { width: 1000, height: 1100 } as const

const DEG2RAD = Math.PI / 180

function mercatorY(latDeg: number): number {
  const r = latDeg * DEG2RAD
  return Math.log(Math.tan(r) + 1 / Math.cos(r))
}

const yMinMerc = mercatorY(MAP_BBOX.swLat)
const yMaxMerc = mercatorY(MAP_BBOX.neLat)
const xRangeDeg = MAP_BBOX.neLng - MAP_BBOX.swLng
const yRangeMerc = yMaxMerc - yMinMerc

export interface Point {
  x: number
  y: number
}

export function latLngToSvg(lat: number, lng: number): Point {
  const x = ((lng - MAP_BBOX.swLng) / xRangeDeg) * MAP_VIEWBOX.width
  const y = ((yMaxMerc - mercatorY(lat)) / yRangeMerc) * MAP_VIEWBOX.height
  return { x, y }
}

/** Andrew's monotone-chain convex hull. Returns vertices in CCW order. */
export function convexHull(points: Point[]): Point[] {
  if (points.length < 3) return [...points]
  const pts = [...points].sort((a, b) => a.x - b.x || a.y - b.y)
  const cross = (o: Point, a: Point, b: Point) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)

  const lower: Point[] = []
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop()
    lower.push(p)
  }
  const upper: Point[] = []
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i]
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop()
    upper.push(p)
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)]
}

/** Scale a polygon outward from its centroid — gives the hull breathing room. */
export function inflatePolygon(poly: Point[], factor: number): Point[] {
  const cx = poly.reduce((s, p) => s + p.x, 0) / poly.length
  const cy = poly.reduce((s, p) => s + p.y, 0) / poly.length
  return poly.map((p) => ({
    x: cx + (p.x - cx) * factor,
    y: cy + (p.y - cy) * factor,
  }))
}

export function polygonToPath(poly: Point[]): string {
  if (poly.length === 0) return ''
  return 'M ' + poly.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ') + ' Z'
}

/**
 * Quadratic-bezier route from `from` to `to`, with the control point offset
 * perpendicular to the chord so straight A→B segments still get a gentle arc.
 */
export function routePath(from: Point, to: Point): string {
  const mx = (from.x + to.x) / 2
  const my = (from.y + to.y) / 2
  const dx = to.x - from.x
  const dy = to.y - from.y
  const len = Math.hypot(dx, dy) || 1
  const offset = Math.min(45, len * 0.18)
  const nx = -dy / len
  const ny = dx / len
  const cx = mx + nx * offset
  const cy = my + ny * offset
  return `M ${from.x.toFixed(1)} ${from.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${to.x.toFixed(1)} ${to.y.toFixed(1)}`
}
