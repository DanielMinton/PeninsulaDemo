import { useState } from 'react'
import { SITE } from '@/content/site'

export interface LeadFormData {
  name: string
  phone: string
  email: string
  service_requested: string
  service_location: string
  load_size: string
  urgency: string
  preferred_date: string
  message: string
  source_page: string
  consent: boolean
  /** Honeypot. Bots will fill this in; real users won't see it. */
  company: string
  /** Cloudflare Turnstile token, set by TurnstileWidget. */
  turnstileToken: string
}

export type FormStep = 'service' | 'load' | 'location' | 'urgency' | 'contact' | 'success'

const INITIAL_DATA: LeadFormData = {
  name: '',
  phone: '',
  email: '',
  service_requested: 'other',
  service_location: '',
  load_size: '',
  urgency: 'flexible',
  preferred_date: '',
  message: '',
  source_page: '',
  consent: false,
  company: '',
  turnstileToken: '',
}

interface ApiError {
  ok: false
  error: string
  fields?: Record<string, string[]>
}

export function useLeadForm() {
  const [formData, setFormData] = useState<LeadFormData>(INITIAL_DATA)
  const [step, setStep] = useState<FormStep>('service')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [submitted, setSubmitted] = useState(false)

  function updateField<K extends keyof LeadFormData>(field: K, value: LeadFormData[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  function resetForm() {
    setFormData(INITIAL_DATA)
    setStep('service')
    setError(null)
    setFieldErrors({})
    setSubmitted(false)
  }

  async function submitLead(overrides?: Partial<LeadFormData>) {
    setIsSubmitting(true)
    setError(null)
    setFieldErrors({})

    const payload = {
      ...formData,
      ...overrides,
      source_page: typeof window !== 'undefined' ? window.location.href : '',
    }

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setSubmitted(true)
        setStep('success')
        return
      }
      const data = (await res.json().catch(() => null)) as ApiError | null
      if (data?.fields) setFieldErrors(data.fields)
      setError(data?.error ?? `Something went wrong. Call us at ${SITE.phone.display}.`)
    } catch {
      setError(`Unable to submit. Please call us directly at ${SITE.phone.display}.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    formData,
    step,
    setStep,
    isSubmitting,
    error,
    fieldErrors,
    submitted,
    updateField,
    submitLead,
    resetForm,
  }
}
