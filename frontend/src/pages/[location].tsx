import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import Layout from '@/components/shared/Layout'
import FadeIn from '@/components/motion/FadeIn'
import QuoteForm from '@/components/shared/QuoteForm'
import { SERVICE_AREAS, getServiceAreaBySlug, type ServiceAreaData } from '@/lib/serviceAreas'

const PHONE = '(650) 201-1543'
const PHONE_RAW = 'tel:+16502011543'

interface LocationPageProps {
  area: ServiceAreaData
}

function buildSchema(area: ServiceAreaData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Junk Removal in ${area.city}, CA`,
    description: area.summary,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Peninsula Pick Ups',
      telephone: '+16502011543',
      url: 'https://thepeninsulapickup.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'San Carlos',
        addressRegion: 'CA',
        postalCode: '94070',
        addressCountry: 'US',
      },
    },
    areaServed: {
      '@type': 'City',
      name: area.city,
      '@id': `https://www.wikidata.org/wiki/${encodeURIComponent(area.city)}`,
    },
    url: `https://thepeninsulapickup.com/${area.slug}`,
  }
}

const LocationPage: NextPage<LocationPageProps> = ({ area }) => {
  const schema = buildSchema(area)
  const isHomeBase = area.city === 'San Carlos'

  return (
    <>
      <NextSeo
        title={area.seoTitle}
        description={area.seoDescription}
        canonical={`https://thepeninsulapickup.com/${area.slug}`}
        openGraph={{
          title: area.seoTitle,
          description: area.seoDescription,
          url: `https://thepeninsulapickup.com/${area.slug}`,
          type: 'website',
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: `junk removal ${area.city}, hauling ${area.city} CA, cleanout ${area.city}, Peninsula Pick Ups ${area.city}`,
          },
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <Layout>
        <div className="min-h-screen bg-charcoal-900">
          {/* Hero */}
          <div
            className="relative pt-28 pb-20 bg-grid-subtle overflow-hidden"
            style={{
              background:
                '#0f0f0f url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 70% 50% at 10% 20%, rgba(232,93,26,0.06) 0%, transparent 70%)',
              }}
              aria-hidden="true"
            />
            <div className="container-max section-padding relative">
              <FadeIn>
                <nav className="flex items-center gap-2 text-xs text-steel-500 mb-6" aria-label="Breadcrumb">
                  <Link href="/" className="hover:text-steel-400 transition-colors">
                    Peninsula Pick Ups
                  </Link>
                  <span aria-hidden="true">/</span>
                  <span className="text-bone-300">{area.city}, CA</span>
                </nav>

                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="badge-verify">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.53 2.22a.75.75 0 010 1.06L4.53 7.28a.75.75 0 01-1.06 0L1.47 5.28a.75.75 0 011.06-1.06L4 5.69 7.47 2.22a.75.75 0 011.06 0z"
                      />
                    </svg>
                    {area.county} County
                  </span>
                  {isHomeBase && <span className="badge-orange">Home Base</span>}
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-bone-100 leading-tight tracking-tight mb-5">
                  Junk Removal in
                  <br />
                  <span
                    style={{
                      background: 'linear-gradient(90deg, #f07030 0%, #e85d1a 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {area.city}, CA
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-steel-300 max-w-2xl leading-relaxed mb-8">
                  {area.summary}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <a href="#quote" className="btn-primary text-lg px-7 py-4">
                    Request Pickup in {area.city}
                  </a>
                  <a href={PHONE_RAW} className="btn-secondary text-lg px-7 py-4">
                    Call {PHONE}
                  </a>
                </div>

                <div className="flex flex-wrap gap-3">
                  {area.services.map((service) => (
                    <span key={service} className="badge-orange text-xs font-medium">
                      {service}
                    </span>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Verify strip */}
          <div className="bg-charcoal-800 border-y border-charcoal-600">
            <div className="container-max section-padding py-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
                {[
                  { label: 'San Carlos, CA 94070', sub: 'Home Base' },
                  { label: 'Established 2021', sub: 'Serving the Peninsula' },
                  { label: PHONE, sub: 'Verified Line', href: PHONE_RAW },
                  { label: 'Don and Melissa', sub: 'Local Owners' },
                  { label: 'Licensed and Insured', sub: 'Professional Service' },
                ].map((item) =>
                  item.href ? (
                    <a key={item.label} href={item.href} className="flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="font-semibold text-orange-400 group-hover:text-orange-300 transition-colors tabular-nums truncate">
                          {item.label}
                        </p>
                        <p className="text-steel-500 text-xs">{item.sub}</p>
                      </div>
                    </a>
                  ) : (
                    <div key={item.label} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="font-semibold text-bone-100 truncate">{item.label}</p>
                        <p className="text-steel-500 text-xs">{item.sub}</p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Services in this city */}
          <div className="bg-charcoal-900 py-20">
            <div className="container-max section-padding">
              <FadeIn>
                <h2 className="text-3xl font-bold text-bone-100 mb-2">
                  Services Available in {area.city}
                </h2>
                <p className="text-steel-400 mb-8">
                  Peninsula Pick Ups provides the following services throughout {area.city}, CA.
                </p>
              </FadeIn>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {area.services.map((service, i) => (
                  <FadeIn key={service} delay={i * 0.06} direction="up">
                    <div className="card-base p-5 flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-verify-500/10 border border-verify-500/20 flex items-center justify-center text-verify-400 flex-shrink-0">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M11.07 3.22a1 1 0 010 1.41L6.11 9.6a1 1 0 01-1.41 0L2.22 7.1a1 1 0 011.41-1.41l1.77 1.77 4.26-4.24a1 1 0 011.41 0z"
                          />
                        </svg>
                      </div>
                      <p className="font-semibold text-bone-100 text-sm">{service}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>

          {/* Nearby areas */}
          {area.nearbyAreas && area.nearbyAreas.length > 0 && (
            <div className="bg-charcoal-800 py-16">
              <div className="container-max section-padding">
                <FadeIn>
                  <h2 className="text-2xl font-bold text-bone-100 mb-6">
                    Also Serving Nearby Areas
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {area.nearbyAreas.map((city) => {
                      const nearbyArea = SERVICE_AREAS.find((a) => a.city === city)
                      return nearbyArea ? (
                        <Link
                          key={city}
                          href={`/${nearbyArea.slug}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-charcoal-700 border border-charcoal-600 hover:border-orange-500/40 text-bone-200 hover:text-white text-sm font-medium transition-all duration-150"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            className="text-orange-400"
                            aria-hidden="true"
                          >
                            <path
                              d="M6 1C4.07 1 2.5 2.57 2.5 4.5c0 2.63 3.5 6.5 3.5 6.5S9.5 7.13 9.5 4.5C9.5 2.57 7.93 1 6 1z"
                              stroke="currentColor"
                              strokeWidth="1.2"
                            />
                            <circle cx="6" cy="4.5" r="1" stroke="currentColor" strokeWidth="1.2" />
                          </svg>
                          {city}, CA
                        </Link>
                      ) : null
                    })}
                  </div>
                </FadeIn>
              </div>
            </div>
          )}

          {/* Quote form */}
          <QuoteForm />

          {/* Back to home */}
          <div className="bg-charcoal-950 py-10 border-t border-charcoal-600">
            <div className="container-max section-padding text-center">
              <Link href="/" className="text-steel-400 hover:text-bone-200 text-sm transition-colors inline-flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to Peninsula Pick Ups
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = SERVICE_AREAS.map((area) => ({
    params: { location: area.slug },
  }))

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<LocationPageProps> = async ({ params }) => {
  const slug = params?.location as string
  const area = getServiceAreaBySlug(slug)

  if (!area) {
    return { notFound: true }
  }

  return {
    props: { area },
  }
}

export default LocationPage
