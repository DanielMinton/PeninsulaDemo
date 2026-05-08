'use client'
import { useTranslations } from 'next-intl'
import FadeIn from '@/components/motion/FadeIn'
import { SITE } from '@/content/site'

const SIGNAL_KEYS = [
  ['trustSection.signal1Title', 'trustSection.signal1Body'],
  ['trustSection.signal2Title', 'trustSection.signal2Body'],
  ['trustSection.signal3Title', 'trustSection.signal3Body'],
  ['trustSection.signal4Title', 'trustSection.signal4Body'],
  ['trustSection.signal5Title', 'trustSection.signal5Body'],
  ['trustSection.signal6Title', 'trustSection.signal6Body'],
] as const

export default function TrustSection() {
  const t = useTranslations()

  return (
    <section id="about" className="bg-charcoal-800 py-24" aria-labelledby="trust-heading">
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <FadeIn direction="right">
            <div>
              <span className="badge-verify mb-4">{t('trustSection.badge')}</span>
              <h2 id="trust-heading" className="section-title mt-3">
                {t('trustSection.headlinePart1')}
                <br />
                {t('trustSection.headlinePart2')}
              </h2>
              <p className="section-subtitle mt-4 leading-relaxed">{t('trustSection.subhead')}</p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a href="#quote" className="btn-primary">
                  {t('trustSection.requestQuoteCta')}
                </a>
                <a href={SITE.phone.href} className="btn-secondary">
                  {t('trustSection.callCta')} <span dir="ltr">{SITE.phone.display}</span>
                </a>
              </div>

              <div className="mt-10 p-6 rounded-xl bg-charcoal-700 border border-charcoal-500">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 flex-shrink-0">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                      <path
                        d="M11 2a9 9 0 100 18A9 9 0 0011 2zM11 7v4l3 3"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-bone-100 text-base mb-1">{t('trustSection.ownersTitle')}</p>
                    <p className="text-steel-400 text-sm leading-relaxed">{t('trustSection.ownersBody')}</p>
                    <p className="mt-2 text-orange-400 font-semibold text-sm">{t('trustSection.establishedNote')}</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="left" delay={0.1}>
            <div className="grid grid-cols-1 gap-4">
              {SIGNAL_KEYS.map(([titleKey, bodyKey], i) => (
                <FadeIn key={titleKey} delay={0.08 * i} direction="left">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-charcoal-700/50 border border-charcoal-600 hover:border-verify-500/30 transition-colors group">
                    <div className="w-6 h-6 rounded-full bg-verify-500/15 border border-verify-500/30 flex items-center justify-center text-verify-400 flex-shrink-0 mt-0.5 group-hover:bg-verify-500/25 transition-colors">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M10.29 2.29a1 1 0 010 1.42L5 9l-3.29-3.29a1 1 0 111.42-1.42L5 6.17l3.88-3.88a1 1 0 011.41 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-bone-100 text-sm mb-1">{t(titleKey)}</p>
                      <p className="text-steel-400 text-sm leading-relaxed">{t(bodyKey)}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
