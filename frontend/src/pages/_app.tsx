import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import { Inter } from 'next/font/google'
import { SITE } from '@/content/site'
import '@/styles/globals.css'

// Self-hosted Inter — eliminates fonts.googleapis.com from the request map and
// lets the CSP omit any external style/font hosts.
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.variable}>
      <DefaultSeo
        defaultTitle={`${SITE.name} | Junk Removal & Hauling | ${SITE.address.city}, ${SITE.address.region}`}
        titleTemplate={`%s | ${SITE.name}`}
        openGraph={{ type: 'website', locale: 'en_US', siteName: SITE.name }}
        twitter={{ cardType: 'summary_large_image', site: '@peninsulapickups' }}
        additionalMetaTags={[
          { name: 'viewport', content: 'width=device-width, initial-scale=1' },
          { name: 'theme-color', content: '#0f0f0f' },
          { name: 'geo.region', content: 'US-CA' },
          { name: 'geo.placename', content: SITE.address.city },
          { name: 'geo.position', content: `${SITE.geo.lat};${SITE.geo.lng}` },
          { name: 'ICBM', content: `${SITE.geo.lat}, ${SITE.geo.lng}` },
        ]}
      />
      <Component {...pageProps} />
    </div>
  )
}
