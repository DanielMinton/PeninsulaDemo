import Link from 'next/link'
import { SERVICE_AREAS } from '@/lib/serviceAreas'

const PHONE = '(650) 201-1543'
const PHONE_RAW = 'tel:+16502011543'

const SERVICES = [
  { label: 'Junk Removal', href: '#services' },
  { label: 'Construction Debris Removal', href: '#services' },
  { label: 'Appliance Removal', href: '#services' },
  { label: 'Storage Cleanouts', href: '#services' },
  { label: 'Eviction Cleanouts', href: '#services' },
  { label: 'Commercial Hauling', href: '#services' },
  { label: 'Residential Cleanouts', href: '#services' },
]

function PUPLogo() {
  return (
    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M3 12L8 4L13 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.5 12H10.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="contact" className="bg-charcoal-950 border-t border-charcoal-600">
      <div className="container-max section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <PUPLogo />
              <span className="font-bold text-bone-100">Peninsula Pick Ups</span>
            </div>
            <p className="text-steel-400 text-sm leading-relaxed mb-5">
              Licensed junk removal and hauling on the San Francisco Peninsula. Family owned and operated by Don and
              Melissa since 2021.
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-bone-300 flex items-center gap-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="text-steel-500 flex-shrink-0"
                  aria-hidden="true"
                >
                  <path
                    d="M7 1C4.79 1 3 2.79 3 5c0 3.25 4 8 4 8s4-4.75 4-8c0-2.21-1.79-4-4-4z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="7" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                San Carlos, CA 94070
              </p>
              <a href={PHONE_RAW} className="phone-display text-base flex items-center gap-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="flex-shrink-0"
                  aria-hidden="true"
                >
                  <path
                    d="M12.25 9.81v1.87c0 .39-.32.7-.7.68A8.3 8.3 0 011.82 2.45a.68.68 0 01.68-.7H4.37c.36 0 .67.26.72.62.13.78.37 1.52.7 2.22a.66.66 0 01-.15.71l-.72.72a8.19 8.19 0 004.1 4.1l.72-.72a.66.66 0 01.71-.15c.7.33 1.44.57 2.22.7.36.05.62.36.62.72l-.04.14z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {PHONE}
              </a>
              <a
                href="https://thepeninsulapickup.com"
                className="text-steel-500 hover:text-steel-400 transition-colors text-xs"
              >
                thepeninsulapickup.com
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-bone-200 mb-4 text-xs uppercase tracking-widest">Services</h3>
            <ul className="space-y-2.5">
              {SERVICES.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="text-steel-400 hover:text-bone-200 text-sm transition-colors">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-bone-200 mb-4 text-xs uppercase tracking-widest">Service Areas</h3>
            <ul className="space-y-2.5">
              {SERVICE_AREAS.slice(0, 8).map((area) => (
                <li key={area.slug}>
                  <Link href={`/${area.slug}`} className="text-steel-400 hover:text-bone-200 text-sm transition-colors">
                    {area.city}, CA
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-bone-200 mb-4 text-xs uppercase tracking-widest">Get a Quote</h3>
            <p className="text-steel-400 text-sm mb-5 leading-relaxed">
              Ready to clear it out? Request a free quote or call us directly. We respond fast.
            </p>
            <div className="flex flex-col gap-3">
              <a href="#quote" className="btn-primary text-sm justify-center py-3">
                Request Pickup
              </a>
              <a href={PHONE_RAW} className="btn-secondary text-sm justify-center py-3">
                Call {PHONE}
              </a>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="badge-verify">Licensed</span>
              <span className="badge-verify">Insured</span>
              <span className="badge-verify">Local</span>
            </div>

            <div className="mt-6">
              <p className="text-steel-500 text-xs uppercase tracking-widest font-semibold mb-3">Find Us Online</p>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/peninsulapickups/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-charcoal-700 border border-charcoal-600 hover:border-orange-500/40 flex items-center justify-center text-steel-400 hover:text-bone-200 transition-all"
                  aria-label="Peninsula Pick Ups on Instagram"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a
                  href="https://www.yelp.com/biz/peninsula-pick-ups-san-carlos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-charcoal-700 border border-charcoal-600 hover:border-orange-500/40 flex items-center justify-center hover:opacity-80 transition-all"
                  aria-label="Peninsula Pick Ups on Yelp"
                >
                  <span className="font-black leading-none" style={{ color: '#d32323', fontSize: '11px' }}>yelp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="divider mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-steel-500 text-xs text-center sm:text-left">
            &copy; {year} Peninsula Pick Ups. San Carlos, CA 94070. All rights reserved.
          </p>
          <div className="flex gap-5 text-xs">
            <Link href="/privacy" className="text-steel-500 hover:text-steel-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-steel-500 hover:text-steel-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
