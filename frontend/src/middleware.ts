import { NextResponse, type NextRequest } from 'next/server'

/**
 * Security headers for every request.
 *
 * CSP intentionally allows 'unsafe-inline' for script-src and style-src.
 * Reason: this is a Pages-Router app that emits inline JSON-LD via
 * `getStaticProps` — there is no per-request render to thread a CSP nonce
 * through. Threading nonces would require moving every page off SSG
 * (or pre-computing hashes at build time), which is out of scope for the
 * recovery sprint. Logged in DECISIONS.md. Everything else (frame-ancestors,
 * connect-src, form-action, etc.) is locked down strictly.
 */
const isProductionDeploy =
  process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production'

// Dev needs 'unsafe-eval' for webpack HMR and ws: for the dev WebSocket. Prod stays strict.
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

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  response.headers.set('Content-Security-Policy', CSP)

  // Block indexing of preview/branch deployments and any non-canonical host.
  // The canonical host is the apex domain in NEXT_PUBLIC_SITE_URL.
  const host = request.headers.get('host') ?? ''
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
