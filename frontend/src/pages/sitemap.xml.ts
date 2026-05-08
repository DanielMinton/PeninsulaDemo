import type { GetServerSideProps } from 'next'
import { AREAS } from '@/content/areas'
import { SERVICES } from '@/content/services'
import { absoluteUrl, SITE } from '@/content/site'

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

  const urls = entries
    .map(
      (e) => `  <url>
    <loc>${absoluteUrl(e.loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${e.changefreq ?? 'monthly'}</changefreq>
    <priority>${e.priority?.toFixed(1) ?? '0.5'}</priority>
  </url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
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
