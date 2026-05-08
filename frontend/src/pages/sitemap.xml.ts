import type { GetServerSideProps } from 'next'
import { AREAS } from '@/content/areas'
import { SERVICES } from '@/content/services'
import { absoluteUrl, SITE } from '@/content/site'
import { LOCALES, localizedPath } from '@/i18n/locales'

interface Entry {
  loc: string
  priority?: number
  changefreq?: 'daily' | 'weekly' | 'monthly'
}

function buildSitemap(): string {
  const today = new Date().toISOString().slice(0, 10)

  const entries: Entry[] = [
    { loc: '/', priority: 1.0, changefreq: 'weekly' },
    { loc: '/verify', priority: 0.9, changefreq: 'monthly' },
    ...SERVICES.map((s) => ({ loc: `/services/${s.slug}`, priority: 0.85, changefreq: 'monthly' as const })),
    ...AREAS.map((a) => ({ loc: `/areas/${a.slug}`, priority: 0.85, changefreq: 'monthly' as const })),
    { loc: '/privacy', priority: 0.3, changefreq: 'monthly' },
    { loc: '/terms', priority: 0.3, changefreq: 'monthly' },
  ]

  const urlBlocks = entries.flatMap((e) =>
    LOCALES.map((locale) => {
      const localizedLoc = absoluteUrl(localizedPath(locale, e.loc))
      const alternates = LOCALES.map((alt) => {
        const altUrl = absoluteUrl(localizedPath(alt, e.loc))
        return `    <xhtml:link rel="alternate" hreflang="${alt}" href="${altUrl}"/>`
      }).join('\n')
      const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${absoluteUrl(e.loc)}"/>`
      return `  <url>
    <loc>${localizedLoc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${e.changefreq ?? 'monthly'}</changefreq>
    <priority>${e.priority?.toFixed(1) ?? '0.5'}</priority>
${alternates}
${xDefault}
  </url>`
    }),
  )

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlBlocks.join('\n')}
</urlset>`
}

// SitemapXml never renders — getServerSideProps writes the XML response and ends.
export default function SitemapXml() {
  return null
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const xml = buildSitemap()
  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  res.write(xml)
  res.end()
  return { props: {} }
}

// Reference SITE so the bundler doesn't drop the import in production builds.
void SITE
