import FadeIn from '@/components/motion/FadeIn'

const PHONE = '(650) 201-1543'
const PHONE_RAW = 'tel:+16502011543'

const TRUST_ITEMS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M10 1l1.94 5.97h6.28L13.14 10.5l1.94 5.97L10 13l-5.08 3.47 1.94-5.97L1.78 6.97h6.28L10 1z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: 'San Carlos, CA 94070',
    sublabel: 'Home Base',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 9h14M7 2v3M13 2v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    label: 'Established 2021',
    sublabel: 'Operating since 2021',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M17 13.4v2.6a1.6 1.6 0 01-1.74 1.6A15.8 15.8 0 013.4 3.74 1.6 1.6 0 015 2h2.6a1.6 1.6 0 011.6 1.37c.25 1.49.68 2.91 1.26 4.26a1.6 1.6 0 01-.36 1.69l-1.1 1.1a12.8 12.8 0 006.94 6.94l1.1-1.1a1.6 1.6 0 011.69-.36c1.35.58 2.77 1 4.26 1.26A1.6 1.6 0 0117 13.4z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: PHONE,
    sublabel: 'Verified Business Line',
    href: PHONE_RAW,
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M13 7a3 3 0 11-6 0 3 3 0 016 0zM5 17a7 7 0 1110 0H5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: 'Don and Melissa',
    sublabel: 'Local Owners',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M10 1.67L12.57 7H18l-4.36 3.18 1.66 5.13L10 12.13l-5.3 3.18 1.66-5.13L2 7h5.43L10 1.67z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: 'Licensed and Insured',
    sublabel: 'Professional Service',
  },
]

export default function VerifyStrip() {
  return (
    <section className="bg-charcoal-800 border-y border-charcoal-600" aria-label="Business verification">
      <FadeIn>
        <div className="container-max section-padding py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {TRUST_ITEMS.map((item) => {
              const content = (
                <div
                  key={item.label}
                  className="flex flex-col items-center text-center gap-2 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 group-hover:bg-orange-500/20 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-bold text-bone-100 text-sm leading-tight">{item.label}</p>
                    <p className="text-steel-500 text-xs mt-0.5">{item.sublabel}</p>
                  </div>
                </div>
              )

              return item.href ? (
                <a key={item.label} href={item.href} className="contents">
                  {content}
                </a>
              ) : (
                <div key={item.label}>{content}</div>
              )
            })}
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
