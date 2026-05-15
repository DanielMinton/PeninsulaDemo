'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { AREAS, type Area } from '@/content/areas'
import { MAP_VIEWBOX, latLngToSvg, routePath, type Point } from '@/lib/map-projection'

const W = MAP_VIEWBOX.width
const H = MAP_VIEWBOX.height
const ROUTE_AUTOCLEAR_MS = 8000

interface ProjectedArea extends Area {
  svg: Point
}

const PROJECTED: readonly ProjectedArea[] = AREAS.map((a) => ({
  ...a,
  svg: latLngToSvg(a.geo.lat, a.geo.lng),
}))

const HOME = PROJECTED.find((a) => a.isHomeBase) as ProjectedArea

interface Highway {
  name: string
  label: { lat: number; lng: number }
  coords: ReadonlyArray<readonly [number, number]>
}

const HIGHWAYS: readonly Highway[] = [
  {
    name: '101',
    label: { lat: 37.538, lng: -122.302 },
    coords: [
      [37.715, -122.402],
      [37.69, -122.412],
      [37.658, -122.408],
      [37.628, -122.408],
      [37.612, -122.387],
      [37.583, -122.355],
      [37.56, -122.327],
      [37.52, -122.275],
      [37.495, -122.235],
      [37.47, -122.205],
      [37.445, -122.165],
      [37.43, -122.15],
      [37.405, -122.118],
    ],
  },
  {
    name: '280',
    label: { lat: 37.51, lng: -122.38 },
    coords: [
      [37.71, -122.46],
      [37.68, -122.467],
      [37.65, -122.475],
      [37.62, -122.46],
      [37.575, -122.435],
      [37.535, -122.395],
      [37.5, -122.355],
      [37.465, -122.305],
      [37.432, -122.25],
      [37.41, -122.183],
      [37.398, -122.14],
    ],
  },
  {
    name: '92',
    label: { lat: 37.555, lng: -122.45 },
    coords: [
      [37.5, -122.495],
      [37.515, -122.43],
      [37.54, -122.38],
      [37.555, -122.325],
      [37.58, -122.23],
      [37.605, -122.15],
    ],
  },
  {
    name: '84',
    label: { lat: 37.482, lng: -122.205 },
    coords: [
      [37.43, -122.26],
      [37.46, -122.225],
      [37.485, -122.19],
      [37.495, -122.15],
    ],
  },
  {
    name: '380',
    label: { lat: 37.638, lng: -122.438 },
    coords: [
      [37.633, -122.405],
      [37.633, -122.43],
      [37.638, -122.452],
    ],
  },
]

function highwayPoints(coords: ReadonlyArray<readonly [number, number]>): string {
  return coords
    .map(([lat, lng]) => {
      const p = latLngToSvg(lat, lng)
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`
    })
    .join(' ')
}

interface CardProps {
  area: ProjectedArea
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
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const ordered = useMemo(() => [...PROJECTED].sort((a, b) => a.svg.y - b.svg.y), [])

  function activate(slug: string, autoclear: boolean) {
    setActive(slug)
    if (clearTimer.current) clearTimeout(clearTimer.current)
    if (autoclear) clearTimer.current = setTimeout(() => setActive(null), ROUTE_AUTOCLEAR_MS)
  }
  function deactivate(slug: string) {
    setActive((c) => (c === slug ? null : c))
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setActive(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(
    () => () => {
      if (clearTimer.current) clearTimeout(clearTimer.current)
    },
    [],
  )

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
                  onMouseEnter={() => activate(area.slug, false)}
                  onMouseLeave={() => deactivate(area.slug)}
                  onFocus={() => activate(area.slug, false)}
                  onBlur={() => deactivate(area.slug)}
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
            className="relative w-full aspect-[10/11] lg:order-2 order-1 rounded-2xl overflow-hidden ring-1 ring-charcoal-500/40"
            role="region"
            aria-label="Peninsula service area map"
          >
            <Image
              src="/maps/peninsula-basemap.webp"
              alt=""
              aria-hidden="true"
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 640px, 100vw"
              className="object-cover opacity-30"
            />

            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="absolute inset-0 w-full h-full"
              aria-hidden="true"
              focusable="false"
              preserveAspectRatio="xMidYMid slice"
            >
              <g aria-hidden="true" opacity="0.2">
                <g fill="none" stroke="rgba(255,255,255,1)" strokeLinecap="round" strokeLinejoin="round">
                  {HIGHWAYS.map((hw) => (
                    <polyline key={`hw-${hw.name}`} points={highwayPoints(hw.coords)} strokeWidth="6" />
                  ))}
                </g>
                <g
                  fill="rgba(255,255,255,1)"
                  stroke="rgba(0,0,0,0.85)"
                  strokeWidth="3"
                  paintOrder="stroke"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  fontSize="20"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {HIGHWAYS.map((hw) => {
                    const p = latLngToSvg(hw.label.lat, hw.label.lng)
                    return (
                      <text key={`hwl-${hw.name}`} x={p.x} y={p.y}>
                        {hw.name}
                      </text>
                    )
                  })}
                </g>
              </g>

              {ordered
                .filter((a) => !a.isHomeBase)
                .map((area) => {
                  const isActive = active === area.slug
                  return (
                    <motion.path
                      key={`route-${area.slug}`}
                      d={routePath(HOME.svg, area.svg)}
                      fill="none"
                      stroke="rgba(20,184,166,0.85)"
                      strokeWidth="2.2"
                      strokeDasharray="6 7"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{
                        pathLength: isActive ? 1 : 0,
                        opacity: isActive ? 1 : 0,
                      }}
                      transition={{
                        duration: reduce ? 0 : isActive ? 0.6 : 0.25,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                  )
                })}

              <g
                aria-hidden="true"
                fill="rgba(255,255,255,0.7)"
                stroke="rgba(0,0,0,0.65)"
                strokeWidth="3.5"
                paintOrder="stroke"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                <text x="830" y="280" fontSize="18" letterSpacing="4" fontWeight="600" textAnchor="middle">
                  SF BAY
                </text>
                <text x="500" y="60" fontSize="13" letterSpacing="5" fontWeight="500" textAnchor="middle" opacity="0.65">
                  ↑ SAN FRANCISCO
                </text>
                <text x="900" y="1060" fontSize="13" letterSpacing="5" fontWeight="500" textAnchor="end" opacity="0.65">
                  SAN JOSE →
                </text>
                <g transform="rotate(-90 80 620)">
                  <text x="80" y="620" fontSize="18" letterSpacing="4" fontWeight="600" textAnchor="middle">
                    PACIFIC
                  </text>
                </g>
                <text
                  x={HOME.svg.x}
                  y={HOME.svg.y - 26}
                  fontSize="12"
                  letterSpacing="2.5"
                  fontWeight="700"
                  textAnchor="middle"
                  fill="rgba(20,184,166,1)"
                  stroke="rgba(0,0,0,0.7)"
                  strokeWidth="3.5"
                  paintOrder="stroke"
                >
                  HOME BASE
                </text>
              </g>

              <g aria-hidden="true">
                <line
                  x1="940"
                  y1="50"
                  x2="940"
                  y2="92"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <polygon points="934,58 940,42 946,58" fill="rgba(255,255,255,0.4)" />
                <text
                  x="940"
                  y="120"
                  fill="rgba(255,255,255,0.55)"
                  stroke="rgba(0,0,0,0.55)"
                  strokeWidth="3"
                  paintOrder="stroke"
                  fontSize="18"
                  fontWeight="600"
                  letterSpacing="2"
                  textAnchor="middle"
                >
                  N
                </text>
              </g>
            </svg>

            <div className="absolute inset-0">
              {ordered.map((area, i) => {
                const leftPct = (area.svg.x / W) * 100
                const topPct = (area.svg.y / H) * 100
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
                      onMouseEnter={() => activate(area.slug, false)}
                      onMouseLeave={() => deactivate(area.slug)}
                      onFocus={() => activate(area.slug, false)}
                      onBlur={() => deactivate(area.slug)}
                      onTouchStart={() => activate(area.slug, true)}
                      className={`relative grid place-items-center w-7 h-7 rounded-full transition-transform duration-200 ${
                        isActive ? 'scale-110' : 'hover:scale-105'
                      }`}
                    >
                      <span
                        className={`w-3 h-3 rounded-full ${
                          area.isHomeBase
                            ? `bg-orange-500 shadow-orange-glow ${reduce ? '' : 'animate-pulse-glow'}`
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

                    <span
                      aria-hidden="true"
                      className={`absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold pointer-events-none transition-colors ${
                        isActive ? 'text-white' : 'text-bone-100'
                      }`}
                      style={{
                        textShadow:
                          '0 0 4px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.9), 0 0 1px rgba(0,0,0,1)',
                      }}
                    >
                      {area.city}
                    </span>

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
