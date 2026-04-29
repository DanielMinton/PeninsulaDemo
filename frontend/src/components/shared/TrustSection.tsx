import FadeIn from '@/components/motion/FadeIn'

const PHONE = '(650) 201-1543'
const PHONE_RAW = 'tel:+16502011543'

const TRUST_SIGNALS = [
  {
    title: 'One verified phone number',
    body: `When you call (650) 201-1543, you reach Don and Melissa directly. No call center, no redirects, no runaround.`,
  },
  {
    title: 'Based in San Carlos since 2021',
    body: 'Peninsula Pick Ups was built on the Peninsula and has been serving the community since 2021. We know the neighborhoods, the roads, and what customers here expect.',
  },
  {
    title: 'Real project photos on the way',
    body: 'We back our work with before-and-after documentation on every job. Verified project media is being added continuously.',
  },
  {
    title: 'Transparent pricing, no surprises',
    body: 'Free quotes with no hidden fees. You know the number before we show up, and the price does not change on-site.',
  },
  {
    title: 'Fast scheduling, human response',
    body: 'We respond same day. Most jobs are schedulable within 48 hours. You deal with the owner, not a dispatcher.',
  },
  {
    title: 'Licensed and insured',
    body: 'Peninsula Pick Ups carries proper licensing and insurance for every job. Your property is covered, full stop.',
  },
]

export default function TrustSection() {
  return (
    <section id="about" className="bg-charcoal-800 py-24" aria-labelledby="trust-heading">
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <FadeIn direction="right">
            <div>
              <span className="badge-verify mb-4">Why Peninsula Pick Ups</span>
              <h2 id="trust-heading" className="section-title mt-3">
                Why Customers Trust
                <br />
                the Real Peninsula Pick Ups
              </h2>
              <p className="section-subtitle mt-4 leading-relaxed">
                Don and Melissa built Peninsula Pick Ups on one principle: show up, do the job right, and be reachable.
                No mystery numbers. No vague addresses. A real San Carlos business you can verify.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a href="#quote" className="btn-primary">
                  Request a Free Quote
                </a>
                <a href={PHONE_RAW} className="btn-secondary">
                  Call {PHONE}
                </a>
              </div>

              <div className="mt-10 p-6 rounded-xl bg-charcoal-700 border border-charcoal-500">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 flex-shrink-0">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                      <path
                        d="M11 2a9 9 0 100 18A9 9 0 0011 2zM11 7v4l3 3"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-bone-100 text-base mb-1">Owners: Don and Melissa</p>
                    <p className="text-steel-400 text-sm leading-relaxed">
                      Family-operated out of San Carlos, CA 94070. When you request a quote or call the business line,
                      you reach us directly. That is the point.
                    </p>
                    <p className="mt-2 text-orange-400 font-semibold text-sm">Established 2021 on the Peninsula.</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="left" delay={0.1}>
            <div className="grid grid-cols-1 gap-4">
              {TRUST_SIGNALS.map((signal, i) => (
                <FadeIn key={signal.title} delay={0.08 * i} direction="left">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-charcoal-700/50 border border-charcoal-600 hover:border-verify-500/30 transition-colors group">
                    <div className="w-6 h-6 rounded-full bg-verify-500/15 border border-verify-500/30 flex items-center justify-center text-verify-400 flex-shrink-0 mt-0.5 group-hover:bg-verify-500/25 transition-colors">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M10.29 2.29a1 1 0 010 1.42L5 9l-3.29-3.29a1 1 0 111.42-1.42L5 6.17l3.88-3.88a1 1 0 011.41 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-bone-100 text-sm mb-1">{signal.title}</p>
                      <p className="text-steel-400 text-sm leading-relaxed">{signal.body}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
