import { SITE, absoluteUrl } from '@/content/site'
import { AREAS, type Area } from '@/content/areas'
import { SERVICES, type Service, type ServiceSlug } from '@/content/services'
import { aggregateRating, REVIEWS } from '@/content/reviews'
import type { FAQ } from '@/content/services'
import { DEFAULT_LOCALE, LOCALE_META, type Locale } from '@/i18n/locales'

type JsonLd = Record<string, unknown> & { '@type': string }

const POSTAL_ADDRESS = {
  '@type': 'PostalAddress' as const,
  streetAddress: SITE.address.street,
  addressLocality: SITE.address.city,
  addressRegion: SITE.address.region,
  postalCode: SITE.address.postalCode,
  addressCountry: SITE.address.country,
}

const SAME_AS = [...SITE.sameAs]

/**
 * @id fragments are intentionally locale-AGNOSTIC so the entity graph merges
 * across locales. `sameAs` is a single global array (entity property, not
 * per-locale). Translated fields per locale: `name`, `description`,
 * BreadcrumbList.name, Service.name/description, FAQPage Q/A, reviewBody.
 * Untranslated: address, phone, founder names, founding year, geo.
 */

function bcp47Underscore(locale: Locale): string {
  // schema.org `inLanguage` accepts BCP-47 with hyphen, but many crawlers
  // also tolerate underscore. We emit hyphen here (the spec form).
  return locale
}

/** Wrap one or more nodes in a single @graph block. */
export function graph(...nodes: JsonLd[]): Record<string, unknown> {
  return { '@context': 'https://schema.org', '@graph': nodes }
}

export function organization(locale: Locale = DEFAULT_LOCALE): JsonLd {
  return {
    '@type': 'Organization',
    '@id': `${SITE.url}/#org`,
    inLanguage: bcp47Underscore(locale),
    name: SITE.name,
    alternateName: SITE.alternateName,
    url: SITE.url,
    logo: absoluteUrl('/api/og'),
    sameAs: SAME_AS,
    founder: SITE.owners.map((name) => ({ '@type': 'Person', name })),
    foundingDate: String(SITE.foundedYear),
  }
}

export function localBusiness(
  locale: Locale = DEFAULT_LOCALE,
  translated?: { name?: string; description?: string },
): JsonLd {
  const rating = aggregateRating()
  return {
    '@type': 'LocalBusiness',
    '@id': `${SITE.url}/#business`,
    inLanguage: bcp47Underscore(locale),
    name: translated?.name ?? SITE.name,
    alternateName: SITE.alternateName,
    url: SITE.url,
    telephone: SITE.phone.e164,
    priceRange: SITE.priceRange,
    description: translated?.description ?? SITE.imposterNote,
    address: POSTAL_ADDRESS,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    },
    areaServed: AREAS.map((a) => ({ '@type': 'City', name: a.city })),
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [...SITE.hours.days],
      opens: SITE.hours.opens,
      closes: SITE.hours.closes,
    },
    hasMap: `https://maps.google.com/?q=${encodeURIComponent(`${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}`)}`,
    sameAs: SAME_AS,
    founder: SITE.owners.map((name) => ({ '@type': 'Person', name })),
    foundingDate: String(SITE.foundedYear),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating.ratingValue,
      bestRating: rating.bestRating,
      worstRating: rating.worstRating,
      reviewCount: rating.reviewCount,
    },
    review: REVIEWS.slice(0, 3).map((r) => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      author: { '@type': 'Person', name: r.reviewer },
      reviewBody: r.text,
      datePublished: r.dateISO,
      inLanguage: 'en',
    })),
  }
}

export function aggregateRatingNode(): JsonLd {
  const rating = aggregateRating()
  return {
    '@type': 'AggregateRating',
    itemReviewed: { '@id': `${SITE.url}/#business` },
    ratingValue: rating.ratingValue,
    bestRating: rating.bestRating,
    worstRating: rating.worstRating,
    reviewCount: rating.reviewCount,
  }
}

/** Service node, optionally city-scoped. */
export function service(
  slug: ServiceSlug,
  area?: Area,
  locale: Locale = DEFAULT_LOCALE,
  translated?: { name?: string; description?: string },
): JsonLd {
  const svc = SERVICES.find((s) => s.slug === slug) as Service
  const url = area
    ? absoluteUrl(`/areas/${area.slug}`)
    : absoluteUrl(`/services/${slug}`)
  return {
    '@type': 'Service',
    '@id': `${url}#service`,
    inLanguage: bcp47Underscore(locale),
    serviceType: svc.name,
    name: translated?.name ?? (area ? `${svc.name} in ${area.city}, CA` : svc.name),
    description: translated?.description ?? (area ? area.summary : svc.description),
    provider: { '@id': `${SITE.url}/#business` },
    areaServed: area
      ? { '@type': 'City', name: area.city }
      : AREAS.map((a) => ({ '@type': 'City', name: a.city })),
    url,
  }
}

export function breadcrumbs(items: { name: string; url: string }[], locale: Locale = DEFAULT_LOCALE): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    inLanguage: bcp47Underscore(locale),
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url.startsWith('http') ? it.url : absoluteUrl(it.url),
    })),
  }
}

export function faqPage(faqs: readonly FAQ[], locale: Locale = DEFAULT_LOCALE): JsonLd {
  return {
    '@type': 'FAQPage',
    inLanguage: bcp47Underscore(locale),
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a, inLanguage: bcp47Underscore(locale) },
    })),
  }
}

void LOCALE_META
