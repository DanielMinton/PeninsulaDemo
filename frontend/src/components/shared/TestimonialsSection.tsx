import FadeIn from '@/components/motion/FadeIn'

const PHONE = '(650) 201-1543'
const PHONE_RAW = 'tel:+16502011543'
const YELP_URL = 'https://www.yelp.com/biz/peninsula-pick-ups-san-carlos'

const REVIEWS = [
  {
    text: "Don and crew were super nice and extremely professional, and the prices are VERY competitive. Would definitely recommend to anyone looking for a reliable, affordable junk removal service.",
    service: 'Junk Removal',
    location: 'San Carlos, CA',
    stars: 5,
  },
  {
    text: "Melissa was prompt to reply to my email. Donovan arrived on the scheduled date and on time! He was attentive in not damaging walls and floors when hauling the old stuff.",
    service: 'Appliance Removal',
    location: 'Redwood City, CA',
    stars: 5,
  },
  {
    text: "These people waste no time. They are super efficient, friendly, licensed and insured. The pricing is very reasonable too.",
    service: 'Storage Cleanout',
    location: 'San Mateo, CA',
    stars: 5,
  },
]

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
                Real reviews from customers across the Peninsula. Peninsula Pick Ups has 22 reviews and counting on Yelp.
              </p>
            </div>
            <div className="flex-shrink-0">
              <a
                href={YELP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-charcoal-600 bg-charcoal-700 hover:border-charcoal-500 transition-colors text-sm"
              >
                <YelpWordmark />
                <span className="text-steel-400">22 reviews</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-steel-600" aria-hidden="true">
                  <path d="M2 10L10 2M10 2H5M10 2v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {REVIEWS.map((review, i) => (
            <FadeIn key={i} delay={i * 0.1} direction="up">
              <article className="card-base p-6 flex flex-col gap-4 h-full">
                <div className="flex items-center justify-between">
                  <StarRating count={review.stars} />
                  <a
                    href={YELP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-75 transition-opacity"
                    aria-label="View on Yelp"
                  >
                    <YelpWordmark />
                  </a>
                </div>

                <blockquote className="flex-1">
                  <p className="text-bone-200 text-sm leading-relaxed">
                    &ldquo;{review.text}&rdquo;
                  </p>
                </blockquote>

                <div className="flex items-center gap-3 pt-3 border-t border-charcoal-600">
                  <div className="w-8 h-8 rounded-full bg-orange-500/15 border border-orange-500/20 flex items-center justify-center text-orange-400 flex-shrink-0" aria-hidden="true">
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
                    <p className="text-bone-300 text-xs font-semibold">Verified Yelp Customer</p>
                    <p className="text-steel-500 text-xs mt-0.5">
                      {review.service} &middot; {review.location}
                    </p>
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.25}>
          <div className="max-w-2xl mx-auto text-center p-8 rounded-2xl bg-charcoal-700 border border-charcoal-500">
            <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/20 rounded-full flex items-center justify-center text-orange-400 mx-auto mb-5" aria-hidden="true">
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
              If Peninsula Pick Ups hauled for you, we&apos;d love to hear about it. Reviews from confirmed customers
              help neighbors find a reliable local service.
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
              <a href={PHONE_RAW} className="btn-primary justify-center w-full sm:w-auto">
                Call {PHONE}
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
