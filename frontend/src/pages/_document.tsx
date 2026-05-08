import { Html, Head, Main, NextScript } from 'next/document'
import { SITE } from '@/content/site'

export default function Document() {
  return (
    <Html lang="en">
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
