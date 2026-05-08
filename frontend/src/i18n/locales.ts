/**
 * Locale set — single source of truth for the multilingual layer.
 *
 * Every locale-aware function in the codebase consumes `Locale`, never `string`.
 * The slide-out picker, middleware, schema helpers, message accessor, and
 * translation CLI all import from here.
 *
 * Decisions baked in:
 * - Filipino and Tagalog ship as a single `fil` entry. They are functionally
 *   the same target — Filipino is the standardized register of Tagalog.
 * - Spanish is `es-MX` (Mexican variant — dominant in San Mateo County).
 * - Portuguese is `pt-BR` (Brazilian — dominant Bay Area Portuguese variant).
 * - Hebrew (`he`) is Modern Israeli Hebrew, not Yiddish.
 * - Klingon (`tlh`) ships in Latin transliteration following the KLI standard
 *   (capitals are phonemically meaningful: D ≠ d, S ≠ s, Q ≠ q). The pIqaD
 *   native script lives in Unicode Private Use and is intentionally not used
 *   here — Latin transliteration is the universal, font-agnostic form.
 *
 * Locales flagged `experimental: true` ship behind a "Beta" tag in the picker
 * until a native-speaker review is logged in i18n/voice/<locale>.md. Klingon
 * is permanently `experimental` because it has no native speakers.
 */

export const LOCALES = [
  'en',
  'es-MX',
  'zh-Hans',
  'ja',
  'ko',
  'vi',
  'fil',
  'pt-BR',
  'ru',
  'id',
  'nl',
  'de',
  'he',
  'ur',
  'tlh',
] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

export interface LocaleMeta {
  code: Locale
  /** English display name. */
  english: string
  /** Native display name as it appears in the slide-out. */
  native: string
  /** Writing direction. */
  dir: 'ltr' | 'rtl'
  /** OpenGraph `og:locale` value. Falls back to BCP-47 with underscore. */
  ogLocale: string
  /** Native-speaker review status. */
  experimental: boolean
  /**
   * Font family token. `inter` = use the existing Inter (Latin/Cyrillic/
   * Vietnamese covered via subsets). Anything else is loaded conditionally
   * via next/font in src/i18n/fonts.ts.
   */
  font: 'inter' | 'noto-sc' | 'noto-jp' | 'noto-kr' | 'noto-hebrew' | 'noto-nastaliq'
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  en: { code: 'en', english: 'English', native: 'English', dir: 'ltr', ogLocale: 'en_US', experimental: false, font: 'inter' },
  'es-MX': { code: 'es-MX', english: 'Spanish (Mexico)', native: 'Español', dir: 'ltr', ogLocale: 'es_MX', experimental: false, font: 'inter' },
  'zh-Hans': { code: 'zh-Hans', english: 'Simplified Chinese', native: '简体中文', dir: 'ltr', ogLocale: 'zh_CN', experimental: false, font: 'noto-sc' },
  ja: { code: 'ja', english: 'Japanese', native: '日本語', dir: 'ltr', ogLocale: 'ja_JP', experimental: false, font: 'noto-jp' },
  ko: { code: 'ko', english: 'Korean', native: '한국어', dir: 'ltr', ogLocale: 'ko_KR', experimental: false, font: 'noto-kr' },
  vi: { code: 'vi', english: 'Vietnamese', native: 'Tiếng Việt', dir: 'ltr', ogLocale: 'vi_VN', experimental: false, font: 'inter' },
  fil: { code: 'fil', english: 'Filipino', native: 'Filipino', dir: 'ltr', ogLocale: 'fil_PH', experimental: false, font: 'inter' },
  'pt-BR': { code: 'pt-BR', english: 'Portuguese (Brazil)', native: 'Português', dir: 'ltr', ogLocale: 'pt_BR', experimental: false, font: 'inter' },
  ru: { code: 'ru', english: 'Russian', native: 'Русский', dir: 'ltr', ogLocale: 'ru_RU', experimental: false, font: 'inter' },
  id: { code: 'id', english: 'Indonesian', native: 'Bahasa Indonesia', dir: 'ltr', ogLocale: 'id_ID', experimental: false, font: 'inter' },
  nl: { code: 'nl', english: 'Dutch', native: 'Nederlands', dir: 'ltr', ogLocale: 'nl_NL', experimental: false, font: 'inter' },
  de: { code: 'de', english: 'German', native: 'Deutsch', dir: 'ltr', ogLocale: 'de_DE', experimental: false, font: 'inter' },
  he: { code: 'he', english: 'Hebrew', native: 'עברית', dir: 'rtl', ogLocale: 'he_IL', experimental: false, font: 'noto-hebrew' },
  ur: { code: 'ur', english: 'Urdu', native: 'اُردُو', dir: 'rtl', ogLocale: 'ur_PK', experimental: false, font: 'noto-nastaliq' },
  tlh: { code: 'tlh', english: 'Klingon', native: 'tlhIngan Hol', dir: 'ltr', ogLocale: 'tlh', experimental: true, font: 'inter' },
}

/** Type guard: is the value a recognized locale? */
export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}

/** Locales whose `<html dir>` is RTL. */
export function isRtl(locale: Locale): boolean {
  return LOCALE_META[locale].dir === 'rtl'
}

/**
 * Build the locale-prefixed path for a given route.
 * Default locale (`en`) stays unprefixed: '/' → '/'.
 * Other locales get a prefix: '/' → '/zh-Hans/'.
 */
export function localizedPath(locale: Locale, path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  if (locale === DEFAULT_LOCALE) return cleanPath
  if (cleanPath === '/') return `/${locale}`
  return `/${locale}${cleanPath}`
}

/** Strip any locale prefix from a path. Returns the canonical (en) path. */
export function stripLocalePrefix(path: string): string {
  for (const locale of LOCALES) {
    if (locale === DEFAULT_LOCALE) continue
    if (path === `/${locale}`) return '/'
    if (path.startsWith(`/${locale}/`)) return path.slice(locale.length + 1)
  }
  return path
}
