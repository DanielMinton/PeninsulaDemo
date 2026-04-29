import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        titleTemplate="%s | Peninsula Pick Ups"
        defaultTitle="Peninsula Pick Ups | Junk Removal & Hauling | San Carlos, CA"
        description="Peninsula Pick Ups provides professional junk removal, hauling, and cleanout services across the San Francisco Peninsula. Licensed and insured. Locally owned by Don and Melissa in San Carlos, CA since 2021. Call (650) 201-1543."
        canonical="https://thepeninsulapickup.com"
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://thepeninsulapickup.com',
          siteName: 'Peninsula Pick Ups',
          title: 'Peninsula Pick Ups | Junk Removal & Hauling | San Carlos, CA',
          description:
            'Licensed junk removal, hauling, and cleanout services across the SF Peninsula. Family owned in San Carlos, CA since 2021. Call (650) 201-1543.',
          images: [
            {
              url: 'https://thepeninsulapickup.com/og-image.jpg',
              width: 1200,
              height: 630,
              alt: 'Peninsula Pick Ups - Junk Removal and Hauling, San Carlos CA',
            },
          ],
        }}
        twitter={{ cardType: 'summary_large_image' }}
        additionalMetaTags={[
          { name: 'viewport', content: 'width=device-width, initial-scale=1' },
          { name: 'theme-color', content: '#0f0f0f' },
          { name: 'geo.region', content: 'US-CA' },
          { name: 'geo.placename', content: 'San Carlos' },
          { name: 'geo.position', content: '37.5074;-122.2585' },
          { name: 'ICBM', content: '37.5074, -122.2585' },
        ]}
        additionalLinkTags={[{ rel: 'icon', href: '/favicon.ico' }]}
      />
      <Component {...pageProps} />
    </>
  )
}
