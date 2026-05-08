'use client'
import { useState, type FormEvent } from 'react'
import axios from 'axios'
import FadeIn from '@/components/motion/FadeIn'
import { AREAS } from '@/content/areas'
import { SERVICES } from '@/content/services'
import { SITE } from '@/content/site'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface FormState {
  name: string
  phone: string
  email: string
  service_requested: string
  service_location: string
  preferred_date: string
  message: string
  consent: boolean
}

const EMPTY: FormState = {
  name: '',
  phone: '',
  email: '',
  service_requested: '',
  service_location: '',
  preferred_date: '',
  message: '',
  consent: false,
}

export default function QuoteForm() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update(field: keyof FormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await axios.post(`${API_URL}/api/leads/`, {
        ...form,
        source_page: typeof window !== 'undefined' ? window.location.href : '',
      })
      setSubmitted(true)
      setForm(EMPTY)
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const data = err.response.data as Record<string, unknown>
        const first = Object.values(data)[0]
        setError(
          Array.isArray(first)
            ? (first[0] as string)
            : `Something went wrong. Call us at ${SITE.phone.display}.`,
        )
      } else {
        setError(`Unable to submit. Please call us directly at ${SITE.phone.display}.`)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="quote" className="bg-charcoal-900 py-24" aria-labelledby="quote-form-heading">
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <FadeIn direction="right">
            <div>
              <span className="badge-orange mb-4">Get a Free Quote</span>
              <h2 id="quote-form-heading" className="section-title mt-3">
                Tell Us About the Job
              </h2>
              <p className="section-subtitle mt-4">
                Fill out the form and {SITE.name} will follow up directly. For faster response, call us at{' '}
                <a href={SITE.phone.href} className="text-orange-400 font-semibold">
                  {SITE.phone.display}
                </a>
                .
              </p>

              <div className="mt-10 space-y-5">
                {[
                  {
                    title: SITE.phone.display,
                    sub: `Verified business line. ${SITE.owners[0]} and ${SITE.owners[1]}.`,
                    href: SITE.phone.href,
                  },
                  {
                    title: `${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}`,
                    sub: `Home base since ${SITE.foundedYear}.`,
                    href: undefined,
                  },
                  {
                    title: 'Same-day response',
                    sub: 'Most jobs scheduled within 48 hours.',
                    href: undefined,
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 flex-shrink-0"
                      aria-hidden="true"
                    >
                      <span className="w-2 h-2 rounded-full bg-orange-400" />
                    </div>
                    <div>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="font-semibold text-orange-400 hover:text-orange-300 transition-colors text-base"
                        >
                          {item.title}
                        </a>
                      ) : (
                        <p className="font-semibold text-bone-100 text-base">{item.title}</p>
                      )}
                      <p className="text-steel-400 text-sm mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="left" delay={0.1}>
            {submitted ? (
              <div className="card-base p-8 text-center">
                <div className="w-16 h-16 bg-verify-500/15 border border-verify-500/30 rounded-full flex items-center justify-center text-verify-400 mx-auto mb-6">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <path
                      d="M5 14l6 6 12-12"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-bone-100 mb-3">Request Submitted</h3>
                <p className="text-steel-400 mb-6">
                  {SITE.name} will be in touch soon. For immediate help, call{' '}
                  <a href={SITE.phone.href} className="text-orange-400 font-semibold">
                    {SITE.phone.display}
                  </a>
                  .
                </p>
                <button onClick={() => setSubmitted(false)} className="btn-secondary text-sm">
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="card-base p-6 sm:p-8">
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="qf-name" className="block text-sm font-medium text-bone-300 mb-1.5">
                        Name <span className="text-orange-500">*</span>
                      </label>
                      <input
                        id="qf-name"
                        type="text"
                        autoComplete="name"
                        required
                        className="input-base"
                        placeholder="Your full name"
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="qf-phone" className="block text-sm font-medium text-bone-300 mb-1.5">
                        Phone <span className="text-orange-500">*</span>
                      </label>
                      <input
                        id="qf-phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        className="input-base"
                        placeholder="(650) 555-0100"
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="qf-email" className="block text-sm font-medium text-bone-300 mb-1.5">
                      Email <span className="text-steel-500 font-normal">(optional)</span>
                    </label>
                    <input
                      id="qf-email"
                      type="email"
                      autoComplete="email"
                      className="input-base"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="qf-service" className="block text-sm font-medium text-bone-300 mb-1.5">
                        Service Needed
                      </label>
                      <select
                        id="qf-service"
                        className="input-base"
                        value={form.service_requested}
                        onChange={(e) => update('service_requested', e.target.value)}
                      >
                        <option value="">Select a service...</option>
                        {SERVICES.map((s) => (
                          <option key={s.slug} value={s.formValue}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="qf-location" className="block text-sm font-medium text-bone-300 mb-1.5">
                        Service Location <span className="text-orange-500">*</span>
                      </label>
                      <select
                        id="qf-location"
                        className="input-base"
                        required
                        value={form.service_location}
                        onChange={(e) => update('service_location', e.target.value)}
                      >
                        <option value="">Select city...</option>
                        {AREAS.map((area) => (
                          <option key={area.slug} value={area.city}>
                            {area.city}, CA
                          </option>
                        ))}
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="qf-date" className="block text-sm font-medium text-bone-300 mb-1.5">
                      Preferred Date <span className="text-steel-500 font-normal">(optional)</span>
                    </label>
                    <input
                      id="qf-date"
                      type="date"
                      className="input-base"
                      value={form.preferred_date}
                      onChange={(e) => update('preferred_date', e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="qf-message" className="block text-sm font-medium text-bone-300 mb-1.5">
                      Message <span className="text-steel-500 font-normal">(optional)</span>
                    </label>
                    <textarea
                      id="qf-message"
                      rows={4}
                      className="input-base resize-none"
                      placeholder="Describe what needs to be removed, any access notes, or specific questions..."
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                    />
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-charcoal-700/50 border border-charcoal-600">
                    <input
                      id="qf-consent"
                      type="checkbox"
                      required
                      className="mt-0.5 w-4 h-4 accent-orange-500 cursor-pointer flex-shrink-0"
                      checked={form.consent}
                      onChange={(e) => update('consent', e.target.checked)}
                    />
                    <label htmlFor="qf-consent" className="text-xs text-steel-400 cursor-pointer leading-relaxed">
                      I agree to be contacted by {SITE.name} regarding my quote request. Business line:{' '}
                      {SITE.phone.display}. This form does not share your information with third parties.
                    </label>
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20" role="alert" aria-live="polite">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || !form.name || !form.phone || !form.service_location || !form.consent}
                    className="btn-primary w-full justify-center py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
                          <path d="M8 2a6 6 0 016 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Sending Request...
                      </span>
                    ) : (
                      'Send Quote Request'
                    )}
                  </button>
                </div>
              </form>
            )}
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
