import FadeIn from '@/components/motion/FadeIn'

const PHONE = '(650) 201-1543'
const PHONE_RAW = 'tel:+16502011543'

export default function TestimonialsSection() {
  return (
    <section className="bg-charcoal-800 py-24" aria-labelledby="testimonials-heading">
      <div className="container-max section-padding">
        <FadeIn>
          <div className="mb-12">
            <span className="badge-verify mb-4">Customer Reviews</span>
            <h2 id="testimonials-heading" className="section-title mt-3">
              What Customers Say
            </h2>
            <p className="section-subtitle mt-3 max-w-xl">
              Verified customer testimonials will be added after owner review. Peninsula Pick Ups does not publish
              reviews that cannot be confirmed.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {[1, 2, 3].map((i) => (
            <FadeIn key={i} delay={i * 0.1} direction="up">
              <div className="card-base p-6 flex flex-col gap-4 h-full">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path
                        d="M7 1.5l1.35 4.16H12.7L9.18 8.09l1.35 4.17L7 9.83l-3.53 2.43 1.35-4.17L1.3 5.66h4.35L7 1.5z"
                        className="fill-charcoal-600 stroke-charcoal-500"
                        strokeWidth="1"
                      />
                    </svg>
                  ))}
                </div>
                <div className="flex-1">
                  <div className="h-16 flex items-center justify-center rounded-lg bg-charcoal-700/50 border border-dashed border-charcoal-500">
                    <p className="text-steel-600 text-xs text-center px-4">
                      Verified customer review pending owner approval
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2 border-t border-charcoal-600">
                  <div className="w-8 h-8 rounded-full bg-charcoal-600 border border-charcoal-500" />
                  <div>
                    <p className="text-steel-500 text-xs font-medium">Customer Name</p>
                    <p className="text-steel-600 text-xs">Service Pending Verification</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2}>
          <div className="max-w-2xl mx-auto text-center p-8 rounded-2xl bg-charcoal-700 border border-charcoal-500">
            <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/20 rounded-full flex items-center justify-center text-orange-400 mx-auto mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
              If Peninsula Pick Ups did the job for you, we would love to hear about it. Reviews from confirmed
              customers help the community find a reliable local service.
            </p>
            <a href={PHONE_RAW} className="btn-primary justify-center">
              Call Us at {PHONE}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
