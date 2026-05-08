import type { GetServerSideProps } from 'next'
import { absoluteUrl } from '@/content/site'

const isProductionDeploy =
  process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production'

function buildRobots(): string {
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') {
    // Preview environment: explicitly disallow everything.
    return [
      'User-agent: *',
      'Disallow: /',
      '',
      `# Preview environment — production lives at ${absoluteUrl('/')}`,
    ].join('\n')
  }
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /dashboard',
    '',
    `Sitemap: ${absoluteUrl('/sitemap.xml')}`,
    `Host: ${absoluteUrl('/').replace(/\/$/, '')}`,
  ].join('\n')
}

export default function RobotsTxt() {
  return null
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  res.write(buildRobots())
  res.end()
  return { props: {} }
}

void isProductionDeploy
