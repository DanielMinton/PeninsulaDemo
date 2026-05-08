'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { SITE } from '@/content/site'
import LocalePicker from './LocalePicker'

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

export default function Nav() {
  const t = useTranslations()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const NAV_LINKS = [
    { labelKey: 'nav.servicesLink', href: '#services' },
    { labelKey: 'nav.areasLink', href: '#service-areas' },
    { labelKey: 'nav.aboutLink', href: '#about' },
    { labelKey: 'nav.contactLink', href: '#contact' },
  ] as const

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-charcoal-900/96 backdrop-blur-md border-b border-charcoal-600 shadow-card'
          : 'bg-transparent'
      }`}
    >
      <div className="container-max section-padding">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0 lg:min-w-fit" aria-label={t('nav.homeAriaLabel')}>
            <div className="group-hover:scale-105 transition-transform">
              <PUPLogo />
            </div>
            <div className="leading-none min-w-0 lg:min-w-fit">
              <span className="font-bold text-bone-100 text-sm block group-hover:text-white transition-colors truncate lg:overflow-visible">
                {SITE.name}
              </span>
              <span className="text-steel-500 text-xs hidden sm:block mt-0.5">{t('nav.cityTagline')}</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label={t('nav.mainAriaLabel')}>
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-2.5 xl:px-4 py-2 text-sm font-medium text-steel-300 hover:text-bone-100 rounded-lg hover:bg-charcoal-700/50 transition-all duration-150 whitespace-nowrap"
              >
                {t(link.labelKey)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 lg:gap-3">
            <LocalePicker />
            <a
              href={SITE.phone.href}
              className="hidden lg:inline-block font-bold text-orange-500 hover:text-orange-400 transition-colors tabular-nums text-sm whitespace-nowrap"
              dir="ltr"
            >
              {SITE.phone.display}
            </a>
            <a href="#quote" className="hidden lg:inline-flex btn-primary text-sm py-2 px-3 xl:px-5 whitespace-nowrap">
              {t('nav.requestPickupCta')}
            </a>
            <a href={SITE.phone.href} className="lg:hidden btn-primary text-sm py-2 px-4">
              {t('nav.callNowCta')}
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-steel-300 hover:text-bone-100 transition-colors rounded-lg hover:bg-charcoal-700/50"
              aria-label={mobileOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              aria-expanded={mobileOpen}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                {mobileOpen ? (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  />
                ) : (
                  <>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden border-t border-charcoal-600 bg-charcoal-900"
          >
            <div className="section-padding py-5 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 px-2 text-bone-200 hover:text-white font-medium border-b border-charcoal-700 last:border-0 transition-colors"
                >
                  {t(link.labelKey)}
                </a>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <a
                  href={SITE.phone.href}
                  className="text-center py-3 border border-orange-500/30 rounded-xl text-orange-400 font-bold text-lg hover:border-orange-500/60 transition-colors"
                  dir="ltr"
                >
                  {SITE.phone.display}
                </a>
                <a
                  href="#quote"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary justify-center text-base py-3"
                >
                  {t('nav.requestPickupLong')}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
