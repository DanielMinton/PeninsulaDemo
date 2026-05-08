import fs from 'node:fs'
import path from 'node:path'
import { DEFAULT_LOCALE, type Locale } from './locales'
import enCatalog from '../../messages/en.json'

interface CatalogShape {
  $version?: number
  segments?: Record<string, { value: string; tag?: string }>
}

type NestedMessages = { [key: string]: string | NestedMessages }

/**
 * next-intl expects nested JSON. Our registry uses dotted keys ('nav.servicesLink').
 * This nester walks each dotted key and writes the leaf string into the right
 * spot in the tree.
 */
function nestKeys(flat: Record<string, string>): NestedMessages {
  const root: NestedMessages = {}
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split('.')
    let cursor: NestedMessages = root
    for (let i = 0; i < parts.length - 1; i++) {
      const next = cursor[parts[i]]
      if (typeof next === 'string') {
        // Conflict: a leaf already exists where we need a branch. Skip silently —
        // registry should never produce this; the type system catches it at edit time.
        cursor = {}
        break
      }
      cursor = (next as NestedMessages | undefined) ?? (cursor[parts[i]] = {})
    }
    cursor[parts[parts.length - 1]] = value
  }
  return root
}

function flatten(catalog: CatalogShape): Record<string, string> {
  const segs = catalog.segments ?? {}
  const out: Record<string, string> = {}
  for (const [k, seg] of Object.entries(segs)) {
    if (seg && typeof seg.value === 'string') out[k] = seg.value
  }
  return out
}

const EN_FLAT = flatten(enCatalog as unknown as CatalogShape)

/**
 * Load messages for a locale as a NESTED dict (the shape next-intl expects),
 * merging on top of the English source. Missing locale catalogs (haven't
 * been translated yet) fall back fully to English.
 *
 * Server-only — called from `getStaticProps`. Do not import this module from
 * any code that ships to the client; it requires a sync filesystem read for
 * non-default locales.
 */
// Resolve messages/ at the project root via process.cwd() (the frontend dir
// during `next build` and `next dev`). Read with fs so each call sees fresh
// content — important so a `npm run translate` run lands without a dev server
// restart.
const MESSAGES_DIR = path.join(process.cwd(), 'messages')

export function loadMessages(locale: Locale): NestedMessages {
  if (locale === DEFAULT_LOCALE) return nestKeys(EN_FLAT)

  const filePath = path.join(MESSAGES_DIR, `${locale}.json`)
  if (!fs.existsSync(filePath)) {
    // No translation file yet — fall back to English. The Beta label in the
    // picker covers the gap.
    return nestKeys(EN_FLAT)
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    const tgt = JSON.parse(raw) as CatalogShape
    return nestKeys({ ...EN_FLAT, ...flatten(tgt) })
  } catch {
    return nestKeys(EN_FLAT)
  }
}
