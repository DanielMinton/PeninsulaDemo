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
import FaqSection from '@/components/shared/FaqSection'
import { SITE } from '@/content/site'
import { HOMEPAGE_FAQS } from '@/content/faqs'
import { graph, organization, localBusiness, faqPage } from '@/lib/schema'
import { pageSeo } from '@/lib/seo'

const Home: NextPage = () => {
  const schema = graph(organization(), localBusiness(), faqPage(HOMEPAGE_FAQS))

  return (
    <>
      <NextSeo
        {...pageSeo({
          title: `${SITE.name} | Junk Removal & Hauling | ${SITE.address.city}, ${SITE.address.region}`,
          description: `${SITE.name} provides junk removal, hauling, cleanouts, and construction debris removal across the SF Peninsula. Locally owned by ${SITE.owners[0]} and ${SITE.owners[1]} in ${SITE.address.city} since ${SITE.foundedYear}. Call ${SITE.phone.display}.`,
          path: '/',
          ogImageAlt: `${SITE.name} — Junk Removal & Hauling, ${SITE.address.city}, ${SITE.address.region}`,
        })}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <Layout>
        <HeroSection />
        <VerifyStrip />
        <ServicesGrid />
        <TrustSection />
        <QuoteSelector />
        <GallerySection />
        <ServiceAreasSection />
        <TestimonialsSection />
        <FaqSection faqs={HOMEPAGE_FAQS} />
      </Layout>
    </>
  )
}

export default Home
