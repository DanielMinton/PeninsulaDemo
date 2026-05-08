import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'
import { AREAS } from '@/content/areas'
import { SERVICES } from '@/content/services'
import { SITE } from '@/content/site'

export const config = { runtime: 'edge' }

const SITE_HOST = SITE.url.replace(/^https?:\/\//, '')
const PHONE = SITE.phone.display

const CITY_SLUGS: ReadonlySet<string> = new Set(AREAS.map((a) => a.slug))
const SERVICE_SLUGS: ReadonlySet<string> = new Set(SERVICES.map((s) => s.slug))

// Whitelist of valid OG locales — must mirror src/i18n/locales.ts.
// Inlined here because /api/og runs on the Edge runtime and cannot import
// the TypeScript types module at request time.
const VALID_LOCALES: ReadonlySet<string> = new Set([
  'en', 'es-MX', 'zh-Hans', 'ja', 'ko', 'vi', 'fil',
  'pt-BR', 'ru', 'th', 'km', 'ur', 'to', 'yi', 'ga',
])

function notFound() {
  return new Response('Not Found', { status: 404, headers: { 'content-type': 'text/plain' } })
}

interface CardCopy {
  headline: string[]
  sub: string
}

function copyFor(citySlug: string | null, serviceSlug: string | null): CardCopy {
  if (citySlug) {
    const area = AREAS.find((a) => a.slug === citySlug)
    if (!area) return { headline: ['The Pickup', 'You Can Count On.'], sub: 'Junk removal, hauling & cleanouts' }
    return {
      headline: [`Junk Removal in`, `${area.city}, CA`],
      sub: `Serving ${area.city} and the entire SF Peninsula`,
    }
  }
  if (serviceSlug) {
    const svc = SERVICES.find((s) => s.slug === serviceSlug)
    if (!svc) return { headline: ['The Pickup', 'You Can Count On.'], sub: 'Junk removal, hauling & cleanouts' }
    return {
      headline: [svc.name, `On the SF Peninsula`],
      sub: svc.blurb.length > 70 ? svc.blurb.slice(0, 70).trim() + '…' : svc.blurb,
    }
  }
  return { headline: ['The Pickup', 'You Can Count On.'], sub: `Junk removal, hauling & cleanouts — ${SITE.address.city}, ${SITE.address.region}` }
}

export default function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const city = searchParams.get('city')
  const serviceParam = searchParams.get('service')
  const localeParam = searchParams.get('locale')

  if (city && !CITY_SLUGS.has(city)) return notFound()
  if (serviceParam && !SERVICE_SLUGS.has(serviceParam)) return notFound()
  if (localeParam && !VALID_LOCALES.has(localeParam)) return notFound()

  // The OG card text stays English by design: the OG image is consumed
  // primarily by social platform previews and link-unfurlers, where English
  // content is fine and where Satori font subsetting per-locale would
  // require a much heavier asset pipeline. Locale tagging here is for
  // future per-locale OG variants; treat as a placeholder until a cultural
  // OG-card pass is scoped. Logged in SHIPLOG_I18N.md.
  void localeParam

  const { headline, sub } = copyFor(city, serviceParam)

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0f0f0f',
          padding: '56px 64px',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            left: '-80px',
            width: '560px',
            height: '380px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(232,93,26,0.22) 0%, transparent 68%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            right: '-60px',
            width: '400px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(232,93,26,0.07) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '44px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              backgroundColor: '#e85d1a',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
              <path d="M3 12L8 4L13 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5.5 12H10.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#faf8f5', fontSize: '19px', fontWeight: 700 }}>{SITE.name}</span>
            <span style={{ color: '#6b7585', fontSize: '13px', marginTop: '1px' }}>
              {SITE.address.city}, {SITE.address.region} · Est. {SITE.foundedYear}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          <div style={{ display: 'flex', marginBottom: '22px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                backgroundColor: 'rgba(34,197,126,0.08)',
                border: '1px solid rgba(34,197,126,0.28)',
                borderRadius: '100px',
                padding: '5px 14px',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M10.5 3L4.5 9 1.5 6" stroke="#22c57e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ color: '#22c57e', fontSize: '13px', fontWeight: 600 }}>
                Licensed &amp; Insured · Family Owned
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '18px' }}>
            {headline.map((line, i) => (
              <span
                key={i}
                style={{
                  fontSize: city || serviceParam ? '76px' : '80px',
                  fontWeight: 900,
                  lineHeight: 1.02,
                  letterSpacing: '-2.5px',
                  color: i === 1 ? '#e85d1a' : '#faf8f5',
                  display: 'flex',
                }}
              >
                {line}
              </span>
            ))}
          </div>

          <span style={{ color: '#8a96a8', fontSize: '22px', fontWeight: 400, display: 'flex' }}>{sub}</span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #242424',
            paddingTop: '22px',
            marginTop: '28px',
          }}
        >
          <span style={{ color: '#e85d1a', fontSize: '26px', fontWeight: 900 }}>{PHONE}</span>

          <div style={{ display: 'flex', gap: '10px' }}>
            {['Junk Removal', 'Hauling', 'Cleanouts'].map((tag) => (
              <span
                key={tag}
                style={{
                  color: '#515d6e',
                  fontSize: '13px',
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #2e2e2e',
                  borderRadius: '6px',
                  padding: '4px 11px',
                  display: 'flex',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <span style={{ color: '#3a3a3a', fontSize: '15px', display: 'flex' }}>{SITE_HOST}</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { 'cache-control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800' },
    },
  )
}
