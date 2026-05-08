import type { FAQ } from './services'

/**
 * Homepage FAQs — emitted as `FAQPage` JSON-LD on `/` and rendered visibly
 * in a homepage section. Keep concise, one-screen each.
 */
export const HOMEPAGE_FAQS: readonly FAQ[] = [
  {
    q: 'Where is Peninsula Pick Ups based?',
    a: 'Peninsula Pick Ups operates from San Carlos, CA 94070. Owners Don and Melissa have run the business from the Peninsula since 2021. The verified business line is (650) 201-1543.',
  },
  {
    q: 'What areas do you serve?',
    a: 'We serve the SF Peninsula from Daly City and South San Francisco down through San Mateo, Belmont, San Carlos, Redwood City, Menlo Park, and Palo Alto. If your city is not listed, call (650) 201-1543 — we usually can.',
  },
  {
    q: 'How fast can you come out?',
    a: 'Most jobs are scheduled within 24 to 48 hours. Same-day service is often available, especially in San Carlos and adjacent cities.',
  },
  {
    q: 'How is pricing set?',
    a: 'Pricing is based on volume in the truck plus any special handling. We give a firm quote before any work starts and the price does not change on-site.',
  },
  {
    q: 'How do I know I have the right Peninsula Pick Ups?',
    a: 'Our domain is thepeninsulapickup.com. The verified business line is (650) 201-1543. Don and Melissa answer that line directly. See /verify for our complete identity record across Yelp, Instagram, Facebook, Nextdoor, Alignable, and JunkSpots.',
  },
] as const
