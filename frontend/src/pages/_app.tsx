import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { DefaultSeo } from 'next-seo'
import { NextIntlClientProvider } from 'next-intl'
import { SITE } from '@/content/site'
import { DEFAULT_LOCALE, LOCALE_META, isLocale, type Locale } from '@/i18n/locales'
import { fontVariablesFor, fontFamilyStyle, inter } from '@/i18n/fonts'
import '@/styles/globals.css'

type NestedMessages = { [key: string]: string | NestedMessages }

interface PageLocaleProps {
  locale?: Locale
  messages?: NestedMessages
}

export default function App({ Component, pageProps }: AppProps<PageLocaleProps>) {
  const router = useRouter()
  // The locale shipped via getStaticProps is authoritative; fall back to the
  // router locale when a page doesn't yet thread getStaticProps through.
  const fallback: Locale = isLocale(router.locale) ? router.locale : DEFAULT_LOCALE
  const activeLocale: Locale = pageProps.locale ?? fallback
  const meta = LOCALE_META[activeLocale]

  // Every page MUST thread localeProps() through getStaticProps. Pages that
  // forget to do so render with an empty messages dict and useTranslations()
  // throws on the first key — that's intentional, fail fast in dev.
  const messages = pageProps.messages ?? {}

  const fontClasses = fontVariablesFor(activeLocale, meta.font)
  const familyStyle = fontFamilyStyle(meta.font)

  return (
    <NextIntlClientProvider
      locale={activeLocale}
      messages={messages}
      timeZone="America/Los_Angeles"
      now={new Date()}
    >
      <div className={`${inter.variable} ${fontClasses}`} style={familyStyle} dir={meta.dir} lang={activeLocale}>
        <DefaultSeo
          openGraph={{ type: 'website', locale: meta.ogLocale, siteName: SITE.name }}
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
    </NextIntlClientProvider>
  )
}
