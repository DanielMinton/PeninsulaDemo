'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { SITE, absoluteUrl } from '@/content/site'

interface Props {
  city: string
  slug: string
}

export default function ShareCity({ city, slug }: Props) {
  const t = useTranslations()
  const [copied, setCopied] = useState(false)
  const url = absoluteUrl(`/areas/${slug}`)
  const text = t('shareCity.shareText', { city })

  async function handleShare() {
    const data = { title: SITE.name, text, url }
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share(data)
        return
      } catch {
        // user dismissed — fall through to copy
      }
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(`${text} ${url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-2 text-xs font-medium text-steel-400 hover:text-bone-200 transition-colors"
      aria-live="polite"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path
          d="M3 7v4a1 1 0 001 1h6a1 1 0 001-1V7M7 1.5v7M4.5 4L7 1.5 9.5 4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {copied ? t('shareCity.copied') : t('shareCity.shareLabel', { city })}
    </button>
  )
}
