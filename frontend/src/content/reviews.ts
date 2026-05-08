import type { ServiceSlug } from './services'

export type ReviewSource = 'yelp' | 'nextdoor' | 'google' | 'facebook'

export interface Review {
  source: ReviewSource
  /** Reviewer's display name as published on the source. */
  reviewer: string
  rating: 1 | 2 | 3 | 4 | 5
  text: string
  /** Service slug — translated for display via getServiceShortName(slug, t). */
  serviceSlug: ServiceSlug
  city: string
  /** ISO 8601, YYYY-MM-DD. */
  dateISO: string
  /** Optional deep-link to the source review. */
  url?: string
}

/**
 * Reviews shown in TestimonialsSection AND used to compute the AggregateRating
 * JSON-LD on the homepage and city pages. Sourced from Yelp; keep this list
 * truthful — it backs schema.org/AggregateRating, which Google can audit.
 */
export const REVIEWS: readonly Review[] = [
  {
    source: 'yelp',
    reviewer: 'Yelp customer',
    rating: 5,
    text: 'Don and crew were super nice and extremely professional, and the prices are VERY competitive. Would definitely recommend to anyone looking for a reliable, affordable junk removal service.',
    serviceSlug: 'junk-removal',
    city: 'San Carlos',
    dateISO: '2024-08-12',
    url: 'https://www.yelp.com/biz/peninsula-pick-ups-san-carlos',
  },
  {
    source: 'yelp',
    reviewer: 'Yelp customer',
    rating: 5,
    text: 'Melissa was prompt to reply to my email. Donovan arrived on the scheduled date and on time! He was attentive in not damaging walls and floors when hauling the old stuff.',
    serviceSlug: 'appliance-removal',
    city: 'Redwood City',
    dateISO: '2024-09-03',
    url: 'https://www.yelp.com/biz/peninsula-pick-ups-san-carlos',
  },
  {
    source: 'yelp',
    reviewer: 'Yelp customer',
    rating: 5,
    text: 'These people waste no time. They are super efficient, friendly, licensed and insured. The pricing is very reasonable too.',
    serviceSlug: 'storage-cleanout',
    city: 'San Mateo',
    dateISO: '2024-10-21',
    url: 'https://www.yelp.com/biz/peninsula-pick-ups-san-carlos',
  },
] as const

/**
 * Public-facing total review count across all sources (Yelp 22 + others).
 * Used by AggregateRating.
 */
export const TOTAL_REVIEW_COUNT = 22

/**
 * Aggregate rating reflecting the on-site Yelp profile (5.0★ on 22 reviews
 * as of the last verified check). If the live count drifts, update this here.
 */
export function aggregateRating(): { ratingValue: number; reviewCount: number; bestRating: 5; worstRating: 1 } {
  return {
    ratingValue: 5,
    reviewCount: TOTAL_REVIEW_COUNT,
    bestRating: 5,
    worstRating: 1,
  }
}
