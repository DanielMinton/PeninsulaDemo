import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import Layout from '@/components/shared/Layout'
import FadeIn from '@/components/motion/FadeIn'
import QuoteForm from '@/components/shared/QuoteForm'
import FaqSection from '@/components/shared/FaqSection'
import { SERVICES, getServiceBySlug, type Service } from '@/content/services'
import { getServiceCopy } from '@/content/copy'
import { AREAS } from '@/content/areas'
import { SITE } from '@/content/site'
import { graph, localBusiness, service as serviceNode, breadcrumbs, faqPage } from '@/lib/schema'
import { pageSeo } from '@/lib/seo'
import { localeProps, type LocaleProps } from '@/i18n/getStaticProps'

interface ServicePageProps extends LocaleProps {
  service: Service
}

const ServicePage: NextPage<ServicePageProps> = ({ service, locale }) => {
  const t = useTranslations()
  const copy = getServiceCopy(service.slug, t)
  const path = `/services/${service.slug}`
  const schema = graph(
    localBusiness(locale),
    serviceNode(service.slug, undefined, locale),
    breadcrumbs([
      { name: SITE.name, url: '/' },
      { name: t('servicePage.breadcrumbServices'), url: '/#services' },
      { name: copy.name, url: path },
    ], locale),
    ...(copy.faqs.length > 0 ? [faqPage(copy.faqs, locale)] : []),
  )

  return (
    <>
      <NextSeo
        {...pageSeo({
          title: `${service.name} on the SF Peninsula | ${SITE.name} | ${SITE.phone.display}`,
          description: `${service.blurb} Peninsula Pick Ups serves the entire SF Peninsula from ${SITE.address.city}, CA. Call ${SITE.phone.display}.`,
          path,
          ogImagePath: `/api/og?service=${encodeURIComponent(service.slug)}&locale=${encodeURIComponent(locale)}`,
          ogImageAlt: `${service.name} — ${SITE.name}`,
        }, locale)}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <Layout>
        <div className="min-h-screen bg-charcoal-900">
          <section className="relative pt-28 pb-16 bg-grid-subtle overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 70% 50% at 80% 30%, rgba(232,93,26,0.06) 0%, transparent 70%)',
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
                  <Link href="/#services" className="hover:text-steel-400 transition-colors">
                    {t('servicePage.breadcrumbServices')}
                  </Link>
                  <span aria-hidden="true">/</span>
                  <span className="text-bone-300">{copy.name}</span>
                </nav>

                <span className="badge-orange mb-4">{t('servicePage.serviceBadge')}</span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-bone-100 leading-tight tracking-tight mb-5 mt-3">
                  {copy.name}
                </h1>
                <p className="text-lg sm:text-xl text-steel-300 max-w-2xl leading-relaxed mb-8">
                  {copy.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="#quote" className="btn-primary text-lg px-7 py-4">
                    {t('servicePage.requestQuote')}
                  </a>
                  <a href={SITE.phone.href} className="btn-secondary text-lg px-7 py-4">
                    {t('servicePage.callPrefix')} <span dir="ltr">{SITE.phone.display}</span>
                  </a>
                </div>
              </FadeIn>
            </div>
          </section>

          <section className="bg-charcoal-800 py-16 border-y border-charcoal-600">
            <div className="container-max section-padding">
              <FadeIn>
                <h2 className="text-2xl font-bold text-bone-100 mb-2">{t('servicePage.citiesWeServeHeading')}</h2>
                <p className="text-steel-400 mb-8">
                  {t('servicePage.citiesWeServeSubhead', { service: copy.name })}
                </p>
              </FadeIn>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {AREAS.map((area, i) => (
                  <FadeIn key={area.slug} delay={i * 0.04} direction="up">
                    <Link
                      href={`/areas/${area.slug}`}
                      className="card-base card-hover p-4 flex items-center gap-3 block"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          area.isHomeBase ? 'bg-orange-500' : 'bg-orange-400/60'
                        }`}
                        aria-hidden="true"
                      />
                      <span className="font-semibold text-bone-100 text-sm">{area.city}</span>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>

          {copy.faqs.length > 0 && (
            <FaqSection
              faqs={copy.faqs}
              heading={t('servicePage.faqHeading', { service: copy.shortName })}
              intro={t('servicePage.faqSubhead', { service: copy.name.toLowerCase() })}
            />
          )}

          <section className="bg-charcoal-800 py-16 border-y border-charcoal-600">
            <div className="container-max section-padding">
              <FadeIn>
                <h2 className="text-2xl font-bold text-bone-100 mb-6">{t('servicePage.otherServicesHeading')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {SERVICES.filter((s) => s.slug !== service.slug).map((s) => {
                    const sc = getServiceCopy(s.slug, t)
                    return (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className="card-base card-hover p-5 block"
                      >
                        <p className="font-bold text-bone-100 text-sm mb-1">{sc.name}</p>
                        <p className="text-steel-400 text-xs leading-relaxed line-clamp-2">{sc.blurb}</p>
                      </Link>
                    )
                  })}
                </div>
              </FadeIn>
            </div>
          </section>

          <QuoteForm />
        </div>
      </Layout>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: SERVICES.map((s) => ({ params: { slug: s.slug } })),
  fallback: false,
})

export const getStaticProps: GetStaticProps<ServicePageProps> = async (ctx) => {
  const slug = ctx.params?.slug as string
  const service = getServiceBySlug(slug)
  if (!service) return { notFound: true }
  return { props: { ...localeProps(ctx), service } }
}

export default ServicePage
