'use client'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import FadeIn from '@/components/motion/FadeIn'

const INSTAGRAM_URL = 'https://www.instagram.com/peninsulapickups/'
const YELP_URL = 'https://www.yelp.com/biz/peninsula-pick-ups-san-carlos'

const GALLERY_PHOTOS = [
  {
    src: '/images/gallery/job-work-05.jpeg',
    alt: 'Junk removal job completed by Peninsula Pick Ups',
    labelKey: 'gallerySection.photo1Label' as const,
    locationKey: 'gallerySection.locationSanMateoCounty' as const,
    featured: true,
  },
  {
    src: '/images/gallery/job-work-02.jpeg',
    alt: 'Residential cleanout by Peninsula Pick Ups',
    labelKey: 'gallerySection.photo2Label' as const,
    locationKey: 'gallerySection.locationSanMateoCounty' as const,
    featured: false,
  },
  {
    src: '/images/gallery/job-work-03.jpeg',
    alt: 'Peninsula Pick Ups hauling job',
    labelKey: 'gallerySection.photo3Label' as const,
    locationKey: 'gallerySection.locationPeninsula' as const,
    featured: false,
  },
  {
    src: '/images/gallery/job-debris-01.jpeg',
    alt: 'Brick grill and debris removal by Peninsula Pick Ups',
    labelKey: 'gallerySection.photo4Label' as const,
    locationKey: 'gallerySection.locationSanMateoCounty' as const,
    featured: false,
  },
  {
    src: '/images/gallery/job-work-04.jpeg',
    alt: 'Cleanout and hauling work by Peninsula Pick Ups',
    labelKey: 'gallerySection.photo5Label' as const,
    locationKey: 'gallerySection.locationPeninsula' as const,
    featured: false,
  },
  {
    src: '/images/gallery/job-work-01.jpeg',
    alt: 'Truck loaded with hauled debris on a Peninsula Pick Ups job',
    labelKey: 'gallerySection.photo6Label' as const,
    locationKey: 'gallerySection.locationBayArea' as const,
    featured: false,
  },
] as const

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function YelpWordmark({ size = 14 }: { size?: number }) {
  return (
    <span className="font-black tracking-tight" style={{ color: '#d32323', fontSize: `${size}px` }}>
      yelp
    </span>
  )
}

export default function GallerySection() {
  const t = useTranslations()
  const [featured, ...rest] = GALLERY_PHOTOS
  const grid = rest.slice(0, 6)

  return (
    <section className="bg-charcoal-950 py-24" aria-labelledby="gallery-heading">
      <div className="container-max section-padding">
        <FadeIn>
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <span className="badge-orange mb-4">{t('gallerySection.badge')}</span>
              <h2 id="gallery-heading" className="section-title mt-3">
                {t('gallerySection.heading')}
              </h2>
              <p className="section-subtitle mt-3 max-w-lg">{t('gallerySection.subhead')}</p>
            </div>
            <div className="flex-shrink-0 flex items-center gap-3">
              <a
                href={YELP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-charcoal-800 border border-charcoal-600 hover:border-charcoal-500 transition-colors text-xs"
              >
                <YelpWordmark size={12} />
                <span className="text-steel-400">{t('gallerySection.yelpPhotosCount')}</span>
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-charcoal-800 border border-charcoal-600 hover:border-charcoal-500 transition-colors text-xs text-steel-400"
              >
                <InstagramIcon size={12} />
                {t('gallerySection.instagramPostsCount')}
              </a>
            </div>
          </div>
        </FadeIn>

        {/* Featured hero image */}
        <FadeIn delay={0.05}>
          <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden mb-4 group">
            <Image
              src={featured.src}
              alt={featured.alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1280px"
              priority
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent"
              aria-hidden="true"
            />
            <div className="absolute bottom-4 start-5">
              <p className="text-white font-bold text-sm">{t(featured.labelKey)}</p>
              <p className="text-bone-300 text-xs mt-0.5">{t(featured.locationKey)}</p>
            </div>
          </div>
        </FadeIn>

        {/* Photo grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {grid.map((photo, i) => (
            <FadeIn key={photo.src} delay={i * 0.06} direction="up">
              <div className="relative h-44 sm:h-52 rounded-xl overflow-hidden group">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-hidden="true"
                />
                <div className="absolute bottom-0 start-0 end-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-xs font-semibold">{t(photo.labelKey)}</p>
                  <p className="text-bone-300 text-[10px]">{t(photo.locationKey)}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Instagram CTA */}
        <FadeIn delay={0.3}>
          <div className="rounded-2xl border border-charcoal-600 bg-charcoal-800 overflow-hidden">
            <div className="p-7 sm:p-9 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              <div
                className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-orange-400"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(236,72,153,0.1), rgba(232,93,26,0.15))',
                  border: '1px solid rgba(168,85,247,0.2)',
                }}
                aria-hidden="true"
              >
                <InstagramIcon size={28} />
              </div>

              <div className="flex-1 text-center sm:text-start min-w-0">
                <p className="font-bold text-bone-100 text-lg mb-1">{t('gallerySection.ctaTitle')}</p>
                <p className="text-steel-400 text-sm leading-relaxed">
                  {t('gallerySection.ctaBodyPre')}{' '}
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                  >
                    @peninsulapickups
                  </a>{' '}
                  {t('gallerySection.ctaBodyPost')}
                </p>
              </div>

              <div className="flex-shrink-0 w-full sm:w-auto">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full sm:w-auto justify-center gap-2 py-3 px-6 whitespace-nowrap"
                >
                  <InstagramIcon size={16} />
                  {t('gallerySection.viewAllCta')}
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
