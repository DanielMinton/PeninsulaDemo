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
import { useTranslations } from 'next-intl'
import { SITE } from '@/content/site'
import { graph, organization, localBusiness, faqPage } from '@/lib/schema'
import { pageSeo } from '@/lib/seo'
import { localeProps, type LocaleProps } from '@/i18n/getStaticProps'
import { getHomepageFaqs } from '@/content/copy'

const Home: NextPage<LocaleProps> = ({ locale }) => {
  const t = useTranslations()
  const homepageFaqs = getHomepageFaqs(t)
  const schema = graph(organization(locale), localBusiness(locale), faqPage(homepageFaqs, locale))

  return (
    <>
      <NextSeo
        {...pageSeo({
          title: t('meta.home.title'),
          description: t('meta.home.description'),
          path: '/',
          ogImageAlt: t('meta.home.ogAlt'),
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
        <FaqSection faqs={homepageFaqs} />
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps<LocaleProps> = async (ctx) => ({
  props: { ...localeProps(ctx) },
})

export default Home
