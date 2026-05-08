/**
 * Cloudflare Turnstile siteverify. Returns ok=true when the env is missing
 * in development (so the form keeps working without a Turnstile account)
 * and fails closed in production.
 */
export async function verifyTurnstile(token: string | undefined, ip: string | null): Promise<{ ok: true } | { ok: false; reason: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      return { ok: false, reason: 'turnstile-not-configured' }
    }
    return { ok: true }
  }
  if (!token) return { ok: false, reason: 'turnstile-missing-token' }

  const params = new URLSearchParams({ secret, response: token })
  if (ip) params.set('remoteip', ip)

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: params,
    })
    if (!res.ok) return { ok: false, reason: `turnstile-http-${res.status}` }
    const data = (await res.json()) as { success: boolean; 'error-codes'?: string[] }
    if (!data.success) {
      return { ok: false, reason: `turnstile-failed: ${(data['error-codes'] || []).join(',')}` }
    }
    return { ok: true }
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : 'turnstile-error' }
  }
}
