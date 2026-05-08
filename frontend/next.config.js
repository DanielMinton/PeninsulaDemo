/** @type {import('next').NextConfig} */

// Slugs are intentionally hardcoded here (not imported from src/content/areas.ts)
// because next.config.js runs in Node and cannot import TS modules. The list is
// short and stable; if a slug changes, update both files.
const AREA_SLUGS = [
  'san-carlos',
  'san-mateo',
  'redwood-city',
  'belmont',
  'burlingame',
  'palo-alto',
  'menlo-park',
  'south-san-francisco',
  'daly-city',
  'millbrae',
]

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'thepeninsulapickup.com' },
      { protocol: 'https', hostname: 'api.thepeninsulapickup.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },
  async redirects() {
    // Old flat /[slug] city paths -> /areas/[slug]
    return AREA_SLUGS.map((slug) => ({
      source: `/${slug}`,
      destination: `/areas/${slug}`,
      permanent: true,
    }))
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://thepeninsulapickup.com',
  },
}

module.exports = nextConfig
