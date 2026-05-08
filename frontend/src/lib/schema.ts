import { SITE, absoluteUrl } from '@/content/site'
import { AREAS, type Area } from '@/content/areas'
import { SERVICES, type Service, type ServiceSlug } from '@/content/services'
import { aggregateRating, REVIEWS } from '@/content/reviews'
import type { FAQ } from '@/content/services'

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

/** Wrap one or more nodes in a single @graph block. */
export function graph(...nodes: JsonLd[]): Record<string, unknown> {
  return { '@context': 'https://schema.org', '@graph': nodes }
}

export function organization(): JsonLd {
  return {
    '@type': 'Organization',
    '@id': `${SITE.url}/#org`,
    name: SITE.name,
    alternateName: SITE.alternateName,
    url: SITE.url,
    logo: absoluteUrl('/api/og'),
    sameAs: SAME_AS,
    founder: SITE.owners.map((name) => ({ '@type': 'Person', name })),
    foundingDate: String(SITE.foundedYear),
  }
}

export function localBusiness(): JsonLd {
  const rating = aggregateRating()
  return {
    '@type': 'LocalBusiness',
    '@id': `${SITE.url}/#business`,
    name: SITE.name,
    alternateName: SITE.alternateName,
    url: SITE.url,
    telephone: SITE.phone.e164,
    priceRange: SITE.priceRange,
    description: SITE.imposterNote,
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
export function service(slug: ServiceSlug, area?: Area): JsonLd {
  const svc = SERVICES.find((s) => s.slug === slug) as Service
  const url = area
    ? absoluteUrl(`/areas/${area.slug}`)
    : absoluteUrl(`/services/${slug}`)
  return {
    '@type': 'Service',
    '@id': `${url}#service`,
    serviceType: svc.name,
    name: area ? `${svc.name} in ${area.city}, CA` : svc.name,
    description: area ? area.summary : svc.description,
    provider: { '@id': `${SITE.url}/#business` },
    areaServed: area
      ? { '@type': 'City', name: area.city }
      : AREAS.map((a) => ({ '@type': 'City', name: a.city })),
    url,
  }
}

export function breadcrumbs(items: { name: string; url: string }[]): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url.startsWith('http') ? it.url : absoluteUrl(it.url),
    })),
  }
}

export function faqPage(faqs: readonly FAQ[]): JsonLd {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}
