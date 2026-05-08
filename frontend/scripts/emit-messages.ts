#!/usr/bin/env tsx
/**
 * Emit messages/en.json from the typed registry in src/content/messages.ts.
 *
 * The translate CLI consumes messages/en.json as the source of truth; this
 * script is the bridge from the TypeScript registry to the JSON catalog.
 * Run automatically before every translate pass and at CI-check time.
 */

import fs from 'node:fs'
import path from 'node:path'
import { MESSAGES, MESSAGES_VERSION } from '../src/content/messages'

const ROOT = path.resolve(__dirname, '..')
const OUT = path.join(ROOT, 'messages', 'en.json')

function emit(): void {
  fs.mkdirSync(path.dirname(OUT), { recursive: true })

  const segments = Object.fromEntries(
    Object.entries(MESSAGES).map(([key, seg]) => [key, { value: seg.value, tag: seg.tag }]),
  )

  const catalog = {
    $version: MESSAGES_VERSION,
    $generated: 'auto from src/content/messages.ts — do not edit by hand',
    segments,
  }

  fs.writeFileSync(OUT, JSON.stringify(catalog, null, 2) + '\n')
  console.log(`Wrote ${OUT} (${Object.keys(segments).length} segments)`)
}

emit()
