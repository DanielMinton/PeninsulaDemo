import FadeIn from '@/components/motion/FadeIn'
import { SITE } from '@/content/site'
import { REVIEWS, TOTAL_REVIEW_COUNT } from '@/content/reviews'

const YELP_URL = SITE.socials.find((s) => s.id === 'yelp')!.url
const NEXTDOOR_URL = SITE.socials.find((s) => s.id === 'nextdoor')!.url

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${count} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M7 1.5l1.35 4.16H12.7L9.18 8.09l1.35 4.17L7 9.83l-3.53 2.43 1.35-4.17L1.3 5.66h4.35L7 1.5z"
            className={i < count ? 'fill-orange-500 stroke-orange-400' : 'fill-charcoal-600 stroke-charcoal-500'}
            strokeWidth="0.5"
          />
        </svg>
      ))}
    </div>
  )
}

function YelpWordmark() {
  return (
    <span className="font-black tracking-tight" style={{ color: '#d32323', fontSize: '13px' }}>
      yelp
    </span>
  )
}

export default function TestimonialsSection() {
  return (
    <section className="bg-charcoal-800 py-24" aria-labelledby="testimonials-heading">
      <div className="container-max section-padding">
        <FadeIn>
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <span className="badge-verify mb-4">Customer Reviews</span>
              <h2 id="testimonials-heading" className="section-title mt-3">
                What Customers Say
              </h2>
              <p className="section-subtitle mt-3 max-w-xl">
                Real reviews from customers across the Peninsula. {SITE.name} has {TOTAL_REVIEW_COUNT} reviews and
                counting on Yelp, plus recommendations on Nextdoor and Alignable.
              </p>
            </div>
            <div className="flex-shrink-0 flex flex-wrap items-center gap-2">
              <a
                href={YELP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-charcoal-600 bg-charcoal-700 hover:border-charcoal-500 transition-colors text-sm"
              >
                <YelpWordmark />
                <span className="text-steel-400">{TOTAL_REVIEW_COUNT} reviews</span>
              </a>
              <a
                href={NEXTDOOR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-verify-500/30 bg-verify-500/5 hover:bg-verify-500/10 transition-colors text-sm text-verify-400"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                  <path d="M6 1L1 5h1.5v6h2.5V8h2v3h2.5V5H11L6 1z" />
                </svg>
                Recommended on Nextdoor
              </a>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {REVIEWS.map((review, i) => (
            <FadeIn key={i} delay={i * 0.1} direction="up">
              <article className="card-base p-6 flex flex-col gap-4 h-full">
                <div className="flex items-center justify-between">
                  <StarRating count={review.rating} />
                  <a
                    href={review.url ?? YELP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-75 transition-opacity"
                    aria-label={`View on ${review.source}`}
                  >
                    <YelpWordmark />
                  </a>
                </div>

                <blockquote className="flex-1">
                  <p className="text-bone-200 text-sm leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                </blockquote>

                <div className="flex items-center gap-3 pt-3 border-t border-charcoal-600">
                  <div
                    className="w-8 h-8 rounded-full bg-orange-500/15 border border-orange-500/20 flex items-center justify-center text-orange-400 flex-shrink-0"
                    aria-hidden="true"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M7 1.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM2.5 12a4.5 4.5 0 019 0"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-bone-300 text-xs font-semibold">Verified {review.source} customer</p>
                    <p className="text-steel-500 text-xs mt-0.5">
                      {review.service} &middot; {review.city}, CA
                    </p>
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.25}>
          <div className="max-w-2xl mx-auto text-center p-8 rounded-2xl bg-charcoal-700 border border-charcoal-500">
            <div
              className="w-14 h-14 bg-orange-500/10 border border-orange-500/20 rounded-full flex items-center justify-center text-orange-400 mx-auto mb-5"
              aria-hidden="true"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="font-bold text-bone-100 text-xl mb-3">Had a Good Experience?</h3>
            <p className="text-steel-400 text-sm leading-relaxed mb-6">
              If {SITE.name} hauled for you, we&apos;d love to hear about it. Reviews from confirmed customers help
              neighbors find a reliable local service.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={YELP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm py-2.5 px-5 justify-center w-full sm:w-auto"
              >
                Leave a Yelp Review
              </a>
              <a href={SITE.phone.href} className="btn-primary justify-center w-full sm:w-auto">
                Call {SITE.phone.display}
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
