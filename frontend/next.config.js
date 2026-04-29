/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'thepeninsulapickup.com', 'api.thepeninsulapickup.com'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://thepeninsulapickup.com',
    NEXT_PUBLIC_PHONE: '(650) 201-1543',
    NEXT_PUBLIC_PHONE_RAW: '6502011543',
    NEXT_PUBLIC_ADDRESS: 'San Carlos, CA 94070',
    NEXT_PUBLIC_BUSINESS_NAME: 'Peninsula Pick Ups',
  },
}

module.exports = nextConfig
