'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { AREAS, type Area } from '@/content/areas'
import { LAND_PATH, SPINE_PATH, MAP_VIEWBOX } from '@/content/map-outline'
import { SITE } from '@/content/site'

const W = MAP_VIEWBOX.width
const H = MAP_VIEWBOX.height

interface CardProps {
  area: Area
  /** Place the card on the left of the marker when the marker is in the right half of the map. */
  flip: boolean
}

function MarkerCard({ area, flip }: CardProps) {
  const t = useTranslations()
  const horiz = flip ? 'end-full me-3' : 'start-full ms-3'
  return (
    <div
      role="dialog"
      aria-label={t('map.tooltipPreview', { city: area.city })}
      className={`absolute top-1/2 -translate-y-1/2 ${horiz} w-56 p-3.5 rounded-xl bg-charcoal-800 border border-charcoal-500 shadow-card-hover text-start z-20 pointer-events-none`}
    >
      <div className="flex items-center gap-2 mb-1">
        <p className="font-bold text-bone-100 text-sm">{area.city}, CA</p>
        {area.isHomeBase && (
          <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded-full">
            {t('map.homeBaseTag')}
          </span>
        )}
      </div>
      <p className="text-[11px] text-steel-500 mb-2">
        {area.county} {t('serviceAreas.countySuffix')}
      </p>
      <p className="text-xs text-steel-300 leading-relaxed">
        {t('map.servicesAvailable', { count: area.services.length })}
      </p>
      <p className="mt-3 text-xs font-semibold text-orange-400">{t('map.requestPickupHere')} →</p>
    </div>
  )
}

export default function PeninsulaMap() {
  const t = useTranslations()
  const reduce = useReducedMotion()
  const [active, setActive] = useState<string | null>(null)

  // Markers tab in geographic order, north (smallest y) to south.
  const ordered = useMemo(() => [...AREAS].sort((a, b) => a.coords.y - b.coords.y), [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setActive(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <section id="service-map" className="bg-charcoal-900 py-20 sm:py-24" aria-labelledby="map-heading">
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,640px)] gap-10 lg:gap-14 items-center">
          <div className="lg:order-1 order-2">
            <span className="badge-orange mb-4">{t('map.badge')}</span>
            <h2 id="map-heading" className="section-title mt-3">
              {t('map.heading')}
            </h2>
            <p className="section-subtitle mt-4 max-w-md">{t('map.sub')}</p>

            <div className="mt-7 grid grid-cols-2 gap-x-5 gap-y-2 max-w-sm">
              {ordered.map((area) => (
                <Link
                  key={area.slug}
                  href={`/areas/${area.slug}`}
                  className="text-sm text-steel-300 hover:text-bone-100 transition-colors flex items-center gap-2"
                  onMouseEnter={() => setActive(area.slug)}
                  onMouseLeave={() => setActive((c) => (c === area.slug ? null : c))}
                  onFocus={() => setActive(area.slug)}
                  onBlur={() => setActive((c) => (c === area.slug ? null : c))}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      area.isHomeBase ? 'bg-orange-500' : 'bg-orange-400/50'
                    }`}
                    aria-hidden="true"
                  />
                  {area.city}
                </Link>
              ))}
            </div>

            <a href="#quote" className="btn-primary mt-9">
              Request Pickup
            </a>
          </div>

          <div
            className="relative w-full aspect-[10/11] lg:order-2 order-1"
            role="region"
            aria-label="Peninsula service area map"
          >
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="absolute inset-0 w-full h-full"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <linearGradient id="ppu-land-fill" x1="20%" y1="0%" x2="80%" y2="100%">
                  <stop offset="0%" stopColor="#1c1c1c" />
                  <stop offset="100%" stopColor="#111111" />
                </linearGradient>
                <linearGradient id="ppu-land-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#404040" />
                  <stop offset="100%" stopColor="#2a2a2a" />
                </linearGradient>
                <radialGradient id="ppu-glow" cx="62%" cy="68%" r="38%">
                  <stop offset="0%" stopColor="rgba(232,93,26,0.10)" />
                  <stop offset="100%" stopColor="rgba(232,93,26,0)" />
                </radialGradient>
              </defs>

              <rect x="0" y="0" width={W} height={H} fill="url(#ppu-glow)" />

              <path
                d={LAND_PATH}
                fill="url(#ppu-land-fill)"
                stroke="url(#ppu-land-stroke)"
                strokeWidth="3"
                strokeLinejoin="round"
              />

              <path
                d={SPINE_PATH}
                fill="none"
                stroke="#2e2e2e"
                strokeWidth="1.6"
                strokeDasharray="4 9"
                strokeLinecap="round"
              />

              {/* Compass + region labels — pure decoration */}
              <g aria-hidden="true">
                <line x1="940" y1="50" x2="940" y2="92" stroke="#3a3a3a" strokeWidth="1.4" strokeLinecap="round" />
                <polygon points="934,58 940,42 946,58" fill="#3a3a3a" />
                <text x="940" y="120" fill="#4a4a4a" fontSize="18" fontWeight="600" letterSpacing="2" textAnchor="middle">
                  N
                </text>
                <text x="820" y="320" fill="#3a3a3a" fontSize="13" letterSpacing="3" textAnchor="middle">
                  SF BAY
                </text>
                <g transform="rotate(-90 130 700)">
                  <text x="130" y="700" fill="#3a3a3a" fontSize="13" letterSpacing="3" textAnchor="middle">
                    PACIFIC
                  </text>
                </g>
              </g>
            </svg>

            <div className="absolute inset-0">
              {ordered.map((area, i) => {
                const leftPct = (area.coords.x / W) * 100
                const topPct = (area.coords.y / H) * 100
                const isActive = active === area.slug
                const flip = leftPct > 55
                return (
                  <motion.div
                    key={area.slug}
                    className="absolute"
                    style={{ left: `${leftPct}%`, top: `${topPct}%`, transform: 'translate(-50%, -50%)' }}
                    initial={reduce ? false : { opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: reduce ? 0 : 0.05 * i,
                      duration: reduce ? 0 : 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      href={`/areas/${area.slug}`}
                      aria-label={`${area.city}, CA — ${area.services.length} services. Open city page.`}
                      onMouseEnter={() => setActive(area.slug)}
                      onMouseLeave={() => setActive((c) => (c === area.slug ? null : c))}
                      onFocus={() => setActive(area.slug)}
                      onBlur={() => setActive((c) => (c === area.slug ? null : c))}
                      className={`relative grid place-items-center w-7 h-7 rounded-full transition-transform duration-200 ${
                        isActive ? 'scale-110' : 'hover:scale-105'
                      }`}
                    >
                      <span
                        className={`w-3 h-3 rounded-full ${
                          area.isHomeBase
                            ? 'bg-orange-500 shadow-orange-glow animate-pulse-glow'
                            : 'bg-orange-400'
                        }`}
                        aria-hidden="true"
                      />
                      <span
                        className={`absolute inset-0 rounded-full border ${
                          area.isHomeBase
                            ? 'border-orange-500/60'
                            : isActive
                              ? 'border-orange-400/70'
                              : 'border-orange-400/30'
                        }`}
                        aria-hidden="true"
                      />
                      <span className="sr-only">{area.city}, CA</span>
                    </Link>

                    {isActive && <MarkerCard area={area} flip={flip} />}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
