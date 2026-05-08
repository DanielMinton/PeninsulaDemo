import FadeIn from '@/components/motion/FadeIn'
import { SITE } from '@/content/site'
import type { FAQ } from '@/content/services'

interface Props {
  faqs: readonly FAQ[]
  heading?: string
  intro?: string
}

export default function FaqSection({ faqs, heading = 'Frequently Asked Questions', intro }: Props) {
  if (faqs.length === 0) return null
  return (
    <section className="bg-charcoal-900 py-24" aria-labelledby="faq-heading">
      <div className="container-max section-padding max-w-4xl">
        <FadeIn>
          <span className="badge-orange mb-4">FAQ</span>
          <h2 id="faq-heading" className="section-title mt-3">
            {heading}
          </h2>
          {intro && <p className="section-subtitle mt-4 max-w-2xl">{intro}</p>}
        </FadeIn>

        <div className="mt-10 space-y-3">
          {faqs.map((faq, i) => (
            <FadeIn key={faq.q} delay={i * 0.04} direction="up">
              <details className="card-base group">
                <summary className="cursor-pointer list-none flex items-start gap-4 p-5 sm:p-6">
                  <span className="flex-1 font-semibold text-bone-100 text-base">{faq.q}</span>
                  <span
                    className="w-7 h-7 rounded-full bg-charcoal-700 border border-charcoal-500 flex items-center justify-center text-orange-400 flex-shrink-0 transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 -mt-1 text-steel-300 text-sm leading-relaxed">
                  {faq.a}
                </div>
              </details>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2}>
          <div className="mt-10 text-center text-steel-400 text-sm">
            More questions?{' '}
            <a href={SITE.phone.href} className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
              Call {SITE.phone.display}
            </a>
            .
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
