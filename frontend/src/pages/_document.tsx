import Document, {
  Html,
  Head,
  Main,
  NextScript,
  type DocumentContext,
  type DocumentProps,
} from 'next/document'
import { SITE } from '@/content/site'
import { DEFAULT_LOCALE, LOCALE_META, isLocale, type Locale } from '@/i18n/locales'

interface Props extends DocumentProps {
  resolvedLocale: Locale
}

class PupDocument extends Document<Props> {
  /**
   * Reads the build-time locale from ctx so <Html lang dir> is correct on
   * first byte. Pages Router + i18n config runs this once per (page × locale)
   * during static export — SSG is preserved.
   */
  static async getInitialProps(ctx: DocumentContext) {
    const initial = await Document.getInitialProps(ctx)
    const ctxLocale = ctx.locale
    const resolvedLocale: Locale = isLocale(ctxLocale) ? ctxLocale : DEFAULT_LOCALE
    return { ...initial, resolvedLocale }
  }

  render() {
    const locale = this.props.resolvedLocale
    const meta = LOCALE_META[locale]
    return (
      <Html lang={locale} dir={meta.dir}>
        <Head>
          <meta name="format-detection" content="telephone=yes" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="alternate icon" href="/favicon.ico" />

          {/* IndieWeb-style identity links: each rel="me" anchor names a profile we own. */}
          {SITE.socials.map((s) => (
            <link key={s.id} rel="me" href={s.url} />
          ))}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default PupDocument
