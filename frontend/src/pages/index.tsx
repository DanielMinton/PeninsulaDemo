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
import QuoteForm from '@/components/shared/QuoteForm'

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://thepeninsulapickup.com/#business',
  name: 'Peninsula Pick Ups',
  alternateName: 'The Peninsula Pickup',
  url: 'https://thepeninsulapickup.com',
  telephone: '+16502011543',
  email: '',
  description:
    'Peninsula Pick Ups provides professional junk removal, hauling, construction debris removal, appliance removal, and cleanout services across the San Francisco Peninsula. Locally owned by Don and Melissa since 2021.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'San Carlos',
    addressLocality: 'San Carlos',
    addressRegion: 'CA',
    postalCode: '94070',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 37.5074,
    longitude: -122.2585,
  },
  areaServed: [
    'San Carlos',
    'San Mateo',
    'Redwood City',
    'Belmont',
    'Burlingame',
    'Palo Alto',
    'Menlo Park',
    'South San Francisco',
    'Daly City',
    'Millbrae',
  ].map((city) => ({ '@type': 'City', name: city })),
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '07:00',
    closes: '18:00',
  },
  priceRange: '$$',
  hasMap: 'https://maps.google.com/?q=San+Carlos,+CA+94070',
  sameAs: [
    'https://thepeninsulapickup.com',
    'https://www.instagram.com/peninsulapickups/',
    'https://www.yelp.com/biz/peninsula-pick-ups-san-carlos',
    'https://www.facebook.com/peninsulapickups/',
  ],
  founder: [{ '@type': 'Person', name: 'Don' }, { '@type': 'Person', name: 'Melissa' }],
  foundingDate: '2021',
}

const Home: NextPage = () => {
  return (
    <>
      <NextSeo
        title="Peninsula Pick Ups | Junk Removal & Hauling | San Carlos, CA"
        description="Peninsula Pick Ups provides junk removal, hauling, cleanouts, and construction debris removal across the SF Peninsula. Locally owned by Don and Melissa in San Carlos, CA since 2021. Call (650) 201-1543."
        canonical="https://thepeninsulapickup.com"
        openGraph={{
          title: 'Peninsula Pick Ups | Junk Removal & Hauling | San Carlos, CA',
          description:
            'Licensed junk removal, hauling, and cleanout services. Family owned in San Carlos since 2021. Fast scheduling, honest pricing. Call (650) 201-1543.',
          url: 'https://thepeninsulapickup.com',
          type: 'website',
          images: [
            {
              url: 'https://thepeninsulapickup.com/api/og',
              width: 1200,
              height: 630,
              alt: 'Peninsula Pick Ups — Junk Removal & Hauling, San Carlos, CA',
            },
          ],
        }}
        twitter={{
          cardType: 'summary_large_image',
          site: '@peninsulapickups',
        }}
        additionalMetaTags={[
          { name: 'keywords', content: 'junk removal San Carlos, Peninsula junk removal, hauling San Mateo County, cleanout service Peninsula, Peninsula Pick Ups' },
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />

      <Layout>
        <HeroSection />
        <VerifyStrip />
        <ServicesGrid />
        <TrustSection />
        <QuoteSelector />
        <GallerySection />
        <ServiceAreasSection />
        <TestimonialsSection />
        <QuoteForm />
      </Layout>
    </>
  )
}

export default Home
