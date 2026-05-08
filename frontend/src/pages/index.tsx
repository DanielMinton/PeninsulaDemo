import type { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import Layout from '@/components/shared/Layout'
import HeroSection from '@/components/shared/HeroSection'
import VerifyStrip from '@/components/shared/VerifyStrip'
import ServicesGrid from '@/components/shared/ServicesGrid'
import TrustSection from '@/components/shared/TrustSection'
import QuoteSelector from '@/components/shared/QuoteSelector'
import GallerySection from '@/components/shared/GallerySection'
import ServiceAreasSection from '@/components/shared/ServiceAreasSection'
import TestimonialsSection from '@/components/shared/TestimonialsSection'
import { AREAS } from '@/content/areas'
import { SITE, absoluteUrl } from '@/content/site'
import { aggregateRating } from '@/content/reviews'

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE.url}/#business`,
  name: SITE.name,
  alternateName: SITE.alternateName,
  url: SITE.url,
  telephone: SITE.phone.e164,
  description: SITE.imposterNote,
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.country,
  },
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
  priceRange: SITE.priceRange,
  hasMap: `https://maps.google.com/?q=${encodeURIComponent(`${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}`)}`,
  sameAs: [...SITE.sameAs],
  founder: SITE.owners.map((name) => ({ '@type': 'Person', name })),
  foundingDate: String(SITE.foundedYear),
  aggregateRating: {
    '@type': 'AggregateRating',
    ...aggregateRating(),
  },
}

const Home: NextPage = () => {
  return (
    <>
      <NextSeo
        title={`${SITE.name} | Junk Removal & Hauling | ${SITE.address.city}, ${SITE.address.region}`}
        description={`${SITE.name} provides junk removal, hauling, cleanouts, and construction debris removal across the SF Peninsula. Locally owned by ${SITE.owners[0]} and ${SITE.owners[1]} in ${SITE.address.city}, ${SITE.address.region} since ${SITE.foundedYear}. Call ${SITE.phone.display}.`}
        canonical={SITE.url}
        openGraph={{
          title: `${SITE.name} | Junk Removal & Hauling | ${SITE.address.city}, ${SITE.address.region}`,
          description: `Licensed junk removal, hauling, and cleanout services. Family owned in ${SITE.address.city} since ${SITE.foundedYear}. Fast scheduling, honest pricing. Call ${SITE.phone.display}.`,
          url: SITE.url,
          type: 'website',
          images: [
            {
              url: absoluteUrl('/api/og'),
              width: 1200,
              height: 630,
              alt: `${SITE.name} — Junk Removal & Hauling, ${SITE.address.city}, ${SITE.address.region}`,
            },
          ],
        }}
        twitter={{ cardType: 'summary_large_image', site: '@peninsulapickups' }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: `junk removal ${SITE.address.city}, Peninsula junk removal, hauling San Mateo County, cleanout service Peninsula, ${SITE.name}`,
          },
        ]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <Layout>
        <HeroSection />
        <VerifyStrip />
        <ServicesGrid />
        <TrustSection />
        <QuoteSelector />
        <GallerySection />
        <ServiceAreasSection />
        <TestimonialsSection />
      </Layout>
    </>
  )
}

export default Home
