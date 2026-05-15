import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import Layout from '@/components/shared/Layout'
import FadeIn from '@/components/motion/FadeIn'
import QuoteForm from '@/components/shared/QuoteForm'
import FaqSection from '@/components/shared/FaqSection'
import ShareCity from '@/components/shared/ShareCity'
import { AREAS, getAreaBySlug, type Area } from '@/content/areas'
import { getServiceName, getAreaCopy } from '@/content/copy'
import { SITE } from '@/content/site'
import { graph, localBusiness, service as serviceNode, breadcrumbs, faqPage } from '@/lib/schema'
import { pageSeo } from '@/lib/seo'
import { localeProps, type LocaleProps } from '@/i18n/getStaticProps'

interface AreaPageProps extends LocaleProps {
  area: Area
}

const AreaPage: NextPage<AreaPageProps> = ({ area, locale }) => {
  const t = useTranslations()
  const path = `/areas/${area.slug}`
  const areaCopy = getAreaCopy(area.slug, t)
  const schema = graph(
    localBusiness(locale),
    serviceNode('junk-removal', area, locale),
    breadcrumbs([
      { name: SITE.name, url: '/' },
      { name: t('areaPage.breadcrumbServiceAreas'), url: '/#service-areas' },
      { name: `${area.city}, CA`, url: path },
    ], locale),
    ...(areaCopy.faqs.length > 0 ? [faqPage(areaCopy.faqs, locale)] : []),
  )

  return (
    <>
      <NextSeo
        {...pageSeo({
          title: area.seoTitle,
          description: area.seoDescription,
          path,
          ogImagePath: `/api/og?city=${encodeURIComponent(area.slug)}&locale=${encodeURIComponent(locale)}`,
          ogImageAlt: `Junk Removal in ${area.city}, CA — ${SITE.name}`,
        }, locale)}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <Layout>
        <div className="min-h-screen bg-charcoal-900">
          <div className="relative pt-28 pb-20 bg-grid-subtle overflow-hidden" style={{ backgroundColor: '#0f0f0f' }}>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 70% 50% at 10% 20%, rgba(20,184,166,0.06) 0%, transparent 70%)',
              }}
              aria-hidden="true"
            />
            <div className="container-max section-padding relative">
              <FadeIn>
                <nav className="flex items-center gap-2 text-xs text-steel-500 mb-6" aria-label="Breadcrumb">
                  <Link href="/" className="hover:text-steel-400 transition-colors">
                    {SITE.name}
                  </Link>
                  <span aria-hidden="true">/</span>
                  <Link href="/#service-areas" className="hover:text-steel-400 transition-colors">
                    {t('areaPage.breadcrumbServiceAreas')}
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
                    {t('areaPage.countyBadge', { county: area.county })}
                  </span>
                  {area.isHomeBase && <span className="badge-orange">{t('areaPage.homeBaseBadge')}</span>}
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-bone-100 leading-tight tracking-tight mb-5">
                  {t('areaPage.headlinePart1')}
                  <br />
                  <span
                    style={{
                      background: 'linear-gradient(90deg, #5eead4 0%, #14b8a6 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {area.city}, CA
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-steel-300 max-w-2xl leading-relaxed mb-8">{areaCopy.summary}</p>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <a href="#quote" className="btn-primary text-lg px-7 py-4">
                    {t('areaPage.requestPickupIn', { city: area.city })}
                  </a>
                  <a href={SITE.phone.href} className="btn-secondary text-lg px-7 py-4">
                    {t('areaPage.callPrefix')} <span dir="ltr">{SITE.phone.display}</span>
                  </a>
                  <a
                    href={`${SITE.phone.smsHref}?body=${encodeURIComponent(t('areaPage.textMessage', { city: area.city }))}`}
                    className="btn-secondary text-lg px-7 py-4"
                  >
                    {t('areaPage.textUs')}
                  </a>
                </div>

                <ShareCity city={area.city} slug={area.slug} />

                <div className="mt-8 flex flex-wrap gap-3">
                  {area.services.map((slug) => (
                    <span key={slug} className="badge-orange text-xs font-medium">
                      {getServiceName(slug, t)}
                    </span>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>

          <div className="bg-charcoal-800 border-y border-charcoal-600">
            <div className="container-max section-padding py-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
                {[
                  { label: `${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}`, sub: t('areaPage.statHomeBase') },
                  { label: `${t('areaPage.statEstablishedPrefix')} ${SITE.foundedYear}`, sub: t('areaPage.statServingPeninsula') },
                  { label: SITE.phone.display, sub: t('areaPage.statVerifiedLine'), href: SITE.phone.href },
                  { label: `${SITE.owners[0]} and ${SITE.owners[1]}`, sub: t('areaPage.statLocalOwners') },
                  { label: t('areaPage.statLicensedAndInsured'), sub: t('areaPage.statProfessionalService') },
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
                  ),
                )}
              </div>
            </div>
          </div>

          <div className="bg-charcoal-900 py-20">
            <div className="container-max section-padding">
              <FadeIn>
                <h2 className="text-3xl font-bold text-bone-100 mb-2">{t('areaPage.servicesHeading', { city: area.city })}</h2>
                <p className="text-steel-400 mb-8">{t('areaPage.servicesSubhead', { city: area.city })}</p>
              </FadeIn>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {area.services.map((slug, i) => (
                  <FadeIn key={slug} delay={i * 0.06} direction="up">
                    <Link
                      href={`/services/${slug}`}
                      className="card-base card-hover p-5 flex items-center gap-4 block"
                    >
                      <div className="w-8 h-8 rounded-lg bg-verify-500/10 border border-verify-500/20 flex items-center justify-center text-verify-400 flex-shrink-0">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M11.07 3.22a1 1 0 010 1.41L6.11 9.6a1 1 0 01-1.41 0L2.22 7.1a1 1 0 011.41-1.41l1.77 1.77 4.26-4.24a1 1 0 011.41 0z"
                          />
                        </svg>
                      </div>
                      <p className="font-semibold text-bone-100 text-sm">{getServiceName(slug, t)}</p>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>

          {area.nearbyAreas.length > 0 && (
            <div className="bg-charcoal-800 py-16">
              <div className="container-max section-padding">
                <FadeIn>
                  <h2 className="text-2xl font-bold text-bone-100 mb-6">{t('areaPage.nearbyHeading')}</h2>
                  <div className="flex flex-wrap gap-3">
                    {area.nearbyAreas.map((city) => {
                      const nearbyArea = AREAS.find((a) => a.city === city)
                      return nearbyArea ? (
                        <Link
                          key={city}
                          href={`/areas/${nearbyArea.slug}`}
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

          {areaCopy.faqs.length > 0 && (
            <FaqSection
              faqs={areaCopy.faqs}
              heading={t('areaPage.faqHeading', { city: area.city })}
              intro={t('areaPage.faqSubhead', { city: area.city })}
            />
          )}

          <QuoteForm />

          <div className="bg-charcoal-950 py-10 border-t border-charcoal-600">
            <div className="container-max section-padding text-center">
              <Link
                href="/"
                className="text-steel-400 hover:text-bone-200 text-sm transition-colors inline-flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M9 2L4 7l5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {t('areaPage.backToHome')}
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: AREAS.map((area) => ({ params: { city: area.slug } })),
  fallback: false,
})

export const getStaticProps: GetStaticProps<AreaPageProps> = async (ctx) => {
  const slug = ctx.params?.city as string
  const area = getAreaBySlug(slug)
  if (!area) return { notFound: true }
  return { props: { ...localeProps(ctx), area } }
}

export default AreaPage
