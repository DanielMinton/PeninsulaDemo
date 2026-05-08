import type { NextApiRequest, NextApiResponse } from 'next'
import { LeadSchema } from '@/lib/lead-schema'
import { checkLeadRateLimit } from '@/lib/rate-limit'
import { verifyTurnstile } from '@/lib/turnstile'
import { notifyLead, storeLead } from '@/lib/notify'

interface SuccessBody {
  ok: true
}
interface ErrorBody {
  ok: false
  error: string
  fields?: Record<string, string[]>
}

function clientIp(req: NextApiRequest): string {
  const xff = req.headers['x-forwarded-for']
  if (typeof xff === 'string') return xff.split(',')[0].trim()
  if (Array.isArray(xff) && xff.length > 0) return xff[0]
  return req.socket.remoteAddress ?? 'unknown'
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<SuccessBody | ErrorBody>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const ip = clientIp(req)

  // 1. Rate limit (fast reject before parsing).
  const rate = await checkLeadRateLimit(ip)
  if (!rate.ok) {
    return res.status(429).json({ ok: false, error: rate.reason })
  }

  // 2. Parse + validate payload.
  const parsed = LeadSchema.safeParse(req.body)
  if (!parsed.success) {
    const fields: Record<string, string[]> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString() ?? '_'
      fields[key] = [...(fields[key] ?? []), issue.message]
    }
    return res.status(400).json({ ok: false, error: 'Invalid submission', fields })
  }

  const lead = parsed.data

  // 3. Honeypot — Zod allows max:0, so anything here is a bot.
  if (lead.company && lead.company.length > 0) {
    return res.status(400).json({ ok: false, error: 'Submission rejected' })
  }

  // 4. Turnstile siteverify.
  const turnstile = await verifyTurnstile(lead.turnstileToken, ip)
  if (!turnstile.ok) {
    return res.status(400).json({ ok: false, error: 'Verification failed' })
  }

  // 5. Notify (non-blocking: SMS + email both attempted).
  const notifyResults = await notifyLead(lead)
  // Only log to server (no sensitive details echoed back to client).
  if (process.env.NODE_ENV !== 'test') {
    for (const r of notifyResults) {
      if (!r.ok) console.warn(`[lead/notify] ${r.channel} failed:`, r.error)
    }
  }

  // 6. Store (forward to Django CRM).
  const stored = await storeLead(lead)
  if (!stored.ok) {
    // Notification went through; storage failed. Don't tell the user we lost it —
    // the SMS/email is the operational record. Surface to logs for backfill.
    console.error('[lead/store] failed:', stored.error)
  }

  return res.status(200).json({ ok: true })
}
