import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import Layout from '@/components/shared/Layout'
import FadeIn from '@/components/motion/FadeIn'
import QuoteForm from '@/components/shared/QuoteForm'
import FaqSection from '@/components/shared/FaqSection'
import { SERVICES, getServiceBySlug, type Service } from '@/content/services'
import { AREAS } from '@/content/areas'
import { SITE } from '@/content/site'
import { graph, localBusiness, service as serviceNode, breadcrumbs, faqPage } from '@/lib/schema'
import { pageSeo } from '@/lib/seo'

interface ServicePageProps {
  service: Service
}

const ServicePage: NextPage<ServicePageProps> = ({ service }) => {
  const path = `/services/${service.slug}`
  const schema = graph(
    localBusiness(),
    serviceNode(service.slug),
    breadcrumbs([
      { name: SITE.name, url: '/' },
      { name: 'Services', url: '/#services' },
      { name: service.name, url: path },
    ]),
    ...(service.faqs.length > 0 ? [faqPage(service.faqs)] : []),
  )

  return (
    <>
      <NextSeo
        {...pageSeo({
          title: `${service.name} on the SF Peninsula | ${SITE.name} | ${SITE.phone.display}`,
          description: `${service.blurb} Peninsula Pick Ups serves the entire SF Peninsula from ${SITE.address.city}, CA. Call ${SITE.phone.display}.`,
          path,
          ogImagePath: `/api/og?service=${encodeURIComponent(service.slug)}`,
          ogImageAlt: `${service.name} — ${SITE.name}`,
        })}
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
                    Services
                  </Link>
                  <span aria-hidden="true">/</span>
                  <span className="text-bone-300">{service.name}</span>
                </nav>

                <span className="badge-orange mb-4">Service</span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-bone-100 leading-tight tracking-tight mb-5 mt-3">
                  {service.name}
                </h1>
                <p className="text-lg sm:text-xl text-steel-300 max-w-2xl leading-relaxed mb-8">
                  {service.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="#quote" className="btn-primary text-lg px-7 py-4">
                    Request a Quote
                  </a>
                  <a href={SITE.phone.href} className="btn-secondary text-lg px-7 py-4">
                    Call {SITE.phone.display}
                  </a>
                </div>
              </FadeIn>
            </div>
          </section>

          <section className="bg-charcoal-800 py-16 border-y border-charcoal-600">
            <div className="container-max section-padding">
              <FadeIn>
                <h2 className="text-2xl font-bold text-bone-100 mb-2">Cities We Serve</h2>
                <p className="text-steel-400 mb-8">
                  {service.name} is available across every Peninsula Pick Ups service area.
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

          {service.faqs.length > 0 && (
            <FaqSection
              faqs={service.faqs}
              heading={`${service.shortName} FAQ`}
              intro={`Common questions about ${service.name.toLowerCase()} with ${SITE.name}.`}
            />
          )}

          <section className="bg-charcoal-800 py-16 border-y border-charcoal-600">
            <div className="container-max section-padding">
              <FadeIn>
                <h2 className="text-2xl font-bold text-bone-100 mb-6">Other Services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {SERVICES.filter((s) => s.slug !== service.slug).map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className="card-base card-hover p-5 block"
                    >
                      <p className="font-bold text-bone-100 text-sm mb-1">{s.name}</p>
                      <p className="text-steel-400 text-xs leading-relaxed line-clamp-2">{s.blurb}</p>
                    </Link>
                  ))}
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

export const getStaticProps: GetStaticProps<ServicePageProps> = async ({ params }) => {
  const slug = params?.slug as string
  const service = getServiceBySlug(slug)
  if (!service) return { notFound: true }
  return { props: { service } }
}

export default ServicePage
