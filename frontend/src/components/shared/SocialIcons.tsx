import { SITE, type SocialId } from '@/content/site'

interface IconProps {
  size?: number
}

function InstagramIcon({ size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0022 12z" />
    </svg>
  )
}

function YelpWordmark({ size = 11 }: IconProps) {
  return (
    <span className="font-black leading-none" style={{ color: '#d32323', fontSize: `${size}px` }}>
      yelp
    </span>
  )
}

function NextdoorIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2L2 11h3v11h5v-7h4v7h5V11h3L12 2z" />
    </svg>
  )
}

function AlignableIcon({ size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8M8 8h8M8 16h8" />
    </svg>
  )
}

function JunkSpotsIcon({ size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18l-1.5 14a2 2 0 01-2 1.8H6.5a2 2 0 01-2-1.8L3 6z" />
      <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
      <path d="M9 11v6M15 11v6M12 11v6" />
    </svg>
  )
}

function GoogleIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21.35 11.1H12v3.83h5.34A5.7 5.7 0 0112 18.5a6.5 6.5 0 110-13 6.16 6.16 0 014.36 1.7l2.7-2.7A10 10 0 1022 12a8.4 8.4 0 00-.65-.9z"
        fill="currentColor"
      />
    </svg>
  )
}

const ICONS: Record<SocialId, (p: IconProps) => JSX.Element> = {
  yelp: YelpWordmark,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  nextdoor: NextdoorIcon,
  alignable: AlignableIcon,
  junkspots: JunkSpotsIcon,
  google: GoogleIcon,
}

export default function SocialIcons() {
  return (
    <ul className="flex flex-wrap items-center gap-2.5" aria-label="Verified profiles">
      {SITE.socials.map((s) => {
        const Icon = ICONS[s.id]
        return (
          <li key={s.id}>
            <a
              href={s.url}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label={`${SITE.name} on ${s.label}`}
              className="w-9 h-9 rounded-lg bg-charcoal-700 border border-charcoal-600 hover:border-orange-500/40 flex items-center justify-center text-steel-400 hover:text-bone-200 transition-all"
            >
              <Icon />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
