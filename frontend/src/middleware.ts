import { NextResponse, type NextRequest } from 'next/server'
import { match as matchLocale } from '@formatjs/intl-localematcher'

/**
 * Composed middleware: locale detection + security headers.
 *
 * Locale detection precedence (per the i18n spec):
 *   1. Explicit URL prefix (highest).
 *   2. NEXT_LOCALE cookie.
 *   3. Accept-Language header (BCP-47 best-fit).
 *   4. Default to 'en'.
 *
 * The default locale ('en') stays unprefixed; everything else gets a
 * subpath like /zh-Hans/, /ja/, /es-MX/.
 *
 * CSP intentionally allows 'unsafe-inline' for script-src and style-src.
 * Reason: this is a Pages-Router app that emits inline JSON-LD via
 * `getStaticProps` — there is no per-request render to thread a CSP nonce
 * through. Threading nonces would require moving every page off SSG
 * (or pre-computing hashes at build time), which is out of scope for the
 * recovery sprint. Logged in DECISIONS.md.
 */

// Mirror of src/i18n/locales.ts LOCALES. Keep in sync.
const LOCALES = [
  'en',
  'es-MX',
  'zh-Hans',
  'ja',
  'ko',
  'vi',
  'fil',
  'pt-BR',
  'ru',
  'id',
  'nl',
  'de',
  'he',
  'ur',
  'tlh',
] as const
type Locale = (typeof LOCALES)[number]
const DEFAULT_LOCALE: Locale = 'en'

const isProductionDeploy =
  process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production'

const SCRIPT_SRC = isProductionDeploy
  ? "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com"
  : "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com"

const CONNECT_SRC = isProductionDeploy
  ? "connect-src 'self' https://challenges.cloudflare.com"
  : "connect-src 'self' ws: wss: https://challenges.cloudflare.com"

const CSP = [
  "default-src 'self'",
  SCRIPT_SRC,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  CONNECT_SRC,
  "frame-src https://challenges.cloudflare.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  'upgrade-insecure-requests',
].join('; ')

function isKnownLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value)
}

/**
 * Parse Accept-Language into a quality-ordered list of language tags.
 * Trivial inline parser — sidesteps a `negotiator` dep that we don't otherwise need.
 */
function parseAcceptLanguage(header: string): string[] {
  return header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';')
      const qParam = params.find((p) => p.trim().startsWith('q='))
      const q = qParam ? Number(qParam.split('=')[1]) || 0 : 1
      return { tag: tag.trim(), q }
    })
    .filter((e) => e.tag && e.q > 0)
    .sort((a, b) => b.q - a.q)
    .map((e) => e.tag)
}

function pickLocaleFromAcceptLanguage(req: NextRequest): Locale {
  const header = req.headers.get('accept-language') ?? ''
  if (!header) return DEFAULT_LOCALE
  try {
    const wanted = parseAcceptLanguage(header)
    if (wanted.length === 0) return DEFAULT_LOCALE
    const matched = matchLocale(wanted, LOCALES as unknown as string[], DEFAULT_LOCALE)
    return isKnownLocale(matched) ? matched : DEFAULT_LOCALE
  } catch {
    return DEFAULT_LOCALE
  }
}

function pathnameLocale(pathname: string): Locale | null {
  const seg = pathname.split('/')[1]
  return isKnownLocale(seg) ? seg : null
}

function applySecurityHeaders(req: NextRequest, response: NextResponse): NextResponse {
  response.headers.set('Content-Security-Policy', CSP)
  const host = req.headers.get('host') ?? ''
  const canonicalHost = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thepeninsulapickup.com')
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
  const isPreviewEnv = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production'
  const isCanonicalHost = host === canonicalHost
  if (isPreviewEnv || (isProductionDeploy && !isCanonicalHost)) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }
  return response
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // Skip _next, public files, and API routes — locale logic is for page paths.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    /\.(svg|png|jpg|jpeg|gif|ico|webp|css|js|woff|woff2|ttf)$/i.test(pathname)
  ) {
    return applySecurityHeaders(request, NextResponse.next())
  }

  const explicitLocale = pathnameLocale(pathname)
  if (explicitLocale) {
    // URL already locale-prefixed. Refresh the cookie if it disagrees and continue.
    const response = NextResponse.next()
    const cookie = request.cookies.get('NEXT_LOCALE')?.value
    if (cookie !== explicitLocale) {
      response.cookies.set('NEXT_LOCALE', explicitLocale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
        secure: true,
      })
    }
    return applySecurityHeaders(request, response)
  }

  // Path is unprefixed. Determine target locale.
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  const headerLocale = pickLocaleFromAcceptLanguage(request)
  const target: Locale = isKnownLocale(cookieLocale)
    ? cookieLocale
    : headerLocale

  if (target === DEFAULT_LOCALE) {
    // Default locale stays unprefixed. Just continue.
    return applySecurityHeaders(request, NextResponse.next())
  }

  // Redirect to the locale-prefixed URL so the URL is the source of truth.
  const url = request.nextUrl.clone()
  url.pathname = `/${target}${pathname === '/' ? '' : pathname}`
  url.search = search
  const response = NextResponse.redirect(url)
  response.cookies.set('NEXT_LOCALE', target, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    secure: true,
  })
  return applySecurityHeaders(request, response)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (build assets)
     * - _next/image (Image Optimization API)
     * - favicon.ico, robots.txt, sitemap.xml (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
