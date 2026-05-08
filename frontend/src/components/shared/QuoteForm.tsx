'use client'
import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import FadeIn from '@/components/motion/FadeIn'
import TurnstileWidget from '@/components/shared/TurnstileWidget'
import { AREAS } from '@/content/areas'
import { SERVICES } from '@/content/services'
import { getServiceName } from '@/content/copy'
import { SITE } from '@/content/site'

interface FormState {
  name: string
  phone: string
  email: string
  service_requested: string
  service_location: string
  preferred_date: string
  message: string
  consent: boolean
  /** Honeypot — must remain empty. */
  company: string
  turnstileToken: string
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
  company: '',
  turnstileToken: '',
}

interface ApiError {
  ok: false
  error: string
  fields?: Record<string, string[]>
}

const turnstileRequired = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

export default function QuoteForm() {
  const t = useTranslations()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function fieldError(name: string): string | undefined {
    return fieldErrors[name]?.[0]
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setFieldErrors({})

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          source_page: typeof window !== 'undefined' ? window.location.href : '',
        }),
      })
      if (res.ok) {
        setSubmitted(true)
        setForm(EMPTY)
        return
      }
      const data = (await res.json().catch(() => null)) as ApiError | null
      if (data?.fields) setFieldErrors(data.fields)
      setError(data?.error ?? t('quoteForm.errorFallback'))
    } catch {
      setError(t('quoteForm.errorUnavailable'))
    } finally {
      setSubmitting(false)
    }
  }

  const submitDisabled =
    submitting ||
    !form.name ||
    !form.phone ||
    !form.service_location ||
    !form.consent ||
    (turnstileRequired && !form.turnstileToken)

  return (
    <section id="quote" className="bg-charcoal-900 py-24" aria-labelledby="quote-form-heading">
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <FadeIn direction="right">
            <div>
              <span className="badge-orange mb-4">{t('quoteForm.badge')}</span>
              <h2 id="quote-form-heading" className="section-title mt-3">
                {t('quoteForm.heading')}
              </h2>
              <p className="section-subtitle mt-4">
                {t('quoteForm.subPrefix')} {t('quoteForm.subFasterResponse')}{' '}
                <a href={SITE.phone.href} className="text-orange-400 font-semibold" dir="ltr">
                  {SITE.phone.display}
                </a>
                .
              </p>

              <div className="mt-10 space-y-5">
                {[
                  { titleEl: <span dir="ltr">{SITE.phone.display}</span>, sub: t('quoteForm.contactPhoneSub'), href: SITE.phone.href },
                  {
                    titleEl: <span dir="ltr">{`${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}`}</span>,
                    sub: t('quoteForm.contactCitySub'),
                    href: undefined,
                  },
                  {
                    titleEl: t('quoteForm.contactSameDayTitle'),
                    sub: t('quoteForm.contactSameDaySub'),
                    href: undefined,
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
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
                          {item.titleEl}
                        </a>
                      ) : (
                        <p className="font-semibold text-bone-100 text-base">{item.titleEl}</p>
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
              <div className="card-base p-8 text-center" role="status" aria-live="polite">
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
                <h3 className="text-2xl font-bold text-bone-100 mb-3">{t('quoteForm.successHeading')}</h3>
                <p className="text-steel-400 mb-6">
                  {t('quoteForm.successSub')}{' '}
                  <a href={SITE.phone.href} className="text-orange-400 font-semibold" dir="ltr">
                    {SITE.phone.display}
                  </a>
                  .
                </p>
                <button onClick={() => setSubmitted(false)} className="btn-secondary text-sm">
                  {t('quoteForm.submitAnotherCta')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="card-base p-6 sm:p-8">
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="qf-name" className="block text-sm font-medium text-bone-300 mb-1.5">
                        {t('quoteForm.nameLabel')} <span className="text-orange-500">*</span>
                      </label>
                      <input
                        id="qf-name"
                        type="text"
                        autoComplete="name"
                        required
                        maxLength={120}
                        className={`input-base ${fieldError('name') ? 'border-red-500' : ''}`}
                        placeholder={t('quoteForm.namePlaceholder')}
                        aria-invalid={!!fieldError('name')}
                        aria-describedby={fieldError('name') ? 'qf-name-error' : undefined}
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                      />
                      {fieldError('name') && (
                        <p id="qf-name-error" className="text-red-400 text-xs mt-1">
                          {fieldError('name')}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="qf-phone" className="block text-sm font-medium text-bone-300 mb-1.5">
                        {t('quoteForm.phoneLabel')} <span className="text-orange-500">*</span>
                      </label>
                      <input
                        id="qf-phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        className={`input-base ${fieldError('phone') ? 'border-red-500' : ''}`}
                        placeholder={t('quoteForm.phonePlaceholder')}
                        aria-invalid={!!fieldError('phone')}
                        aria-describedby={fieldError('phone') ? 'qf-phone-error' : undefined}
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        dir="ltr"
                      />
                      {fieldError('phone') && (
                        <p id="qf-phone-error" className="text-red-400 text-xs mt-1">
                          {fieldError('phone')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="qf-email" className="block text-sm font-medium text-bone-300 mb-1.5">
                      {t('quoteForm.emailLabel')}{' '}
                      <span className="text-steel-500 font-normal">{t('quoteForm.emailOptional')}</span>
                    </label>
                    <input
                      id="qf-email"
                      type="email"
                      autoComplete="email"
                      maxLength={254}
                      className={`input-base ${fieldError('email') ? 'border-red-500' : ''}`}
                      placeholder={t('quoteForm.emailPlaceholder')}
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      dir="ltr"
                    />
                    {fieldError('email') && <p className="text-red-400 text-xs mt-1">{fieldError('email')}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="qf-service" className="block text-sm font-medium text-bone-300 mb-1.5">
                        {t('quoteForm.serviceLabel')}
                      </label>
                      <select
                        id="qf-service"
                        className="input-base"
                        value={form.service_requested}
                        onChange={(e) => update('service_requested', e.target.value)}
                      >
                        <option value="">{t('quoteForm.serviceDefault')}</option>
                        {SERVICES.map((s) => (
                          <option key={s.slug} value={s.formValue}>
                            {getServiceName(s.slug, t)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="qf-location" className="block text-sm font-medium text-bone-300 mb-1.5">
                        {t('quoteForm.locationLabel')} <span className="text-orange-500">*</span>
                      </label>
                      <select
                        id="qf-location"
                        className={`input-base ${fieldError('service_location') ? 'border-red-500' : ''}`}
                        required
                        value={form.service_location}
                        onChange={(e) => update('service_location', e.target.value)}
                      >
                        <option value="">{t('quoteForm.locationDefault')}</option>
                        {AREAS.map((area) => (
                          <option key={area.slug} value={area.city}>
                            {area.city}, CA
                          </option>
                        ))}
                        <option value="Other">{t('quoteForm.locationOther')}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="qf-date" className="block text-sm font-medium text-bone-300 mb-1.5">
                      {t('quoteForm.dateLabel')}{' '}
                      <span className="text-steel-500 font-normal">{t('quoteForm.emailOptional')}</span>
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
                      {t('quoteForm.messageLabel')}{' '}
                      <span className="text-steel-500 font-normal">{t('quoteForm.emailOptional')}</span>
                    </label>
                    <textarea
                      id="qf-message"
                      rows={4}
                      maxLength={2000}
                      className={`input-base resize-none ${fieldError('message') ? 'border-red-500' : ''}`}
                      placeholder={t('quoteForm.messagePlaceholder')}
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                    />
                    {fieldError('message') && <p className="text-red-400 text-xs mt-1">{fieldError('message')}</p>}
                  </div>

                  {/* Honeypot — visually hidden, off-tab. */}
                  <div aria-hidden="true" className="absolute -start-[10000px]" tabIndex={-1}>
                    <label htmlFor="qf-company">Company (do not fill)</label>
                    <input
                      id="qf-company"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.company}
                      onChange={(e) => update('company', e.target.value)}
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
                      {t('quoteForm.consentText')}{' '}
                      <Link href="/privacy" className="text-orange-400 hover:text-orange-300 underline">
                        {t('quoteForm.consentSeePrivacy')}
                      </Link>
                    </label>
                  </div>

                  <TurnstileWidget onToken={(t) => update('turnstileToken', t ?? '')} />

                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20" role="alert" aria-live="polite">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitDisabled}
                    className="btn-primary w-full justify-center py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
                          <path d="M8 2a6 6 0 016 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        {t('quoteForm.sendingCta')}
                      </span>
                    ) : (
                      t('quoteForm.sendCta')
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
