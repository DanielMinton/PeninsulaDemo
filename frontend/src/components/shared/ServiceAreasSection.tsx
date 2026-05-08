'use client'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import FadeIn from '@/components/motion/FadeIn'
import { AREAS } from '@/content/areas'
import { getServiceShortName } from '@/content/copy'

export default function ServiceAreasSection() {
  const t = useTranslations()
  return (
    <section id="service-areas" className="bg-charcoal-900 py-24" aria-labelledby="service-areas-heading">
      <div className="container-max section-padding">
        <FadeIn>
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <span className="badge-orange mb-4">{t('serviceAreas.badge')}</span>
              <h2 id="service-areas-heading" className="section-title mt-3">
                {t('serviceAreas.heading')}
              </h2>
              <p className="section-subtitle mt-3 max-w-lg">{t('serviceAreas.subhead')}</p>
            </div>
            <div className="flex-shrink-0">
              <a href="#quote" className="btn-primary">
                {t('serviceAreas.requestPickup')}
              </a>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {AREAS.map((area, i) => (
            <FadeIn key={area.slug} delay={i * 0.05} direction="up">
              <Link
                href={`/areas/${area.slug}`}
                className="card-base card-hover p-5 flex items-start gap-4 group block h-full"
              >
                <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M8 1.5C5.51 1.5 3.5 3.51 3.5 6c0 3.5 4.5 8.5 4.5 8.5S12.5 9.5 12.5 6c0-2.49-2.01-4.5-4.5-4.5z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-bone-100 text-sm group-hover:text-white transition-colors">
                      {area.city}
                    </p>
                    {area.isHomeBase && (
                      <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded-full">
                        {t('serviceAreas.homeBaseTag')}
                      </span>
                    )}
                  </div>
                  <p className="text-steel-500 text-xs">
                    {area.county} {t('serviceAreas.countySuffix')}
                  </p>
                  <p className="text-steel-400 text-xs mt-2 leading-relaxed line-clamp-2">
                    {area.services.slice(0, 3).map((s) => getServiceShortName(s, t)).join(', ')}
                    {area.services.length > 3
                      ? ` ${t('serviceAreas.moreSuffix', { count: area.services.length - 3 })}`
                      : ''}
                  </p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <div className="mt-8 text-center">
            <p className="text-steel-500 text-sm">
              {t('serviceAreas.dontSeeCity')}{' '}
              <a href="#quote" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
                {t('serviceAreas.requestQuoteLink')}
              </a>{' '}
              {t('serviceAreas.weConfirm')}
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
