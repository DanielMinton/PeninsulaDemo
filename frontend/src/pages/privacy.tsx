import type { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import Layout from '@/components/shared/Layout'

const Privacy: NextPage = () => {
  return (
    <>
      <NextSeo
        title="Privacy Policy"
        description="Privacy policy for Peninsula Pick Ups. Learn how we handle your contact information submitted through our quote request forms."
        noindex={false}
        canonical="https://thepeninsulapickup.com/privacy"
      />
      <Layout>
        <div className="min-h-screen bg-charcoal-900 pt-28 pb-20">
          <div className="container-max section-padding max-w-3xl">
            <nav className="flex items-center gap-2 text-xs text-steel-500 mb-8" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-steel-400 transition-colors">
                Peninsula Pick Ups
              </Link>
              <span>/</span>
              <span className="text-bone-300">Privacy Policy</span>
            </nav>

            <h1 className="text-4xl font-black text-bone-100 mb-4">Privacy Policy</h1>
            <p className="text-steel-400 text-sm mb-10">Last updated: 2026</p>

            <div className="prose prose-invert max-w-none space-y-8 text-steel-300 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-bone-100 mb-3">About This Policy</h2>
                <p>
                  Peninsula Pick Ups operates thepeninsulapickup.com. This policy explains how we handle information
                  submitted through our website.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-bone-100 mb-3">Information We Collect</h2>
                <p>
                  When you submit a quote request or contact form, we collect your name, phone number, email address
                  (if provided), service location, and the details of your service request. This information is used
                  only to respond to your inquiry.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-bone-100 mb-3">How We Use Your Information</h2>
                <p>
                  We use your contact information solely to follow up on your quote request and schedule service with
                  Peninsula Pick Ups. We do not sell, rent, or share your information with third parties.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-bone-100 mb-3">Contact</h2>
                <p>
                  For questions about this policy, contact Peninsula Pick Ups directly at{' '}
                  <a href="tel:+16502011543" className="text-orange-400 hover:text-orange-300 transition-colors">
                    (650) 201-1543
                  </a>
                  . San Carlos, CA 94070.
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

export default Privacy
