import type { NextSeoProps } from 'next-seo'
import { SITE, absoluteUrl } from '@/content/site'
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, localizedPath, type Locale } from '@/i18n/locales'

interface PageSeoInput {
  title: string
  description: string
  /** Canonical path with leading slash. Always points at SITE.url. The locale prefix is added by this helper, never by the caller. */
  path: string
  /** Override OG image path. Defaults to dynamic /api/og. */
  ogImagePath?: string
  ogImageAlt?: string
  type?: 'website' | 'article'
  noindex?: boolean
}

/**
 * Build NextSeoProps for a page using SITE constants and the active locale.
 * - canonical = SITE.url + locale prefix + path
 * - emits <link rel="alternate" hreflang> for every locale + x-default
 * - og:locale + og:locale:alternate covers the locale graph for OpenGraph crawlers
 */
export function pageSeo(input: PageSeoInput, locale: Locale = DEFAULT_LOCALE): NextSeoProps {
  const canonical = absoluteUrl(localizedPath(locale, input.path))
  const meta = LOCALE_META[locale]

  const ogImagePath = input.ogImagePath ?? `/api/og?locale=${encodeURIComponent(locale)}`
  const ogImage = absoluteUrl(ogImagePath)

  // hreflang block: every locale + x-default → unprefixed (en) URL.
  const languageAlternates = [
    ...LOCALES.map((loc) => ({
      hrefLang: loc,
      href: absoluteUrl(localizedPath(loc, input.path)),
    })),
    { hrefLang: 'x-default', href: absoluteUrl(input.path) },
  ]

  return {
    title: input.title,
    description: input.description,
    canonical,
    noindex: input.noindex,
    nofollow: input.noindex,
    languageAlternates,
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonical,
      type: input.type ?? 'website',
      siteName: SITE.name,
      locale: meta.ogLocale,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: input.ogImageAlt ?? `${SITE.name} — ${input.title}`,
        },
      ],
    },
    additionalMetaTags: LOCALES.filter((l) => l !== locale).map((l) => ({
      property: 'og:locale:alternate',
      content: LOCALE_META[l].ogLocale,
    })),
    twitter: {
      cardType: 'summary_large_image',
      site: '@peninsulapickups',
    },
  }
}
