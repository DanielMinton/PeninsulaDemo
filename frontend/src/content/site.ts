/**
 * SITE — single source of identity.
 * Read by every page, schema generator, OG card, sitemap, robots, and middleware.
 */
export const SITE = {
  name: 'Peninsula Pick Ups',
  alternateName: 'The Peninsula Pickup',
  legalName: 'Peninsula Pick Ups',
  tagline: 'The Pickup You Can Count On.',

  // Always read canonical from this constant. Never hardcode the host elsewhere.
  url: 'https://thepeninsulapickup.com',

  // Owners listed in body copy and JSON-LD `founder`.
  // Per project policy: no portrait imagery of Melissa anywhere on the site.
  owners: ['Don', 'Melissa'] as const,
  foundedYear: 2021,

  phone: {
    display: '(650) 201-1543',
    e164: '+16502011543',
    raw: '6502011543',
    href: 'tel:+16502011543',
    smsHref: 'sms:+16502011543',
  },

  email: 'hello@thepeninsulapickup.com',

  address: {
    street: 'San Carlos',
    city: 'San Carlos',
    region: 'CA',
    postalCode: '94070',
    country: 'US',
  },

  geo: {
    lat: 37.5074,
    lng: -122.2585,
  },

  // Mon–Sat 7a–6p, closed Sunday.
  hours: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const,
    opens: '07:00',
    closes: '18:00',
  },

  priceRange: '$$',

  /**
   * The `sameAs` array is the canonical anti-imposter signal.
   * Every JSON-LD block on every page uses this list verbatim.
   * `/verify` is included so the verification page is itself a reciprocal anchor.
   */
  sameAs: [
    'https://thepeninsulapickup.com/verify',
    'https://www.yelp.com/biz/peninsula-pick-ups-san-carlos',
    'https://www.instagram.com/peninsulapickups/',
    'https://www.facebook.com/peninsulapickups/',
    'https://nextdoor.com/pages/peninsula-pick-ups-san-carlos-ca/',
    'https://www.alignable.com/san-carlos-ca/peninsula-pick-ups',
    'https://junkspots.com/peninsula-pick-ups',
    'https://www.google.com/maps/place/Peninsula+Pick+Ups',
  ] as const,

  // Profile metadata for the footer cluster, /verify cards, and rel="me" links.
  socials: [
    { id: 'yelp', label: 'Yelp', handle: 'peninsula-pick-ups-san-carlos', url: 'https://www.yelp.com/biz/peninsula-pick-ups-san-carlos' },
    { id: 'instagram', label: 'Instagram', handle: '@peninsulapickups', url: 'https://www.instagram.com/peninsulapickups/' },
    { id: 'facebook', label: 'Facebook', handle: 'peninsulapickups', url: 'https://www.facebook.com/peninsulapickups/' },
    { id: 'nextdoor', label: 'Nextdoor', handle: 'Peninsula Pick Ups', url: 'https://nextdoor.com/pages/peninsula-pick-ups-san-carlos-ca/' },
    { id: 'alignable', label: 'Alignable', handle: 'Peninsula Pick Ups', url: 'https://www.alignable.com/san-carlos-ca/peninsula-pick-ups' },
    { id: 'junkspots', label: 'JunkSpots', handle: 'Peninsula Pick Ups', url: 'https://junkspots.com/peninsula-pick-ups' },
    { id: 'google', label: 'Google Business', handle: 'Peninsula Pick Ups', url: 'https://www.google.com/maps/place/Peninsula+Pick+Ups' },
  ] as const,

  // The clarifying note used on /verify and in the schema description.
  imposterNote:
    'The legitimate Peninsula Pick Ups operates from this domain (thepeninsulapickup.com) under the verified business line (650) 201-1543. Any other site or phone number presenting our reviews or photos is unaffiliated.',
} as const

export type SocialId = (typeof SITE.socials)[number]['id']

/** Absolute URL helper. Always prefer this to string-concatenating the host. */
export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path
  const base = SITE.url.replace(/\/$/, '')
  const suffix = path.startsWith('/') ? path : `/${path}`
  return `${base}${suffix}`
}
