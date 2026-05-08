#!/usr/bin/env tsx
/**
 * Build-time basemap generator for the Peninsula service-area map.
 *
 * Default source: CARTO dark-matter (no API key required, CC BY 3.0 + OSM
 * contributors — attribution surfaced in the site footer). Set STADIA_API_KEY
 * to switch to Stadia's Stamen Terrain (adds hillshade) instead.
 *
 * Output: WebP + AVIF rasters in public/maps/, committed to the repo. This
 * script is run by hand, not on every `next build`.
 *
 * Usage:
 *   npm run build:basemap          # skip if outputs already exist
 *   npm run build:basemap -- --force   # re-fetch and overwrite
 *
 * If you change BBOX or ZOOM here, also update src/lib/map-projection.ts.
 */

import 'dotenv/config'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

// ─── Configuration (must stay in sync with src/lib/map-projection.ts) ─────────

export const BBOX = {
  swLat: 37.395,
  swLng: -122.56,
  neLat: 37.725,
  neLng: -122.105,
} as const

const ZOOM = 12
const TILE_SIZE = 256
const OUTPUT_W = 1024
const OUTPUT_H = 1126
const TILE_CONCURRENCY = 4

interface TileSource {
  name: string
  // Build a tile URL. `sub` rotates 0..n-1 across requests for load spreading.
  url: (style: string, z: number, x: number, y: number, sub: number) => string
  // Layers to fetch and composite (bottom → top).
  styles: readonly string[]
  // Number of subdomains to rotate across (1 disables rotation).
  subs: number
}

// We fetch CARTO's light basemap; the component renders it at low opacity
// over the charcoal background so it reads as a faint atlas etching of the
// Peninsula. No invert — just gentle desaturation to mute water/roads.
const SOURCE_CARTO: TileSource = {
  name: 'CARTO light (low-opacity atlas overlay)',
  styles: ['light_nolabels'],
  subs: 4,
  url: (style, z, x, y, sub) =>
    `https://${'abcd'[sub]}.basemaps.cartocdn.com/${style}/${z}/${x}/${y}@2x.png`,
}

const SOURCE_STADIA = (key: string): TileSource => ({
  name: 'Stadia Stamen Terrain',
  styles: ['stamen_terrain_background', 'stamen_terrain_lines'],
  subs: 1,
  url: (style, z, x, y) => `https://tiles.stadiamaps.com/tiles/${style}/${z}/${x}/${y}.png?api_key=${key}`,
})

const ROOT = path.resolve(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'public', 'maps')
const OUT_WEBP = path.join(OUT_DIR, 'peninsula-basemap.webp')
const OUT_AVIF = path.join(OUT_DIR, 'peninsula-basemap.avif')
const OUT_LQIP = path.join(OUT_DIR, 'peninsula-basemap.lqip.txt')

// ─── Web Mercator helpers ─────────────────────────────────────────────────────

function lngToTileX(lng: number, z: number): number {
  return ((lng + 180) / 360) * 2 ** z
}

function latToTileY(lat: number, z: number): number {
  const r = (lat * Math.PI) / 180
  return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z
}

// ─── Tile fetch with bounded concurrency + simple retry ───────────────────────

let subCursor = 0

async function fetchTile(source: TileSource, style: string, z: number, x: number, y: number): Promise<Buffer> {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const sub = subCursor++ % source.subs
    const url = source.url(style, z, x, y, sub)
    const r = await fetch(url, { headers: { 'User-Agent': 'peninsula-pickup-basemap/1.0 (one-shot build)' } })
    if (r.ok) return Buffer.from(await r.arrayBuffer())
    if (r.status >= 500 || r.status === 429) {
      await new Promise((res) => setTimeout(res, 400 * attempt))
      continue
    }
    throw new Error(`tile ${style}/${z}/${x}/${y} → HTTP ${r.status} ${r.statusText}`)
  }
  throw new Error(`tile ${style}/${z}/${x}/${y} → exhausted retries`)
}

async function fetchAll<T, R>(items: T[], limit: number, fn: (it: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length)
  let next = 0
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const i = next++
      if (i >= items.length) return
      out[i] = await fn(items[i])
    }
  })
  await Promise.all(workers)
  return out
}

// ─── Stitch a tile grid into one PNG buffer ───────────────────────────────────

interface TileGrid {
  xMin: number
  yMin: number
  cols: number
  rows: number
}

async function stitchLayer(source: TileSource, style: string, grid: TileGrid): Promise<Buffer> {
  const { xMin, yMin, cols, rows } = grid
  const total = cols * rows
  process.stdout.write(`  ${style}: fetching ${total} tile${total === 1 ? '' : 's'}…`)

  const coords: Array<{ x: number; y: number }> = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      coords.push({ x: xMin + col, y: yMin + row })
    }
  }
  const tiles = await fetchAll(coords, TILE_CONCURRENCY, ({ x, y }) => fetchTile(source, style, ZOOM, x, y))
  process.stdout.write(' done\n')

  // Some sources (CARTO @2x) ship 512px tiles; detect from the first response.
  const meta = await sharp(tiles[0]).metadata()
  const tilePx = meta.width ?? TILE_SIZE

  const composites = tiles.map((buffer, i) => ({
    input: buffer,
    left: (i % cols) * tilePx,
    top: Math.floor(i / cols) * tilePx,
  }))

  return sharp({
    create: {
      width: cols * tilePx,
      height: rows * tilePx,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composites)
    .png()
    .toBuffer()
}

// ─── Crop to bbox + brand-pass + export ───────────────────────────────────────

interface CropRect {
  left: number
  top: number
  width: number
  height: number
}

function bboxToCropRect(grid: TileGrid, tilePx: number): CropRect {
  const swX = lngToTileX(BBOX.swLng, ZOOM)
  const neX = lngToTileX(BBOX.neLng, ZOOM)
  const neY = latToTileY(BBOX.neLat, ZOOM)
  const swY = latToTileY(BBOX.swLat, ZOOM)
  return {
    left: Math.round((swX - grid.xMin) * tilePx),
    top: Math.round((neY - grid.yMin) * tilePx),
    width: Math.round((neX - swX) * tilePx),
    height: Math.round((swY - neY) * tilePx),
  }
}

interface BrandPass {
  saturation: number
  brightness: number
  /** Invert luminance — turns a light basemap into a dark atlas etching. */
  invert: boolean
  /** Charcoal multiply intensity, 0..1. 0 = skip the multiply step. */
  multiply: number
}

async function brandPass(stitched: Buffer, crop: CropRect, pass: BrandPass): Promise<Buffer> {
  const cropped = await sharp(stitched).extract(crop).resize(OUTPUT_W, OUTPUT_H, { fit: 'fill' }).png().toBuffer()

  let img = sharp(cropped)
  if (pass.invert) img = img.negate({ alpha: false })
  img = img.modulate({ saturation: pass.saturation, brightness: pass.brightness })

  if (pass.multiply > 0) {
    const alpha = Math.round(pass.multiply * 255)
    const tintLayer = await sharp({
      create: {
        width: OUTPUT_W,
        height: OUTPUT_H,
        channels: 4,
        background: { r: 28, g: 28, b: 28, alpha: alpha / 255 },
      },
    })
      .png()
      .toBuffer()
    img = img.composite([{ input: tintLayer, blend: 'multiply' }])
  }

  return img.png().toBuffer()
}

async function emitOutputs(branded: Buffer): Promise<void> {
  await fsp.mkdir(OUT_DIR, { recursive: true })

  await sharp(branded).webp({ quality: 78, effort: 5 }).toFile(OUT_WEBP)
  await sharp(branded).avif({ quality: 55, effort: 6 }).toFile(OUT_AVIF)

  // 12x14 LQIP rendered as a base64 data URL for next/image's blur placeholder.
  const lqipBuf = await sharp(branded).resize(12, 14, { fit: 'fill' }).webp({ quality: 40 }).toBuffer()
  const lqipDataUrl = `data:image/webp;base64,${lqipBuf.toString('base64')}`
  await fsp.writeFile(OUT_LQIP, lqipDataUrl + '\n')

  const webpKB = (await fsp.stat(OUT_WEBP)).size / 1024
  const avifKB = (await fsp.stat(OUT_AVIF)).size / 1024
  console.log(`  WebP: ${webpKB.toFixed(1)} KB → ${path.relative(ROOT, OUT_WEBP)}`)
  console.log(`  AVIF: ${avifKB.toFixed(1)} KB → ${path.relative(ROOT, OUT_AVIF)}`)
  console.log(`  LQIP: ${lqipDataUrl.length} chars → ${path.relative(ROOT, OUT_LQIP)}`)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const force = process.argv.includes('--force')
  const key = process.env.STADIA_API_KEY

  // Pick a source. Stadia (with key) gives hillshade; Carto (no key) gives a
  // clean dark roads/coastline basemap. Both produce a readable map.
  const source = key ? SOURCE_STADIA(key) : SOURCE_CARTO
  const pass: BrandPass = key
    ? { saturation: 0.55, brightness: 0.7, invert: false, multiply: 0.6 } // Stadia terrain → heavy darken
    : { saturation: 0.55, brightness: 1.0, invert: false, multiply: 0.0 } // Carto light → keep light, component handles opacity

  if (!force && fs.existsSync(OUT_WEBP) && fs.existsSync(OUT_AVIF)) {
    console.log('Basemap rasters already exist. Pass --force to regenerate.')
    return
  }

  const swX = lngToTileX(BBOX.swLng, ZOOM)
  const neX = lngToTileX(BBOX.neLng, ZOOM)
  const neY = latToTileY(BBOX.neLat, ZOOM)
  const swY = latToTileY(BBOX.swLat, ZOOM)

  const grid: TileGrid = {
    xMin: Math.floor(swX),
    yMin: Math.floor(neY),
    cols: Math.ceil(neX) - Math.floor(swX),
    rows: Math.ceil(swY) - Math.floor(neY),
  }

  console.log(
    `Source: ${source.name}\n` +
      `Building basemap @ z=${ZOOM}, ${grid.cols}×${grid.rows} tiles ` +
      `(${grid.cols * grid.rows} per layer × ${source.styles.length} layer${source.styles.length === 1 ? '' : 's'})`,
  )

  const layers = await Promise.all(source.styles.map((style) => stitchLayer(source, style, grid)))
  const composed = await sharp(layers[0])
    .composite(layers.slice(1).map((buf) => ({ input: buf, blend: 'over' })))
    .png()
    .toBuffer()

  // The first stitched buffer's tile size determines the per-tile pixel size
  // we used (CARTO @2x = 512, Stadia = 256). Recover it for crop math.
  const meta = await sharp(layers[0]).metadata()
  const tilePx = (meta.width ?? grid.cols * TILE_SIZE) / grid.cols

  const cropRect = bboxToCropRect(grid, tilePx)
  const branded = await brandPass(composed, cropRect, pass)
  await emitOutputs(branded)

  console.log('\nDone. Commit the new files in public/maps/.')
}

main().catch((err) => {
  console.error('\nbuild-basemap failed:', err.message ?? err)
  process.exit(1)
})
