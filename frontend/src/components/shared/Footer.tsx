'use client'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { AREAS } from '@/content/areas'
import { SERVICES } from '@/content/services'
import { SITE } from '@/content/site'
import SocialIcons from './SocialIcons'

function PUPLogo() {
  return (
    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M3 12L8 4L13 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.5 12H10.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export default function Footer() {
  const t = useTranslations()
  const year = new Date().getFullYear()

  return (
    <footer id="contact" className="bg-charcoal-950 border-t border-charcoal-600">
      <div className="container-max section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <PUPLogo />
              <span className="font-bold text-bone-100">{SITE.name}</span>
            </div>
            <p className="text-steel-400 text-sm leading-relaxed mb-5">{t('footer.tagline')}</p>
            <div className="space-y-2 text-sm">
              <p className="text-bone-300 flex items-center gap-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="text-steel-500 flex-shrink-0"
                  aria-hidden="true"
                >
                  <path
                    d="M7 1C4.79 1 3 2.79 3 5c0 3.25 4 8 4 8s4-4.75 4-8c0-2.21-1.79-4-4-4z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="7" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <span dir="ltr">
                  {SITE.address.city}, {SITE.address.region} {SITE.address.postalCode}
                </span>
              </p>
              <a href={SITE.phone.href} className="phone-display text-base flex items-center gap-2" dir="ltr">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="flex-shrink-0"
                  aria-hidden="true"
                >
                  <path
                    d="M12.25 9.81v1.87c0 .39-.32.7-.7.68A8.3 8.3 0 011.82 2.45a.68.68 0 01.68-.7H4.37c.36 0 .67.26.72.62.13.78.37 1.52.7 2.22a.66.66 0 01-.15.71l-.72.72a8.19 8.19 0 004.1 4.1l.72-.72a.66.66 0 01.71-.15c.7.33 1.44.57 2.22.7.36.05.62.36.62.72l-.04.14z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {SITE.phone.display}
              </a>
              <Link href="/verify" className="text-verify-400 hover:text-verify-300 transition-colors text-xs inline-flex items-center gap-1.5">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor" aria-hidden="true">
                  <path d="M9.5 2.5L4.25 7.75 1.5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
                {t('footer.verifyBusinessLink')}
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-bone-200 mb-4 text-xs uppercase tracking-widest">{t('footer.servicesHeading')}</h3>
            <ul className="space-y-2.5">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="text-steel-400 hover:text-bone-200 text-sm transition-colors">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-bone-200 mb-4 text-xs uppercase tracking-widest">{t('footer.areasHeading')}</h3>
            <ul className="space-y-2.5">
              {AREAS.slice(0, 8).map((area) => (
                <li key={area.slug}>
                  <Link href={`/areas/${area.slug}`} className="text-steel-400 hover:text-bone-200 text-sm transition-colors">
                    {area.city}, CA
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-bone-200 mb-4 text-xs uppercase tracking-widest">{t('footer.getQuoteHeading')}</h3>
            <p className="text-steel-400 text-sm mb-5 leading-relaxed">{t('footer.getQuoteSub')}</p>
            <div className="flex flex-col gap-3">
              <a href="#quote" className="btn-primary text-sm justify-center py-3">
                {t('footer.requestPickupCta')}
              </a>
              <a href={SITE.phone.href} className="btn-secondary text-sm justify-center py-3">
                {t('footer.callPrefix')} <span dir="ltr">{SITE.phone.display}</span>
              </a>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="badge-verify">{t('footer.licensedTag')}</span>
              <span className="badge-verify">{t('footer.insuredTag')}</span>
              <span className="badge-verify">{t('footer.localTag')}</span>
            </div>

            <div className="mt-6">
              <p className="text-steel-500 text-xs uppercase tracking-widest font-semibold mb-3">{t('footer.findUsOnline')}</p>
              <SocialIcons />
            </div>
          </div>
        </div>

        <div className="divider mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-steel-500 text-xs text-center sm:text-left">
            &copy; {year} {SITE.name}. <span dir="ltr">{SITE.address.city}, {SITE.address.region} {SITE.address.postalCode}.</span> {t('footer.allRightsReserved')}
          </p>
          <div className="flex gap-5 text-xs">
            <Link href="/verify" className="text-steel-500 hover:text-steel-400 transition-colors">
              {t('footer.verifyLink')}
            </Link>
            <Link href="/privacy" className="text-steel-500 hover:text-steel-400 transition-colors">
              {t('footer.privacyLink')}
            </Link>
            <Link href="/terms" className="text-steel-500 hover:text-steel-400 transition-colors">
              {t('footer.termsLink')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
