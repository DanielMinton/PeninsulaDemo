import FadeIn from '@/components/motion/FadeIn'

const SERVICES = [
  {
    title: 'Junk Removal',
    description:
      'Full-property junk removal for homes, garages, yards, and estates. We load it, haul it, and leave the space clean.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path
          d="M5 8h18M7 8V6a2 2 0 012-2h10a2 2 0 012 2v2M10 13v7M14 13v7M18 13v7M6 8l1.5 16h13L22 8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Construction Debris Removal',
    description:
      'Post-renovation cleanup, demolition debris, drywall, wood, concrete, and contractor scraps hauled away fast.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path
          d="M4 22l4-4 4 4 4-4 4 4M7 14l7-7 7 7M14 7V3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Appliance Removal',
    description:
      'Refrigerators, washers, dryers, stoves, and more. We disconnect, remove, and haul away old appliances safely.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="6" y="4" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M6 10h16M10 7h.01M14 7h4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="14" cy="17" r="3" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    title: 'Storage Cleanouts',
    description:
      'Cleared-out storage units, garages, and storage rooms. We handle sorting, hauling, and full property cleanup.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path
          d="M4 8h20v14a2 2 0 01-2 2H6a2 2 0 01-2-2V8zM4 8l3-4h14l3 4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M10 14h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Eviction Cleanouts',
    description:
      'Full property clearance for landlords and property managers following tenant evictions. Efficient, professional, discreet.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path
          d="M4 24V12l10-8 10 8v12M10 24v-8h8v8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Commercial Hauling',
    description:
      'Office furniture, retail fixtures, warehouse pallets, and commercial-scale debris. We handle jobs big and small.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path
          d="M3 17h14V7H3v10zM17 11h4l4 4v2h-8V11zM7 17v3M20 17v3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="7" cy="21" r="2" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="20" cy="21" r="2" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
]

export default function ServicesGrid() {
  return (
    <section id="services" className="bg-charcoal-900 py-24" aria-labelledby="services-heading">
      <div className="container-max section-padding">
        <FadeIn>
          <div className="mb-14">
            <span className="badge-orange mb-4">What We Do</span>
            <h2 id="services-heading" className="section-title mt-3">
              Full-Service Hauling
              <br />
              <span className="text-steel-400">From One Item to the Whole Property</span>
            </h2>
            <p className="section-subtitle max-w-2xl mt-4">
              Peninsula Pick Ups handles residential and commercial jobs across the Peninsula. Whatever needs to go, we
              load it up and clear it out.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((service, i) => (
            <FadeIn key={service.title} delay={i * 0.08} direction="up">
              <article className="card-base card-hover p-6 h-full flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 flex-shrink-0">
                  {service.icon}
                </div>
                <div>
                  <h3 className="font-bold text-bone-100 text-lg mb-2">{service.title}</h3>
                  <p className="text-steel-400 text-sm leading-relaxed">{service.description}</p>
                </div>
                <div className="mt-auto pt-2">
                  <a
                    href="#quote"
                    className="text-orange-500 hover:text-orange-400 text-sm font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    Get a quote
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path
                        d="M2 6h8M6 2l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
