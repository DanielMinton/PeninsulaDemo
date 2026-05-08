'use client'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { LOCALES, LOCALE_META, type Locale, isLocale, isRtl } from '@/i18n/locales'

const RECENT_KEY = 'pup.localePicker.recent'
const MAX_RECENT = 3

function readRecent(): Locale[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(RECENT_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isLocale).slice(0, MAX_RECENT)
  } catch {
    return []
  }
}

function writeRecent(locales: Locale[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(locales.slice(0, MAX_RECENT)))
  } catch {
    /* localStorage may be disabled — recents are best-effort */
  }
}

function setLocaleCookie(locale: Locale): void {
  if (typeof document === 'undefined') return
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax; secure`
}

function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M1.5 7h11M7 1.5c1.6 1.7 2.5 3.7 2.5 5.5s-.9 3.8-2.5 5.5M7 1.5C5.4 3.2 4.5 5.2 4.5 7S5.4 10.8 7 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
      <path d="M11.5 3.5L5.25 9.75 2.5 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function ChevronDown() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function LocalePicker() {
  const t = useTranslations()
  const router = useRouter()
  const prefersReducedMotion = useReducedMotion()

  const currentLocale: Locale = isLocale(router.locale) ? router.locale : 'en'
  const currentMeta = LOCALE_META[currentLocale]

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [recent, setRecent] = useState<Locale[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [announcement, setAnnouncement] = useState('')

  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const titleId = useId()

  useEffect(() => setRecent(readRecent()), [])

  // Filter the list, weave recent locales to the top.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const all = [...LOCALES] as Locale[]

    const matches = (locale: Locale): boolean => {
      if (!q) return true
      const m = LOCALE_META[locale]
      return (
        m.english.toLowerCase().includes(q) ||
        m.native.toLowerCase().includes(q) ||
        locale.toLowerCase().includes(q)
      )
    }

    const recentSet = new Set(recent)
    const recentVisible = recent.filter(matches)
    const others = all.filter((l) => !recentSet.has(l)).filter(matches)

    return { recentVisible, others, total: recentVisible.length + others.length }
  }, [query, recent])

  // Flat list for arrow-key navigation across both groups.
  const flatList = useMemo(
    () => [...filtered.recentVisible, ...filtered.others],
    [filtered],
  )

  // Reset focus index when filter changes.
  useEffect(() => setActiveIndex(0), [query])

  // Focus management: search input on open, trigger on close.
  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => searchRef.current?.focus(), 50)
      return () => window.clearTimeout(t)
    } else {
      triggerRef.current?.focus()
    }
  }, [open])

  // Body scroll lock while open.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const close = useCallback(() => setOpen(false), [])

  /**
   * Prefetch the destination locale's _next/data JSON for the current path.
   * Called on hover/focus of a row and on idle for the top-2 likely locales —
   * makes the click-to-paint round-trip a cache hit.
   */
  const prefetchLocale = useCallback(
    (locale: Locale) => {
      if (locale === currentLocale) return
      const { pathname, query, asPath } = router
      router.prefetch(asPath, asPath, { locale }).catch(() => {
        /* prefetch is best-effort — swallow */
      })
      void pathname
      void query
    },
    [currentLocale, router],
  )

  // Idle prefetch: warm the top-2 likely locales (most-recent picks excluding
  // the current one) when the picker first mounts. Bounded by requestIdleCallback.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const candidates = recent.filter((l) => l !== currentLocale).slice(0, 2)
    if (candidates.length === 0) return
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => number })
      .requestIdleCallback
    const run = () => candidates.forEach(prefetchLocale)
    if (ric) ric(run)
    else window.setTimeout(run, 800)
  }, [recent, currentLocale, prefetchLocale])

  const selectLocale = useCallback(
    (locale: Locale) => {
      setLocaleCookie(locale)
      const newRecent = [locale, ...recent.filter((l) => l !== locale)].slice(0, MAX_RECENT)
      setRecent(newRecent)
      writeRecent(newRecent)
      setAnnouncement(t('picker.announceChange', { native: LOCALE_META[locale].native }))
      // Performance instrumentation: marks the start of the locale switch.
      // The end mark fires in _app.tsx on the next paint after route resolution.
      if (typeof performance !== 'undefined' && typeof performance.mark === 'function') {
        try {
          performance.mark('pup.locale.switch.start', {
            detail: { from: currentLocale, to: locale },
          } as PerformanceMarkOptions)
        } catch {
          /* older Safari ignores the second arg */
          performance.mark('pup.locale.switch.start')
        }
      }
      // router.push uses Next.js i18n: same path, new locale.
      const { pathname, asPath, query } = router
      router.push({ pathname, query }, asPath, { locale }).then(() => setOpen(false))
    },
    [recent, router, t, currentLocale],
  )

  // Global keyboard handlers while open: Escape, arrows, Enter, Tab trap.
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, Math.max(flatList.length - 1, 0)))
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
        return
      }
      if (e.key === 'Enter' && document.activeElement === searchRef.current) {
        const target = flatList[activeIndex]
        if (target) {
          e.preventDefault()
          selectLocale(target)
        }
      }
      if (e.key === 'Tab') {
        // Trap focus inside the panel.
        const panel = panelRef.current
        if (!panel) return
        const focusables = panel.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])',
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, flatList, activeIndex, selectLocale, close])

  const isSlideRight = !isRtl(currentLocale)
  const panelInitial = prefersReducedMotion
    ? { opacity: 1, x: 0 }
    : { opacity: 0, x: isSlideRight ? '100%' : '-100%' }
  const panelAnimate = { opacity: 1, x: 0 }
  const panelExit = prefersReducedMotion
    ? { opacity: 0 }
    : { opacity: 0, x: isSlideRight ? '100%' : '-100%' }

  return (
    <>
      {/*
        Floating trigger — pinned to top-right of the viewport (top-left under RTL),
        anchored OUTSIDE the header so it never competes with header CTAs for the
        same attention slot. z-[60] sits above the header (z-50) and below the open
        panel (z-[81]). Position is `fixed` not `sticky` so it survives any parent
        overflow context.
      */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={t('picker.openLabel')}
        className={`fixed top-3 sm:top-4 z-[60] inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-sm text-white bg-charcoal-800/95 backdrop-blur-md border border-orange-500/40 hover:border-orange-400 hover:bg-charcoal-700 shadow-lg shadow-charcoal-950/50 ring-1 ring-orange-500/10 transition-all duration-150 ${
          isRtl(currentLocale) ? 'left-3 sm:left-4' : 'right-3 sm:right-4'
        }`}
      >
        <span className="text-orange-400"><GlobeIcon /></span>
        <span className="font-semibold tracking-tight">{currentMeta.native}</span>
        <span className="text-steel-400"><ChevronDown /></span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
              onClick={close}
              className="fixed inset-0 bg-charcoal-950 z-[80]"
              aria-hidden="true"
            />
            <motion.div
              key="panel"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              initial={panelInitial}
              animate={panelAnimate}
              exit={panelExit}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className={`fixed top-0 bottom-0 ${isSlideRight ? 'right-0' : 'left-0'} z-[81] w-full sm:w-[420px] max-w-full bg-charcoal-900 border-${isSlideRight ? 'l' : 'r'} border-charcoal-700 shadow-2xl flex flex-col max-sm:top-auto max-sm:max-h-[70vh] max-sm:rounded-t-2xl`}
            >
              <div className="flex items-center justify-between p-5 border-b border-charcoal-700">
                <h2 id={titleId} className="text-base font-bold text-bone-100">
                  {t('picker.title')}
                </h2>
                <button
                  type="button"
                  onClick={close}
                  aria-label={t('picker.closeLabel')}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-steel-400 hover:text-bone-100 hover:bg-charcoal-700 transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="p-5 pb-3">
                <input
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('picker.searchPlaceholder')}
                  aria-label={t('picker.searchPlaceholder')}
                  className="input-base text-sm"
                  autoComplete="off"
                />
              </div>

              <ul
                role="listbox"
                aria-label={t('picker.title')}
                className="flex-1 overflow-y-auto px-2 pb-2"
              >
                {filtered.recentVisible.length > 0 && (
                  <li role="presentation" className="px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-steel-500">
                    {t('picker.recent')}
                  </li>
                )}
                {filtered.recentVisible.map((locale, i) => (
                  <LocaleRow
                    key={`r-${locale}`}
                    locale={locale}
                    selected={locale === currentLocale}
                    active={activeIndex === i}
                    onClick={() => selectLocale(locale)}
                    onPrefetch={() => prefetchLocale(locale)}
                    motionDelay={prefersReducedMotion ? 0 : Math.min(i, 6) * 0.04}
                    betaLabel={t('picker.beta')}
                  />
                ))}
                {filtered.recentVisible.length > 0 && filtered.others.length > 0 && (
                  <li role="presentation" className="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-steel-500">
                    {t('picker.allLanguages')}
                  </li>
                )}
                {filtered.others.map((locale, i) => {
                  const idx = filtered.recentVisible.length + i
                  return (
                    <LocaleRow
                      key={locale}
                      locale={locale}
                      selected={locale === currentLocale}
                      active={activeIndex === idx}
                      onClick={() => selectLocale(locale)}
                      onPrefetch={() => prefetchLocale(locale)}
                      motionDelay={prefersReducedMotion ? 0 : Math.min(idx, 6) * 0.04}
                      betaLabel={t('picker.beta')}
                    />
                  )
                })}
                {filtered.total === 0 && (
                  <li className="px-4 py-6 text-center text-steel-500 text-sm">{t('picker.noResults')}</li>
                )}
              </ul>

              <div className="border-t border-charcoal-700 px-5 py-3 text-[11px] text-steel-500 leading-relaxed">
                {t('picker.footerReviewed')}{' '}
                <a href={`mailto:hello@thepeninsulapickup.com?subject=Translation%20feedback%20%5B${currentLocale}%5D`} className="text-orange-400 hover:text-orange-300 underline">
                  {t('picker.footerReportLink')} →
                </a>
              </div>
            </motion.div>

            <div role="status" aria-live="polite" className="sr-only">
              {announcement}
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

interface LocaleRowProps {
  locale: Locale
  selected: boolean
  active: boolean
  onClick: () => void
  onPrefetch: () => void
  motionDelay: number
  betaLabel: string
}

function LocaleRow({ locale, selected, active, onClick, onPrefetch, motionDelay, betaLabel }: LocaleRowProps) {
  const meta = LOCALE_META[locale]
  return (
    <motion.li
      role="option"
      aria-selected={selected}
      initial={motionDelay > 0 ? { opacity: 0, y: 4 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: motionDelay, duration: 0.18 }}
      className="list-none"
    >
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={onPrefetch}
        onFocus={onPrefetch}
        onTouchStart={onPrefetch}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-start transition-colors ${
          active ? 'bg-charcoal-700' : 'hover:bg-charcoal-700/60'
        }`}
        lang={locale}
        dir={meta.dir}
      >
        <span className="flex-1 min-w-0">
          <span className="block text-bone-100 font-semibold text-base truncate">{meta.native}</span>
          <span className="block text-steel-400 text-xs truncate" dir="ltr">
            {meta.english}
            {meta.experimental && <span className="ms-2 inline-block px-1.5 py-px rounded bg-orange-500/15 text-orange-400 text-[10px] uppercase tracking-wider align-middle">{betaLabel}</span>}
          </span>
        </span>
        {selected && <span className="text-verify-400 flex-shrink-0"><CheckIcon /></span>}
      </button>
    </motion.li>
  )
}
