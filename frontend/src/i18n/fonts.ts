/**
 * Per-locale font loading via next/font/google.
 *
 * Strategy (matches PROPOSAL_I18N.md §"Per-locale fonts"):
 *  - Inter (with extended subsets) covers Latin, Latin-ext, Cyrillic, and
 *    Vietnamese — all locales whose font: is `'inter'`.
 *  - Each non-Latin script gets a Noto family. The active locale's font
 *    variable is applied to the wrapping <div> in _app.tsx; only that
 *    locale's font preloads on the page.
 *
 * Build-time cost: every family below is downloaded and self-hosted at
 * build time. Bundle delta per *locale* is bounded — only the active
 * locale's font reaches the browser.
 */

import {
  Inter,
  Noto_Sans_SC,
  Noto_Sans_JP,
  Noto_Sans_KR,
  Noto_Sans_Hebrew,
  Noto_Nastaliq_Urdu,
} from 'next/font/google'
import type { Locale, LocaleMeta } from './locales'

export const inter = Inter({
  subsets: ['latin', 'latin-ext', 'cyrillic', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
})

const notoSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-noto-sc',
  display: 'swap',
  preload: false,
})
const notoJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-noto-jp',
  display: 'swap',
  preload: false,
})
const notoKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-noto-kr',
  display: 'swap',
  preload: false,
})
const notoHebrew = Noto_Sans_Hebrew({
  subsets: ['hebrew'],
  weight: ['400', '600'],
  variable: '--font-noto-hebrew',
  display: 'swap',
  preload: false,
})
const notoNastaliq = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-noto-nastaliq',
  display: 'swap',
  preload: false,
})

const FONT_BY_KEY: Record<LocaleMeta['font'], { variable: string; className: string }> = {
  inter: { variable: inter.variable, className: inter.className },
  'noto-sc': { variable: `${inter.variable} ${notoSC.variable}`, className: notoSC.className },
  'noto-jp': { variable: `${inter.variable} ${notoJP.variable}`, className: notoJP.className },
  'noto-kr': { variable: `${inter.variable} ${notoKR.variable}`, className: notoKR.className },
  'noto-hebrew': { variable: `${inter.variable} ${notoHebrew.variable}`, className: notoHebrew.className },
  'noto-nastaliq': { variable: `${inter.variable} ${notoNastaliq.variable}`, className: notoNastaliq.className },
}

/**
 * Returns the font-variable class string + the active className for the
 * locale. Apply both to the wrapping div in _app.tsx.
 */
export function fontVariablesFor(locale: Locale, fontKey: LocaleMeta['font']): string {
  void locale
  const f = FONT_BY_KEY[fontKey]
  return `${f.variable} ${f.className}`.trim()
}

/**
 * Tailwind reads `--font-inter` for `font-sans`. For non-Latin locales,
 * we override the family at the locale-wrapped div so the right script
 * shape applies. Returns the appropriate inline style.
 */
export function fontFamilyStyle(fontKey: LocaleMeta['font']): React.CSSProperties {
  switch (fontKey) {
    case 'inter':
      return {}
    case 'noto-sc':
      return { fontFamily: 'var(--font-noto-sc), var(--font-inter), sans-serif' }
    case 'noto-jp':
      return { fontFamily: 'var(--font-noto-jp), var(--font-inter), sans-serif' }
    case 'noto-kr':
      return { fontFamily: 'var(--font-noto-kr), var(--font-inter), sans-serif' }
    case 'noto-hebrew':
      return { fontFamily: 'var(--font-noto-hebrew), var(--font-inter), sans-serif' }
    case 'noto-nastaliq':
      return { fontFamily: 'var(--font-noto-nastaliq), var(--font-inter), serif' }
  }
}
