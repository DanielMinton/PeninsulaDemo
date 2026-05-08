import type { GetStaticProps, NextPage } from 'next'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import Layout from '@/components/shared/Layout'
import FadeIn from '@/components/motion/FadeIn'
import { localeProps, type LocaleProps } from '@/i18n/getStaticProps'

const PHONE = '(650) 201-1543'
const PHONE_RAW = 'tel:+16502011543'

const DASHBOARD_SECTIONS = [
  {
    title: 'Job Status',
    description: 'Track the status of your current and past Peninsula Pick Ups jobs in real time.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    status: 'Coming Soon',
  },
  {
    title: 'Invoices and Paperwork',
    description: 'Access your job invoices, proof of insurance, and signed service agreements.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6M16 13H8M16 17H8M10 9H8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    status: 'Coming Soon',
  },
  {
    title: 'Before and After Photos',
    description: 'View the project documentation from your cleanout or haul with Peninsula Pick Ups.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M21 15l-5-5L5 21"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    status: 'Coming Soon',
  },
  {
    title: 'Job History',
    description: 'A complete record of all services completed by Peninsula Pick Ups for your property.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    status: 'Coming Soon',
  },
]

const Dashboard: NextPage<LocaleProps> = () => {
  return (
    <>
      <NextSeo
        title="Client Dashboard"
        description="Peninsula Pick Ups client portal. Track your job status, access paperwork, and view project photos."
        noindex={true}
      />

      <Layout>
        <div className="min-h-screen bg-charcoal-900 pt-24 pb-20">
          <div className="container-max section-padding">
            <FadeIn>
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                  <span className="badge-orange">Client Portal</span>
                  <span className="badge-verify">Preview</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-bone-100 mt-4 mb-4">Client Dashboard</h1>
                <p className="text-steel-400 text-lg max-w-xl leading-relaxed">
                  The Peninsula Pick Ups client portal is in development. When complete, you will be able to track jobs,
                  view invoices, and access project documentation here.
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
              {DASHBOARD_SECTIONS.map((section, i) => (
                <FadeIn key={section.title} delay={i * 0.08} direction="up">
                  <div className="card-base p-6 flex items-start gap-5 relative overflow-hidden">
                    <div className="absolute top-3 right-3">
                      <span className="text-xs font-semibold text-steel-500 bg-charcoal-700 border border-charcoal-500 px-2 py-0.5 rounded-full">
                        {section.status}
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 flex-shrink-0">
                      {section.icon}
                    </div>
                    <div className="pe-16">
                      <h2 className="font-bold text-bone-100 text-base mb-1">{section.title}</h2>
                      <p className="text-steel-400 text-sm leading-relaxed">{section.description}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={0.3}>
              <div className="max-w-lg p-8 rounded-2xl bg-charcoal-800 border border-charcoal-600">
                <h2 className="font-bold text-bone-100 text-xl mb-3">Contact Peninsula Pick Ups</h2>
                <p className="text-steel-400 text-sm leading-relaxed mb-6">
                  While the full client portal is being built, reach Don and Melissa directly for job updates, invoices,
                  or any questions about your service.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href={PHONE_RAW} className="btn-primary justify-center">
                    Call {PHONE}
                  </a>
                  <Link href="/#quote" className="btn-secondary justify-center">
                    Request a Pickup
                  </Link>
                </div>
                <div className="mt-5 pt-5 border-t border-charcoal-600">
                  <p className="text-steel-500 text-xs">
                    Peninsula Pick Ups. San Carlos, CA 94070. Licensed and insured.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps<LocaleProps> = async (ctx) => ({
  props: { ...localeProps(ctx) },
})

export default Dashboard
