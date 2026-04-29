'use client'
import { motion } from 'framer-motion'

const PHONE = '(650) 201-1543'
const PHONE_RAW = 'tel:+16502011543'

const SERVICES = [
  'Junk Removal',
  'Construction Debris',
  'Appliance Removal',
  'Storage Cleanouts',
  'Eviction Cleanouts',
  'Commercial Hauling',
]

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-charcoal-900 bg-grid-subtle"
      aria-label="Peninsula Pick Ups hero"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 10% 20%, rgba(232,93,26,0.07) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 90% 80%, rgba(232,93,26,0.04) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #0f0f0f 0%, transparent 100%)' }}
        aria-hidden="true"
      />

      <div className="relative container-max section-padding w-full pt-28 pb-20">
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <span className="badge-verify">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.53 2.22a.75.75 0 010 1.06L4.53 7.28a.75.75 0 01-1.06 0L1.47 5.28a.75.75 0 011.06-1.06L4 5.69l3.47-3.47a.75.75 0 011.06 0z"
                />
              </svg>
              San Carlos, CA. Licensed and insured since 2021.
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-bone-100 leading-none tracking-tight mb-6"
          >
            The Pickup
            <br />
            <span
              style={{
                background: 'linear-gradient(90deg, #f07030 0%, #e85d1a 50%, #c44d14 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              You Can Count On.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl sm:text-2xl text-steel-300 max-w-2xl leading-relaxed mb-10"
          >
            Peninsula Pick Ups handles junk removal, hauling, and full-property cleanouts across San Carlos and the
            entire Peninsula. Real owners. Real phone. Real results.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mb-10"
          >
            <a href={PHONE_RAW} className="inline-flex items-center gap-4 group">
              <div className="w-12 h-12 bg-orange-500/15 border border-orange-500/30 rounded-full flex items-center justify-center group-hover:bg-orange-500/25 transition-colors">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  className="text-orange-400"
                  aria-hidden="true"
                >
                  <path
                    d="M16.5 12.66v2.1a1.4 1.4 0 01-1.53 1.4A13.85 13.85 0 012.84 3.03 1.4 1.4 0 014.24 1.5H6.34c.7 0 1.3.5 1.41 1.2.22 1.3.6 2.55 1.1 3.73a1.4 1.4 0 01-.32 1.49l-.87.87a11.2 11.2 0 006.08 6.08l.87-.87a1.4 1.4 0 011.49-.32c1.18.5 2.43.88 3.73 1.1.7.11 1.2.71 1.2 1.41l-.04.47z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-steel-400 font-medium uppercase tracking-widest mb-1">Verified Business Line</p>
                <p className="text-3xl font-black text-orange-500 group-hover:text-orange-400 transition-colors tabular-nums tracking-tight">
                  {PHONE}
                </p>
              </div>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a href="#quote" className="btn-primary text-lg px-8 py-4 animate-pulse-glow">
              Request a Pickup
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a href={PHONE_RAW} className="btn-secondary text-lg px-8 py-4">
              Call Now
            </a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="mt-12 flex flex-wrap gap-x-6 gap-y-2"
            aria-label="Services offered"
          >
            {SERVICES.map((service) => (
              <li key={service} className="flex items-center gap-2 text-sm text-steel-400">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" aria-hidden="true" />
                {service}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-steel-600"
        aria-hidden="true"
      >
        <span className="text-xs uppercase tracking-widest font-medium">Scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 5l4.5 4.5L11.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
