import { useEffect } from 'react'
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

  /**
   * Performance.mark/measure for locale switches.
   * LocalePicker marks `pup.locale.switch.start` on click. Here we mark
   * `pup.locale.switch.paint` after the next paint following routeChangeComplete,
   * then measure between them. The measure entry shows up in DevTools >
   * Performance and any tracing tool that reads the User Timing API.
   */
  useEffect(() => {
    const onComplete = () => {
      if (typeof performance === 'undefined' || typeof performance.mark !== 'function') return
      // Wait one frame so the new locale's paint is committed before we mark.
      requestAnimationFrame(() => {
        try {
          performance.mark('pup.locale.switch.paint')
          performance.measure(
            'pup.locale.switch',
            'pup.locale.switch.start',
            'pup.locale.switch.paint',
          )
          const entries = performance.getEntriesByName('pup.locale.switch', 'measure')
          const last = entries[entries.length - 1]
          if (last && process.env.NODE_ENV !== 'production') {
            console.log(`[i18n] locale switch: ${last.duration.toFixed(1)}ms`)
          }
        } catch {
          /* mark wasn't set — not a locale switch, ignore */
        }
      })
    }
    router.events.on('routeChangeComplete', onComplete)
    return () => router.events.off('routeChangeComplete', onComplete)
  }, [router.events])

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
