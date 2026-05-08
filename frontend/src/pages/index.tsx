import type { GetStaticProps, NextPage } from 'next'
import dynamic from 'next/dynamic'
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

// SSR-rendered so the SVG ships in static HTML for SEO + zero CLS;
// JS hydrates after LCP for the hover/focus interactions.
const PeninsulaMap = dynamic(() => import('@/components/map/PeninsulaMap'), { ssr: true })
import { SITE } from '@/content/site'
import { HOMEPAGE_FAQS } from '@/content/faqs'
import { graph, organization, localBusiness, faqPage } from '@/lib/schema'
import { pageSeo } from '@/lib/seo'
import { localeProps, type LocaleProps } from '@/i18n/getStaticProps'

const Home: NextPage<LocaleProps> = ({ locale }) => {
  const schema = graph(organization(locale), localBusiness(locale), faqPage(HOMEPAGE_FAQS, locale))

  return (
    <>
      <NextSeo
        {...pageSeo({
          title: `${SITE.name} | Junk Removal & Hauling | ${SITE.address.city}, ${SITE.address.region}`,
          description: `${SITE.name} provides junk removal, hauling, cleanouts, and construction debris removal across the SF Peninsula. Locally owned by ${SITE.owners[0]} and ${SITE.owners[1]} in ${SITE.address.city} since ${SITE.foundedYear}. Call ${SITE.phone.display}.`,
          path: '/',
          ogImageAlt: `${SITE.name} — Junk Removal & Hauling, ${SITE.address.city}, ${SITE.address.region}`,
        }, locale)}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <Layout>
        <HeroSection />
        <VerifyStrip />
        <PeninsulaMap />
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

export const getStaticProps: GetStaticProps<LocaleProps> = async (ctx) => ({
  props: { ...localeProps(ctx) },
})

export default Home
