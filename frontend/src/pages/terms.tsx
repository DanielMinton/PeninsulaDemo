import type { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import Layout from '@/components/shared/Layout'

const Terms: NextPage = () => {
  return (
    <>
      <NextSeo
        title="Terms of Service"
        description="Terms of service for Peninsula Pick Ups, a junk removal and hauling service based in San Carlos, CA."
        noindex={false}
        canonical="https://thepeninsulapickup.com/terms"
      />
      <Layout>
        <div className="min-h-screen bg-charcoal-900 pt-28 pb-20">
          <div className="container-max section-padding max-w-3xl">
            <nav className="flex items-center gap-2 text-xs text-steel-500 mb-8" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-steel-400 transition-colors">
                Peninsula Pick Ups
              </Link>
              <span>/</span>
              <span className="text-bone-300">Terms of Service</span>
            </nav>

            <h1 className="text-4xl font-black text-bone-100 mb-4">Terms of Service</h1>
            <p className="text-steel-400 text-sm mb-10">Last updated: 2026</p>

            <div className="prose prose-invert max-w-none space-y-8 text-steel-300 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-bone-100 mb-3">Service Agreement</h2>
                <p>
                  By using thepeninsulapickup.com and requesting services from Peninsula Pick Ups, you agree to these
                  terms. Peninsula Pick Ups is a licensed junk removal and hauling business based in San Carlos, CA
                  94070.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-bone-100 mb-3">Quote Requests</h2>
                <p>
                  Submitting a quote request through this website constitutes a request for service information only.
                  No binding service agreement is created until Peninsula Pick Ups provides a written or verbal quote
                  and both parties confirm the job.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-bone-100 mb-3">Service Availability</h2>
                <p>
                  Peninsula Pick Ups serves communities across the San Francisco Peninsula. Service availability
                  depends on location and scheduling. Contact us at (650) 201-1543 to confirm service for your area.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-bone-100 mb-3">Contact</h2>
                <p>
                  Peninsula Pick Ups. San Carlos, CA 94070.{' '}
                  <a href="tel:+16502011543" className="text-orange-400 hover:text-orange-300 transition-colors">
                    (650) 201-1543
                  </a>
                  . thepeninsulapickup.com.
                </p>
              </section>
            </div>

            <div className="mt-12">
              <Link href="/" className="btn-secondary text-sm">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Terms
