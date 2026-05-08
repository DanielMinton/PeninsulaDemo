'use client'
import { useCallback, useEffect, useRef } from 'react'

interface TurnstileApi {
  render: (
    container: HTMLElement,
    opts: { sitekey: string; callback: (token: string) => void; theme?: 'auto' | 'light' | 'dark'; size?: 'normal' | 'compact' | 'invisible' },
  ) => string
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}
declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

interface Props {
  /** Called with a fresh token on success, or null on reset. */
  onToken: (token: string | null) => void
}

const SCRIPT_ID = 'cf-turnstile-script'

export default function TurnstileWidget({ onToken }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  const render = useCallback(() => {
    if (!siteKey || !containerRef.current || !window.turnstile || widgetIdRef.current) return
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: 'dark',
      callback: (token) => onToken(token),
    })
  }, [siteKey, onToken])

  useEffect(() => {
    if (!siteKey) return

    if (window.turnstile) {
      render()
      return
    }

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
    if (existing) {
      existing.addEventListener('load', render)
      return () => existing.removeEventListener('load', render)
    }

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true
    script.addEventListener('load', render)
    document.head.appendChild(script)

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [siteKey, render])

  if (!siteKey) return null
  return <div ref={containerRef} className="cf-turnstile mt-2" data-theme="dark" />
}
