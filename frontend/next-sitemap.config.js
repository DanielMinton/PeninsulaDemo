/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://thepeninsulapickup.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
  },
  changefreq: 'weekly',
  priority: 0.7,
  additionalPaths: async (config) => {
    const locations = [
      'san-carlos', 'san-mateo', 'redwood-city', 'belmont',
      'burlingame', 'palo-alto', 'menlo-park',
      'south-san-francisco', 'daly-city', 'millbrae',
    ]
    return locations.map((slug) => ({
      loc: `/${slug}`,
      changefreq: 'monthly',
      priority: 0.8,
    }))
  },
}
