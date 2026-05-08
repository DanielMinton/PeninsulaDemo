'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useLeadForm, type FormStep } from '@/hooks/useLeadForm'
import { AREAS } from '@/content/areas'
import { SERVICES as CONTENT_SERVICES } from '@/content/services'
import { getServiceShortName } from '@/content/copy'
import { SITE } from '@/content/site'
import FadeIn from '@/components/motion/FadeIn'
import TurnstileWidget from '@/components/shared/TurnstileWidget'

const turnstileRequired = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

const STEPS: FormStep[] = ['service', 'load', 'location', 'urgency', 'contact']

const LOAD_SIZE_KEYS = [
  ['single_item', 'quoteSelector.loadSingle', 'quoteSelector.loadSingleSub'],
  ['quarter_truck', 'quoteSelector.loadQuarter', 'quoteSelector.loadQuarterSub'],
  ['half_truck', 'quoteSelector.loadHalf', 'quoteSelector.loadHalfSub'],
  ['full_truck', 'quoteSelector.loadFull', 'quoteSelector.loadFullSub'],
] as const

const URGENCY_KEYS = [
  ['asap', 'quoteSelector.urgencyAsap', 'quoteSelector.urgencyAsapSub'],
  ['this_week', 'quoteSelector.urgencyThisWeek', 'quoteSelector.urgencyThisWeekSub'],
  ['flexible', 'quoteSelector.urgencyFlexible', 'quoteSelector.urgencyFlexibleSub'],
] as const

function StepBar({ current, t }: { current: FormStep; t: ReturnType<typeof useTranslations> }) {
  const STEP_LABELS = [
    t('quoteSelector.stepService'),
    t('quoteSelector.stepLoad'),
    t('quoteSelector.stepLocation'),
    t('quoteSelector.stepUrgency'),
    t('quoteSelector.stepContact'),
  ]
  const idx = STEPS.indexOf(current)
  const total = STEPS.length
  const stepNumber = Math.max(1, idx + 1)
  return (
    <div
      className="flex items-center gap-1 mb-8"
      role="progressbar"
      aria-label={t('quoteSelector.progressAria', { step: stepNumber, total, label: STEP_LABELS[idx] ?? '' })}
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
      className={`relative p-4 rounded-xl border text-start transition-all duration-150 ${
        selected
          ? 'border-orange-500 bg-orange-500/10 text-bone-100'
          : 'border-charcoal-600 bg-charcoal-700/50 text-bone-300 hover:border-charcoal-500 hover:bg-charcoal-700'
      }`}
    >
      {selected && (
        <div className="absolute top-2.5 end-2.5 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
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
  const t = useTranslations()
  const { formData, step, setStep, isSubmitting, error, submitted, updateField, submitLead } = useLeadForm()
  const [nameError, setNameError] = useState('')
  const [phoneError, setPhoneError] = useState('')

  const SERVICES = [
    ...CONTENT_SERVICES.map((s) => ({ value: s.formValue, label: getServiceShortName(s.slug, t) })),
    { value: 'other', label: t('quoteSelector.serviceOther') },
  ]

  function validateContact() {
    let valid = true
    if (formData.name.trim().length < 2) {
      setNameError(t('errors.nameTooShort'))
      valid = false
    } else setNameError('')
    if (formData.phone.replace(/\D/g, '').length < 10) {
      setPhoneError(t('errors.phoneInvalid'))
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
            <span className="badge-orange mb-4">{t('quoteSelector.badge')}</span>
            <h2 id="quote-selector-heading" className="section-title mt-3">
              {t('quoteSelector.heading')}
            </h2>
            <p className="section-subtitle mt-4 max-w-xl">{t('quoteSelector.sub')}</p>
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
                <h3 className="text-2xl font-bold text-bone-100 mb-3">{t('quoteSelector.successHeading')}</h3>
                <p className="text-steel-400 mb-6 leading-relaxed">
                  {t('quoteSelector.successSub')}{' '}
                  <a href={SITE.phone.href} className="text-orange-400 font-semibold" dir="ltr">
                    {SITE.phone.display}
                  </a>
                  .
                </p>
                <div className="flex justify-center gap-3">
                  <a href={SITE.phone.href} className="btn-primary">
                    {t('hero.callNowCta')}
                  </a>
                </div>
              </motion.div>
            ) : (
              <>
                <StepBar current={step} t={t} />

                <AnimatePresence mode="wait">
                  {step === 'service' && (
                    <motion.div
                      key="service"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="font-bold text-bone-100 text-lg mb-4">{t('quoteSelector.askService')}</h3>
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
                        {t('quoteSelector.continueCta')}
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
                      <h3 className="font-bold text-bone-100 text-lg mb-4">{t('quoteSelector.askLoad')}</h3>
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {LOAD_SIZE_KEYS.map(([value, labelKey, subKey]) => (
                          <OptionCard
                            key={value}
                            selected={formData.load_size === value}
                            onClick={() => updateField('load_size', value)}
                            label={t(labelKey)}
                            sub={t(subKey)}
                          />
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setStep('service')}
                          className="btn-secondary px-4 py-3"
                        >
                          {t('quoteSelector.backCta')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setStep('location')}
                          className="btn-primary flex-1 justify-center py-3"
                          disabled={!formData.load_size}
                        >
                          {t('quoteSelector.continueCta')}
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
                      <h3 className="font-bold text-bone-100 text-lg mb-4">{t('quoteSelector.askLocation')}</h3>
                      <div className="mb-4">
                        <label htmlFor="qs-city" className="block text-sm font-medium text-bone-300 mb-1.5">
                          {t('quoteSelector.cityLabel')}
                        </label>
                        <select
                          id="qs-city"
                          className="input-base"
                          value={formData.service_location}
                          onChange={(e) => updateField('service_location', e.target.value)}
                        >
                          <option value="">{t('quoteSelector.cityDefault')}</option>
                          {AREAS.map((area) => (
                            <option key={area.slug} value={area.city}>
                              {area.city}, CA
                            </option>
                          ))}
                          <option value="Other">{t('quoteSelector.cityOtherOption')}</option>
                        </select>
                      </div>
                      {formData.service_location === 'Other' && (
                        <div className="mb-4">
                          <label htmlFor="qs-city-other" className="block text-sm font-medium text-bone-300 mb-1.5">
                            {t('quoteSelector.cityOtherLabel')}
                          </label>
                          <input
                            id="qs-city-other"
                            type="text"
                            className="input-base"
                            placeholder={t('quoteSelector.cityOtherPlaceholder')}
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
                          {t('quoteSelector.backCta')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setStep('urgency')}
                          className="btn-primary flex-1 justify-center py-3"
                          disabled={!formData.service_location || formData.service_location === 'Other / Not Listed'}
                        >
                          {t('quoteSelector.continueCta')}
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
                      <h3 className="font-bold text-bone-100 text-lg mb-4">{t('quoteSelector.askUrgency')}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                        {URGENCY_KEYS.map(([value, labelKey, subKey]) => (
                          <OptionCard
                            key={value}
                            selected={formData.urgency === value}
                            onClick={() => updateField('urgency', value)}
                            label={t(labelKey)}
                            sub={t(subKey)}
                          />
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setStep('location')}
                          className="btn-secondary px-4 py-3"
                        >
                          {t('quoteSelector.backCta')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setStep('contact')}
                          className="btn-primary flex-1 justify-center py-3"
                        >
                          {t('quoteSelector.continueCta')}
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
                      <h3 className="font-bold text-bone-100 text-lg mb-4">{t('quoteSelector.askContact')}</h3>
                      <form onSubmit={handleSubmit} noValidate>
                        <div className="space-y-4 mb-5">
                          <div>
                            <label htmlFor="qs-name" className="block text-sm font-medium text-bone-300 mb-1.5">
                              {t('quoteSelector.nameLabel')} <span className="text-orange-500">*</span>
                            </label>
                            <input
                              id="qs-name"
                              type="text"
                              autoComplete="name"
                              className={`input-base ${nameError ? 'border-red-500' : ''}`}
                              placeholder={t('quoteSelector.namePlaceholder')}
                              value={formData.name}
                              onChange={(e) => updateField('name', e.target.value)}
                              required
                            />
                            {nameError && <p className="text-red-400 text-xs mt-1">{nameError}</p>}
                          </div>
                          <div>
                            <label htmlFor="qs-phone" className="block text-sm font-medium text-bone-300 mb-1.5">
                              {t('quoteSelector.phoneLabel')} <span className="text-orange-500">*</span>
                            </label>
                            <input
                              id="qs-phone"
                              type="tel"
                              autoComplete="tel"
                              className={`input-base ${phoneError ? 'border-red-500' : ''}`}
                              placeholder={t('quoteSelector.phonePlaceholder')}
                              value={formData.phone}
                              onChange={(e) => updateField('phone', e.target.value)}
                              required
                              dir="ltr"
                            />
                            {phoneError && <p className="text-red-400 text-xs mt-1">{phoneError}</p>}
                          </div>
                          <div>
                            <label htmlFor="qs-email" className="block text-sm font-medium text-bone-300 mb-1.5">
                              {t('quoteSelector.emailLabel')}{' '}
                              <span className="text-steel-500 font-normal">{t('quoteSelector.emailOptional')}</span>
                            </label>
                            <input
                              id="qs-email"
                              type="email"
                              autoComplete="email"
                              className="input-base"
                              placeholder={t('quoteSelector.emailPlaceholder')}
                              value={formData.email}
                              onChange={(e) => updateField('email', e.target.value)}
                              dir="ltr"
                            />
                          </div>
                          {/* Honeypot — visually hidden, off-tab. */}
                          <div aria-hidden="true" className="absolute -start-[10000px]" tabIndex={-1}>
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
                              {t('quoteSelector.consentText')}{' '}
                              <Link href="/privacy" className="text-orange-400 hover:text-orange-300 underline">
                                {t('quoteSelector.privacyLink')}
                              </Link>
                            </label>
                          </div>

                          <TurnstileWidget onToken={(tk) => updateField('turnstileToken', tk ?? '')} />
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
                            {t('quoteSelector.backCta')}
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
                            {isSubmitting ? t('quoteSelector.sendingCta') : t('quoteSelector.requestQuoteCta')}
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
            {t('quoteSelector.preferToCall')}{' '}
            <a
              href={SITE.phone.href}
              className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
              dir="ltr"
            >
              {SITE.phone.display}
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
