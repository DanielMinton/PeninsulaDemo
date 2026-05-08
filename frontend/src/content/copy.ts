/**
 * Translation accessors for the structured business data in src/content/.
 *
 * The structural shape (slug, formValue, ICONs, geo, neighborhoods) lives
 * in services.ts / areas.ts / faqs.ts unchanged. The user-facing strings
 * (name, blurb, description, summary, FAQ Q+A) live in MESSAGES and are
 * read through these accessors.
 *
 * Pattern:
 *   const t = useTranslations()
 *   const copy = getServiceCopy(service.slug, t)
 *   <h3>{copy.name}</h3>
 *
 * The English source values stay authoritative — these accessors simply
 * route through next-intl so each locale's catalog is consulted when the
 * locale is active, falling back to English on missing keys via the
 * loader's nestKeys merge.
 */

import { SERVICES, type ServiceSlug, type FAQ } from './services'
import { AREAS, type Area } from './areas'

type Translator = (key: string, values?: Record<string, string | number>) => string

export interface ServiceCopy {
  name: string
  shortName: string
  blurb: string
  description: string
  faqs: FAQ[]
}

const SERVICE_FAQ_COUNTS: Record<ServiceSlug, number> = {
  'junk-removal': 3,
  'construction-debris': 2,
  'appliance-removal': 1,
  'storage-cleanout': 1,
  'eviction-cleanout': 1,
  'commercial-hauling': 1,
  'residential-cleanout': 0,
}

export function getServiceCopy(slug: ServiceSlug, t: Translator): ServiceCopy {
  const faqCount = SERVICE_FAQ_COUNTS[slug] ?? 0
  const faqs: FAQ[] = []
  for (let i = 0; i < faqCount; i++) {
    faqs.push({ q: t(`service.${slug}.faq.${i}.q`), a: t(`service.${slug}.faq.${i}.a`) })
  }
  return {
    name: t(`service.${slug}.name`),
    shortName: t(`service.${slug}.shortName`),
    blurb: t(`service.${slug}.blurb`),
    description: t(`service.${slug}.description`),
    faqs,
  }
}

/** Localized service name — convenience wrapper. */
export function getServiceName(slug: ServiceSlug, t: Translator): string {
  return t(`service.${slug}.name`)
}
export function getServiceShortName(slug: ServiceSlug, t: Translator): string {
  return t(`service.${slug}.shortName`)
}

const AREA_FAQ_COUNTS: Record<string, number> = {
  'san-carlos': 2,
  // Other areas have no FAQ entries today.
}

export interface AreaCopy {
  summary: string
  faqs: FAQ[]
}

export function getAreaCopy(slug: string, t: Translator): AreaCopy {
  const faqCount = AREA_FAQ_COUNTS[slug] ?? 0
  const faqs: FAQ[] = []
  for (let i = 0; i < faqCount; i++) {
    faqs.push({ q: t(`area.${slug}.faq.${i}.q`), a: t(`area.${slug}.faq.${i}.a`) })
  }
  return {
    summary: t(`area.${slug}.summary`),
    faqs,
  }
}

/** Homepage FAQ accessor. Returns the 5-entry homepage FAQ list translated. */
export function getHomepageFaqs(t: Translator): FAQ[] {
  return [0, 1, 2, 3, 4].map((i) => ({
    q: t(`homepageFaq.${i}.q`),
    a: t(`homepageFaq.${i}.a`),
  }))
}

void SERVICES
void AREAS
type _A = Area
type _S = ServiceSlug
