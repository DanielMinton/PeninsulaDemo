import FadeIn from '@/components/motion/FadeIn'

const PLACEHOLDER_JOBS = [
  { type: 'before', label: 'Before Cleanout', area: 'Storage Unit Clearance', status: 'placeholder' },
  { type: 'after', label: 'After Cleanout', area: 'Storage Unit Clearance', status: 'placeholder' },
  { type: 'before', label: 'Before Debris Removal', area: 'Construction Site', status: 'placeholder' },
  { type: 'after', label: 'After Debris Removal', area: 'Construction Site', status: 'placeholder' },
  { type: 'before', label: 'Before Garage Cleanout', area: 'San Carlos Residential', status: 'placeholder' },
  { type: 'after', label: 'After Garage Cleanout', area: 'San Carlos Residential', status: 'placeholder' },
]

function PlaceholderCard({ type, label, area }: { type: string; label: string; area: string }) {
  const isBefore = type === 'before'
  return (
    <div className="card-base overflow-hidden group">
      <div
        className={`relative h-52 flex items-center justify-center ${
          isBefore
            ? 'bg-gradient-to-br from-charcoal-700 to-charcoal-600'
            : 'bg-gradient-to-br from-charcoal-700/80 to-verify-500/10 border-b border-verify-500/20'
        }`}
      >
        <div className="text-center px-6">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 ${
              isBefore
                ? 'bg-steel-500/15 border border-steel-500/20 text-steel-400'
                : 'bg-verify-500/15 border border-verify-500/30 text-verify-400'
            }`}
          >
            {isBefore ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <p className="text-xs font-semibold text-steel-400 uppercase tracking-wider">
            {isBefore ? 'Before Cleanup' : 'After Cleanup'}
          </p>
          <p className="text-xs text-steel-600 mt-1">Awaiting verified business media</p>
        </div>

        <div
          className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-bold ${
            isBefore ? 'bg-steel-500/20 text-steel-400' : 'bg-verify-500/20 text-verify-400'
          }`}
        >
          {isBefore ? 'BEFORE' : 'AFTER'}
        </div>
      </div>

      <div className="p-4">
        <p className="font-semibold text-bone-200 text-sm">{label}</p>
        <p className="text-steel-500 text-xs mt-0.5">{area}</p>
      </div>
    </div>
  )
}

export default function GallerySection() {
  return (
    <section className="bg-charcoal-950 py-24" aria-labelledby="gallery-heading">
      <div className="container-max section-padding">
        <FadeIn>
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <span className="badge-orange mb-4">Project Proof</span>
              <h2 id="gallery-heading" className="section-title mt-3">
                Before and After
              </h2>
              <p className="section-subtitle mt-3 max-w-lg">
                Peninsula Pick Ups documents every job. Verified project photos from real cleanouts and hauls across the
                Peninsula are being added continuously.
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-charcoal-700 border border-charcoal-600 text-steel-400 text-sm">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M7 1.5A5.5 5.5 0 111 7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M7 4.5V7l1.5 1.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Photos being added by owners
              </div>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PLACEHOLDER_JOBS.map((job, i) => (
            <FadeIn key={`${job.type}-${job.area}-${i}`} delay={i * 0.07} direction="up">
              <PlaceholderCard type={job.type} label={job.label} area={job.area} />
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <div className="mt-10 p-6 rounded-xl bg-charcoal-800 border border-charcoal-600 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path
                  d="M9 1l1.94 5.97h6.28L12.14 10.5l1.94 5.97L9 13l-5.08 3.47 1.94-5.97L.78 6.97h6.28L9 1z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-bone-100 text-sm">Verified customer testimonials will be added after owner review.</p>
              <p className="text-steel-500 text-xs mt-1">
                Peninsula Pick Ups only publishes real reviews from confirmed customers. No fabricated or scraped reviews.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
