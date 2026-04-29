import { useState } from 'react'
import axios from 'axios'

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
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export function useLeadForm() {
  const [formData, setFormData] = useState<LeadFormData>(INITIAL_DATA)
  const [step, setStep] = useState<FormStep>('service')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  function updateField<K extends keyof LeadFormData>(field: K, value: LeadFormData[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  function resetForm() {
    setFormData(INITIAL_DATA)
    setStep('service')
    setError(null)
    setSubmitted(false)
  }

  async function submitLead(overrides?: Partial<LeadFormData>) {
    setIsSubmitting(true)
    setError(null)

    const payload = {
      ...formData,
      ...overrides,
      source_page: typeof window !== 'undefined' ? window.location.href : '',
    }

    try {
      await axios.post(`${API_URL}/api/leads/`, payload)
      setSubmitted(true)
      setStep('success')
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const data = err.response.data as Record<string, unknown>
        const firstError = Object.values(data)[0]
        setError(
          Array.isArray(firstError)
            ? (firstError[0] as string)
            : 'Something went wrong. Please try again or call (650) 201-1543.'
        )
      } else {
        setError('Unable to submit. Please call us directly at (650) 201-1543.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return { formData, step, setStep, isSubmitting, error, submitted, updateField, submitLead, resetForm }
}
