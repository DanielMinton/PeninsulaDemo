import type { NextSeoProps } from 'next-seo'
import { SITE, absoluteUrl } from '@/content/site'

interface PageSeoInput {
  title: string
  description: string
  /** Canonical path with leading slash. Always points at SITE.url, never the preview host. */
  path: string
  /** Override OG image path. Defaults to dynamic /api/og. */
  ogImagePath?: string
  ogImageAlt?: string
  type?: 'website' | 'article'
  noindex?: boolean
}

/**
 * Build NextSeoProps for a page using SITE constants.
 * Centralized so canonical URLs never drift to preview hostnames.
 */
export function pageSeo(input: PageSeoInput): NextSeoProps {
  const canonical = absoluteUrl(input.path)
  const ogImage = absoluteUrl(input.ogImagePath ?? '/api/og')
  return {
    title: input.title,
    description: input.description,
    canonical,
    noindex: input.noindex,
    nofollow: input.noindex,
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonical,
      type: input.type ?? 'website',
      siteName: SITE.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: input.ogImageAlt ?? `${SITE.name} — ${input.title}`,
        },
      ],
    },
    twitter: {
      cardType: 'summary_large_image',
      site: '@peninsulapickups',
    },
  }
}
