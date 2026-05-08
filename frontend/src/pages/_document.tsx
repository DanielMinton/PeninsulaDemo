import { Html, Head, Main, NextScript } from 'next/document'
import { SITE } from '@/content/site'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="format-detection" content="telephone=yes" />

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
