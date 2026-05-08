'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useLeadForm, type FormStep } from '@/hooks/useLeadForm'
import { AREAS } from '@/content/areas'
import { SERVICES as CONTENT_SERVICES } from '@/content/services'
import { SITE } from '@/content/site'
import FadeIn from '@/components/motion/FadeIn'
import TurnstileWidget from '@/components/shared/TurnstileWidget'

const PHONE = SITE.phone.display
const PHONE_RAW = SITE.phone.href

const turnstileRequired = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

const SERVICES = [
  ...CONTENT_SERVICES.map((s) => ({ value: s.formValue, label: s.shortName })),
  { value: 'other', label: 'Not Sure / Other' },
]

const LOAD_SIZES = [
  { value: 'single_item', label: 'Single Item', sub: '1 large piece' },
  { value: 'quarter_truck', label: 'Small Load', sub: '1/4 truck or less' },
  { value: 'half_truck', label: 'Medium Load', sub: '1/2 truck' },
  { value: 'full_truck', label: 'Full Load', sub: 'Full truck or more' },
]

const URGENCY_OPTIONS = [
  { value: 'asap', label: 'ASAP', sub: 'Within 1-2 days' },
  { value: 'this_week', label: 'This Week', sub: 'Within 7 days' },
  { value: 'flexible', label: 'Flexible', sub: 'When available' },
]

const STEPS: FormStep[] = ['service', 'load', 'location', 'urgency', 'contact']
const STEP_LABELS = ['Service', 'Load Size', 'Location', 'Urgency', 'Contact']

function StepBar({ current }: { current: FormStep }) {
  const idx = STEPS.indexOf(current)
  const total = STEPS.length
  const stepNumber = Math.max(1, idx + 1)
  return (
    <div
      className="flex items-center gap-1 mb-8"
      role="progressbar"
      aria-label={`Quote form progress: step ${stepNumber} of ${total}, ${STEP_LABELS[idx] ?? 'done'}`}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={stepNumber}
    >
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-1">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              i === idx
                ? 'bg-orange-500 text-white'
                : i < idx
                ? 'bg-verify-500/15 text-verify-400 border border-verify-500/30'
                : 'bg-charcoal-700 text-steel-500'
            }`}
          >
            {i < idx ? (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.53 2.22a.75.75 0 010 1.06L4.53 7.28a.75.75 0 01-1.06 0L1.47 5.28a.75.75 0 011.06-1.06L4 5.69 7.47 2.22a.75.75 0 011.06 0z"
                />
              </svg>
            ) : (
              <span className="w-3 h-3 rounded-full border border-current flex items-center justify-center text-[8px]">
                {i + 1}
              </span>
            )}
            <span className="hidden sm:inline">{STEP_LABELS[i]}</span>
          </div>
          {i < STEPS.length - 1 && <div className={`w-6 h-px ${i < idx ? 'bg-verify-500/40' : 'bg-charcoal-600'}`} />}
        </div>
      ))}
    </div>
  )
}

function OptionCard({
  selected,
  onClick,
  label,
  sub,
}: {
  selected: boolean
  onClick: () => void
  label: string
  sub?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative p-4 rounded-xl border text-left transition-all duration-150 ${
        selected
          ? 'border-orange-500 bg-orange-500/10 text-bone-100'
          : 'border-charcoal-600 bg-charcoal-700/50 text-bone-300 hover:border-charcoal-500 hover:bg-charcoal-700'
      }`}
    >
      {selected && (
        <div className="absolute top-2.5 right-2.5 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="white" aria-hidden="true">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.07 1.29a.75.75 0 010 1.06L3.33 6.1a.75.75 0 01-1.06 0L.59 4.41a.75.75 0 111.06-1.06l1.14 1.14L6.01 1.3a.75.75 0 011.06 0z"
            />
          </svg>
        </div>
      )}
      <p className="font-semibold text-sm">{label}</p>
      {sub && <p className="text-xs text-steel-500 mt-0.5">{sub}</p>}
    </button>
  )
}

export default function QuoteSelector() {
  const { formData, step, setStep, isSubmitting, error, submitted, updateField, submitLead } = useLeadForm()
  const [nameError, setNameError] = useState('')
  const [phoneError, setPhoneError] = useState('')

  function validateContact() {
    let valid = true
    if (formData.name.trim().length < 2) {
      setNameError('Please enter your name.')
      valid = false
    } else setNameError('')
    if (formData.phone.replace(/\D/g, '').length < 10) {
      setPhoneError('Please enter a valid phone number.')
      valid = false
    } else setPhoneError('')
    return valid
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateContact()) return
    if (!formData.consent) return
    await submitLead()
  }

  return (
    <section id="quote-selector" className="bg-charcoal-900 py-24" aria-labelledby="quote-selector-heading">
      <div className="container-max section-padding">
        <FadeIn>
          <div className="mb-12">
            <span className="badge-orange mb-4">Fast Quote Path</span>
            <h2 id="quote-selector-heading" className="section-title mt-3">
              Get a Quote in 60 Seconds
            </h2>
            <p className="section-subtitle mt-4 max-w-xl">
              Pick your service, tell us the load, and drop your contact info. Peninsula Pick Ups will reach out fast.
            </p>
          </div>
        </FadeIn>

        <div className="max-w-2xl">
          <div className="card-base p-6 sm:p-8">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center"
              >
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
                <h3 className="text-2xl font-bold text-bone-100 mb-3">Quote Request Received</h3>
                <p className="text-steel-400 mb-6 leading-relaxed">
                  Peninsula Pick Ups will be in touch shortly. If you need an immediate response, call{' '}
                  <a href={PHONE_RAW} className="text-orange-400 font-semibold">
                    {PHONE}
                  </a>
                  .
                </p>
                <div className="flex justify-center gap-3">
                  <a href={PHONE_RAW} className="btn-primary">
                    Call Now
                  </a>
                </div>
              </motion.div>
            ) : (
              <>
                <StepBar current={step} />

                <AnimatePresence mode="wait">
                  {step === 'service' && (
                    <motion.div
                      key="service"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="font-bold text-bone-100 text-lg mb-4">What service do you need?</h3>
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {SERVICES.map((s) => (
                          <OptionCard
                            key={s.value}
                            selected={formData.service_requested === s.value}
                            onClick={() => updateField('service_requested', s.value)}
                            label={s.label}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep('load')}
                        className="btn-primary w-full justify-center py-3"
                        disabled={!formData.service_requested}
                      >
                        Continue
                      </button>
                    </motion.div>
                  )}

                  {step === 'load' && (
                    <motion.div
                      key="load"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="font-bold text-bone-100 text-lg mb-4">How much needs to go?</h3>
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {LOAD_SIZES.map((l) => (
                          <OptionCard
                            key={l.value}
                            selected={formData.load_size === l.value}
                            onClick={() => updateField('load_size', l.value)}
                            label={l.label}
                            sub={l.sub}
                          />
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setStep('service')}
                          className="btn-secondary px-4 py-3"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setStep('location')}
                          className="btn-primary flex-1 justify-center py-3"
                          disabled={!formData.load_size}
                        >
                          Continue
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 'location' && (
                    <motion.div
                      key="location"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="font-bold text-bone-100 text-lg mb-4">Where is the pickup located?</h3>
                      <div className="mb-4">
                        <label htmlFor="qs-city" className="block text-sm font-medium text-bone-300 mb-1.5">
                          City or Address
                        </label>
                        <select
                          id="qs-city"
                          className="input-base"
                          value={formData.service_location}
                          onChange={(e) => updateField('service_location', e.target.value)}
                        >
                          <option value="">Select a city...</option>
                          {AREAS.map((area) => (
                            <option key={area.slug} value={area.city}>
                              {area.city}, CA
                            </option>
                          ))}
                          <option value="Other">Other / Not Listed</option>
                        </select>
                      </div>
                      {formData.service_location === 'Other' && (
                        <div className="mb-4">
                          <label htmlFor="qs-city-other" className="block text-sm font-medium text-bone-300 mb-1.5">
                            Enter your city or address
                          </label>
                          <input
                            id="qs-city-other"
                            type="text"
                            className="input-base"
                            placeholder="e.g. Foster City, CA"
                            onChange={(e) => updateField('service_location', e.target.value)}
                          />
                        </div>
                      )}
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setStep('load')}
                          className="btn-secondary px-4 py-3"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setStep('urgency')}
                          className="btn-primary flex-1 justify-center py-3"
                          disabled={!formData.service_location || formData.service_location === 'Other / Not Listed'}
                        >
                          Continue
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 'urgency' && (
                    <motion.div
                      key="urgency"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="font-bold text-bone-100 text-lg mb-4">How soon do you need it done?</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                        {URGENCY_OPTIONS.map((u) => (
                          <OptionCard
                            key={u.value}
                            selected={formData.urgency === u.value}
                            onClick={() => updateField('urgency', u.value)}
                            label={u.label}
                            sub={u.sub}
                          />
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setStep('location')}
                          className="btn-secondary px-4 py-3"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setStep('contact')}
                          className="btn-primary flex-1 justify-center py-3"
                        >
                          Continue
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 'contact' && (
                    <motion.div
                      key="contact"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="font-bold text-bone-100 text-lg mb-4">Where should we send the quote?</h3>
                      <form onSubmit={handleSubmit} noValidate>
                        <div className="space-y-4 mb-5">
                          <div>
                            <label htmlFor="qs-name" className="block text-sm font-medium text-bone-300 mb-1.5">
                              Your Name <span className="text-orange-500">*</span>
                            </label>
                            <input
                              id="qs-name"
                              type="text"
                              autoComplete="name"
                              className={`input-base ${nameError ? 'border-red-500' : ''}`}
                              placeholder="Full name"
                              value={formData.name}
                              onChange={(e) => updateField('name', e.target.value)}
                              required
                            />
                            {nameError && <p className="text-red-400 text-xs mt-1">{nameError}</p>}
                          </div>
                          <div>
                            <label htmlFor="qs-phone" className="block text-sm font-medium text-bone-300 mb-1.5">
                              Phone Number <span className="text-orange-500">*</span>
                            </label>
                            <input
                              id="qs-phone"
                              type="tel"
                              autoComplete="tel"
                              className={`input-base ${phoneError ? 'border-red-500' : ''}`}
                              placeholder="(650) 555-0100"
                              value={formData.phone}
                              onChange={(e) => updateField('phone', e.target.value)}
                              required
                            />
                            {phoneError && <p className="text-red-400 text-xs mt-1">{phoneError}</p>}
                          </div>
                          <div>
                            <label htmlFor="qs-email" className="block text-sm font-medium text-bone-300 mb-1.5">
                              Email <span className="text-steel-500 font-normal">(optional)</span>
                            </label>
                            <input
                              id="qs-email"
                              type="email"
                              autoComplete="email"
                              className="input-base"
                              placeholder="you@example.com"
                              value={formData.email}
                              onChange={(e) => updateField('email', e.target.value)}
                            />
                          </div>
                          {/* Honeypot — visually hidden, off-tab. */}
                          <div aria-hidden="true" className="absolute -left-[10000px]" tabIndex={-1}>
                            <label htmlFor="qs-company">Company (do not fill)</label>
                            <input
                              id="qs-company"
                              type="text"
                              tabIndex={-1}
                              autoComplete="off"
                              value={formData.company}
                              onChange={(e) => updateField('company', e.target.value)}
                            />
                          </div>

                          <div className="flex items-start gap-3 p-3 rounded-lg bg-charcoal-700/50 border border-charcoal-600">
                            <input
                              id="qs-consent"
                              type="checkbox"
                              className="mt-0.5 w-4 h-4 accent-orange-500 cursor-pointer"
                              checked={formData.consent}
                              onChange={(e) => updateField('consent', e.target.checked)}
                              required
                            />
                            <label htmlFor="qs-consent" className="text-xs text-steel-400 cursor-pointer leading-relaxed">
                              I agree to be contacted by {SITE.name} at the phone number above regarding my quote
                              request, including by SMS and call. Consent is not a condition of service. Message and
                              data rates may apply. Reply STOP to opt out. See our{' '}
                              <Link href="/privacy" className="text-orange-400 hover:text-orange-300 underline">
                                Privacy Policy
                              </Link>
                              .
                            </label>
                          </div>

                          <TurnstileWidget onToken={(t) => updateField('turnstileToken', t ?? '')} />
                        </div>

                        {error && (
                          <div
                            className="text-red-400 text-sm mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                            role="alert"
                            aria-live="polite"
                          >
                            {error}
                          </div>
                        )}

                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setStep('urgency')}
                            className="btn-secondary px-4 py-3"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            disabled={
                              isSubmitting ||
                              !formData.consent ||
                              (turnstileRequired && !formData.turnstileToken)
                            }
                            className="btn-primary flex-1 justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? 'Sending...' : 'Request My Quote'}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>

          <p className="text-center text-steel-500 text-sm mt-4">
            Prefer to call?{' '}
            <a href={PHONE_RAW} className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
              {PHONE}
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
