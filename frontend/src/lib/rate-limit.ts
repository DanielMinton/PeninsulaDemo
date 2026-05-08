import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let hourly: Ratelimit | null = null
let daily: Ratelimit | null = null

/**
 * Initialize Upstash-backed rate limiters once. Returns null when env is missing
 * (dev/local without Upstash) so callers can fall through with a console warning.
 */
function getLimiters(): { hourly: Ratelimit; daily: Ratelimit } | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null
  }
  if (!hourly || !daily) {
    const redis = Redis.fromEnv()
    hourly = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1 h'),
      analytics: true,
      prefix: 'ppu:lead:hourly',
    })
    daily = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '24 h'),
      analytics: true,
      prefix: 'ppu:lead:daily',
    })
  }
  return { hourly, daily }
}

export async function checkLeadRateLimit(ip: string): Promise<{ ok: true } | { ok: false; reason: string }> {
  const limiters = getLimiters()
  if (!limiters) {
    if (process.env.NODE_ENV === 'production') {
      // Fail closed in production to avoid an unbounded form endpoint.
      return { ok: false, reason: 'Rate limiter unavailable' }
    }
    // In dev, allow through.
    return { ok: true }
  }

  const [hourlyResult, dailyResult] = await Promise.all([limiters.hourly.limit(ip), limiters.daily.limit(ip)])
  if (!hourlyResult.success) return { ok: false, reason: 'Hourly limit reached' }
  if (!dailyResult.success) return { ok: false, reason: 'Daily limit reached' }
  return { ok: true }
}
