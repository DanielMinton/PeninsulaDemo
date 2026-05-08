import type { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import Layout from '@/components/shared/Layout'
import FadeIn from '@/components/motion/FadeIn'
import { SITE } from '@/content/site'
import { graph, organization, localBusiness, breadcrumbs } from '@/lib/schema'
import { pageSeo } from '@/lib/seo'

const FACTS = [
  { label: 'Legal name', value: SITE.legalName },
  { label: 'Domain', value: 'thepeninsulapickup.com' },
  { label: 'Verified phone', value: SITE.phone.display, href: SITE.phone.href },
  {
    label: 'Address',
    value: `${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}`,
  },
  { label: 'Owners', value: `${SITE.owners[0]} and ${SITE.owners[1]}` },
  { label: 'Founded', value: String(SITE.foundedYear) },
  { label: 'Licensed and insured', value: 'Yes' },
] as const

const Verify: NextPage = () => {
  const path = '/verify'
  const schema = graph(
    organization(),
    localBusiness(),
    breadcrumbs([
      { name: SITE.name, url: '/' },
      { name: 'Verify', url: path },
    ]),
  )

  return (
    <>
      <NextSeo
        {...pageSeo({
          title: `Verify | ${SITE.name} | The legitimate Peninsula Pick Ups`,
          description: `${SITE.name} operates from ${SITE.url} under verified business line ${SITE.phone.display}. This page documents our identity across every legitimate profile.`,
          path,
          ogImageAlt: `${SITE.name} — Identity Verification`,
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
                  'radial-gradient(ellipse 60% 45% at 50% 0%, rgba(34,197,126,0.08) 0%, transparent 70%)',
              }}
              aria-hidden="true"
            />
            <div className="container-max section-padding relative max-w-4xl">
              <FadeIn>
                <nav className="flex items-center gap-2 text-xs text-steel-500 mb-6" aria-label="Breadcrumb">
                  <Link href="/" className="hover:text-steel-400 transition-colors">
                    {SITE.name}
                  </Link>
                  <span aria-hidden="true">/</span>
                  <span className="text-bone-300">Verify</span>
                </nav>

                <span className="badge-verify mb-4">Verified Identity</span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-bone-100 leading-tight tracking-tight mt-3 mb-5">
                  This is the
                  <br />
                  <span
                    style={{
                      background: 'linear-gradient(90deg, #22c57e 0%, #4ade90 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    legitimate {SITE.name}.
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-steel-300 max-w-2xl leading-relaxed">
                  Public-record verification for the family-owned junk removal and hauling business based in{' '}
                  {SITE.address.city}, CA since {SITE.foundedYear}.
                </p>
              </FadeIn>
            </div>
          </section>

          <section className="bg-charcoal-800 py-12 border-y border-charcoal-600">
            <div className="container-max section-padding max-w-4xl">
              <FadeIn>
                <h2 className="text-xl font-bold text-bone-100 mb-6">Business of Record</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
                  {FACTS.map((fact) => (
                    <div key={fact.label} className="flex flex-col gap-1">
                      <dt className="text-xs font-semibold uppercase tracking-widest text-steel-500">{fact.label}</dt>
                      <dd className="text-bone-100 text-base font-semibold">
                        {'href' in fact && fact.href ? (
                          <a
                            href={fact.href}
                            className="text-orange-400 hover:text-orange-300 transition-colors"
                          >
                            {fact.value}
                          </a>
                        ) : (
                          fact.value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </FadeIn>
            </div>
          </section>

          <section className="bg-charcoal-900 py-12">
            <div className="container-max section-padding max-w-4xl">
              <FadeIn>
                <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 flex-shrink-0">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path
                          d="M10 1.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17zm0 4.5v5m0 3.5h.01"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-bone-100 text-lg mb-2">A note on imposter sites</h3>
                      <p className="text-steel-300 text-sm leading-relaxed">{SITE.imposterNote}</p>
                      <p className="text-steel-400 text-xs leading-relaxed mt-3">
                        If you reached us through a different domain or phone number and are not sure which one is real,
                        the answer is simple: this site ({SITE.url}) and the verified business line{' '}
                        <a href={SITE.phone.href} className="text-orange-400 font-semibold">
                          {SITE.phone.display}
                        </a>{' '}
                        are the {SITE.name} operated by {SITE.owners[0]} and {SITE.owners[1]} from{' '}
                        {SITE.address.city}, CA.
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </section>

          <section className="bg-charcoal-800 py-16 border-t border-charcoal-600">
            <div className="container-max section-padding max-w-4xl">
              <FadeIn>
                <h2 className="text-2xl font-bold text-bone-100 mb-2">Profiles &amp; Reviews of Record</h2>
                <p className="text-steel-400 text-sm mb-8">
                  Every link below is a published profile we operate. These are the canonical destinations cited by our
                  schema and by every page on this site.
                </p>
              </FadeIn>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SITE.socials.map((s, i) => (
                  <FadeIn key={s.id} delay={i * 0.04} direction="up">
                    <a
                      href={s.url}
                      target="_blank"
                      rel="me noopener noreferrer"
                      className="card-base card-hover p-5 flex items-start gap-4 block"
                    >
                      <div className="w-10 h-10 rounded-lg bg-charcoal-700 border border-charcoal-500 flex items-center justify-center text-bone-200 flex-shrink-0 text-xs font-bold uppercase">
                        {s.label.slice(0, 2)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-bone-100 text-sm">{s.label}</p>
                        <p className="text-steel-500 text-xs mt-0.5">{s.handle}</p>
                        <p className="text-orange-400 text-xs mt-2 truncate">{s.url.replace(/^https?:\/\//, '')}</p>
                      </div>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="text-steel-500 flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 11L11 3M11 3H6M11 3v5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-charcoal-900 py-16">
            <div className="container-max section-padding max-w-4xl">
              <FadeIn>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-bone-100 mb-3">Need to confirm something live?</h2>
                  <p className="text-steel-400 text-sm mb-6 max-w-xl mx-auto">
                    {SITE.owners[0]} or {SITE.owners[1]} answers the verified business line directly during business
                    hours, Monday through Saturday.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a href={SITE.phone.href} className="btn-primary justify-center">
                      Call {SITE.phone.display}
                    </a>
                    <a href={SITE.phone.smsHref} className="btn-secondary justify-center">
                      Text Us
                    </a>
                  </div>
                </div>
              </FadeIn>
            </div>
          </section>
        </div>
      </Layout>
    </>
  )
}

export default Verify
