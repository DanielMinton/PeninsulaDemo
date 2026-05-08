import type { Lead } from './lead-schema'

const TWILIO_VERIFY_BASE = 'https://api.twilio.com/2010-04-01'

interface NotifyResult {
  channel: 'sms' | 'email'
  ok: boolean
  error?: string
}

function summarize(lead: Lead): string {
  const parts: string[] = [
    `New PPU lead: ${lead.name}`,
    `Phone: ${lead.phone}`,
    lead.email ? `Email: ${lead.email}` : null,
    lead.service_location ? `City: ${lead.service_location}` : null,
    lead.service_requested ? `Service: ${lead.service_requested}` : null,
    lead.urgency ? `Urgency: ${lead.urgency}` : null,
    lead.preferred_date ? `Preferred: ${lead.preferred_date}` : null,
    lead.message ? `Notes: ${lead.message}` : null,
  ].filter(Boolean) as string[]
  return parts.join('\n')
}

/** Twilio Programmable SMS via REST. Skipped when env is missing. */
async function sendSms(lead: Lead): Promise<NotifyResult> {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_FROM_NUMBER
  const to = process.env.LEAD_NOTIFY_PHONE
  if (!sid || !token || !from || !to) {
    return { channel: 'sms', ok: false, error: 'sms-not-configured' }
  }
  const body = new URLSearchParams({ To: to, From: from, Body: summarize(lead) })
  const auth = Buffer.from(`${sid}:${token}`).toString('base64')
  try {
    const res = await fetch(`${TWILIO_VERIFY_BASE}/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })
    if (!res.ok) {
      const text = await res.text()
      return { channel: 'sms', ok: false, error: `twilio ${res.status}: ${text.slice(0, 200)}` }
    }
    return { channel: 'sms', ok: true }
  } catch (err) {
    return { channel: 'sms', ok: false, error: err instanceof Error ? err.message : 'sms-error' }
  }
}

/** Resend transactional email. Skipped when env is missing. */
async function sendEmail(lead: Lead): Promise<NotifyResult> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM
  const to = process.env.LEAD_NOTIFY_EMAIL
  if (!apiKey || !from || !to) {
    return { channel: 'email', ok: false, error: 'email-not-configured' }
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `New lead — ${lead.name} (${lead.service_location})`,
        text: summarize(lead),
      }),
    })
    if (!res.ok) {
      const text = await res.text()
      return { channel: 'email', ok: false, error: `resend ${res.status}: ${text.slice(0, 200)}` }
    }
    return { channel: 'email', ok: true }
  } catch (err) {
    return { channel: 'email', ok: false, error: err instanceof Error ? err.message : 'email-error' }
  }
}

export async function notifyLead(lead: Lead): Promise<NotifyResult[]> {
  const settled = await Promise.allSettled([sendSms(lead), sendEmail(lead)])
  return settled.map((r) =>
    r.status === 'fulfilled' ? r.value : { channel: 'sms' as const, ok: false, error: 'rejected' },
  )
}

/** Forward sanitized payload to the Django CRM. Optional in dev. */
export async function storeLead(lead: Lead): Promise<{ ok: boolean; error?: string }> {
  const apiUrl = process.env.LEAD_STORE_URL || `${process.env.NEXT_PUBLIC_API_URL || ''}/api/leads/`
  const internalToken = process.env.LEAD_INTERNAL_TOKEN
  if (!apiUrl) return { ok: false, error: 'store-not-configured' }
  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(internalToken ? { 'X-Internal-Token': internalToken } : {}),
      },
      body: JSON.stringify({
        name: lead.name,
        phone: lead.phone,
        email: lead.email ?? '',
        service_requested: lead.service_requested ?? 'other',
        service_location: lead.service_location,
        load_size: lead.load_size ?? '',
        urgency: lead.urgency ?? 'flexible',
        preferred_date: lead.preferred_date ?? '',
        message: lead.message ?? '',
        source_page: lead.source_page ?? '',
        consent: lead.consent,
      }),
    })
    if (!res.ok) {
      const text = await res.text()
      return { ok: false, error: `store ${res.status}: ${text.slice(0, 200)}` }
    }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'store-error' }
  }
}
