export type ServiceSlug =
  | 'junk-removal'
  | 'construction-debris'
  | 'appliance-removal'
  | 'storage-cleanout'
  | 'eviction-cleanout'
  | 'commercial-hauling'
  | 'residential-cleanout'

export interface FAQ {
  q: string
  a: string
}

export interface Service {
  slug: ServiceSlug
  name: string
  shortName: string
  /** One-line lead-in for grid cards. */
  blurb: string
  /** Long-form copy for /services/[slug]. */
  description: string
  /** Used in <select> options as the human-readable value sent to the lead API. */
  formValue: string
  faqs: FAQ[]
}

export const SERVICES: readonly Service[] = [
  {
    slug: 'junk-removal',
    name: 'Junk Removal',
    shortName: 'Junk Removal',
    formValue: 'junk_removal',
    blurb:
      'Full-property junk removal for homes, garages, yards, and estates. We load it, haul it, and leave the space clean.',
    description:
      'Peninsula Pick Ups handles general junk removal across the SF Peninsula — from a single piece of furniture to a full garage clear-out. Our crew arrives with a real truck and a real plan: we do all the loading, sweep up after, and dispose responsibly. No hidden fees, no surprises, and no estimates that change once we are on-site.',
    faqs: [
      {
        q: 'What kind of junk do you take?',
        a: 'Furniture, mattresses, appliances, e-waste, yard waste, construction debris, household clutter — almost anything non-hazardous. If you are not sure, send a photo when you call (650) 201-1543 and we will tell you on the spot.',
      },
      {
        q: 'How is pricing set?',
        a: 'Pricing is based on volume in the truck plus any special handling. We give a firm quote before any work starts and the price does not change on-site.',
      },
      {
        q: 'How quickly can you come out?',
        a: 'Most jobs are scheduled within 48 hours. Same-day pickups are often available — call (650) 201-1543 to check.',
      },
    ],
  },
  {
    slug: 'construction-debris',
    name: 'Construction Debris Removal',
    shortName: 'Construction Debris',
    formValue: 'construction_debris',
    blurb:
      'Post-renovation cleanup, demolition debris, drywall, wood, concrete, and contractor scraps hauled away fast.',
    description:
      'Peninsula Pick Ups clears post-renovation and demolition debris across the Peninsula — drywall, framing scraps, broken concrete, tile, flooring, cabinetry, and contractor refuse. We work with general contractors, remodelers, and homeowners. Tell us the scope, we will quote it, and we will be on-site when you need the site cleared.',
    faqs: [
      {
        q: 'Do you work with contractors directly?',
        a: 'Yes. Many of our regular jobs are post-build cleanups for GCs and remodelers. We can schedule on a rolling basis or on-call.',
      },
      {
        q: 'Can you handle concrete and tile?',
        a: 'Yes — heavy debris is part of what we do. We will give you a volume-based quote that accounts for weight.',
      },
    ],
  },
  {
    slug: 'appliance-removal',
    name: 'Appliance Removal',
    shortName: 'Appliance Removal',
    formValue: 'appliance_removal',
    blurb:
      'Refrigerators, washers, dryers, stoves, and more. We disconnect, remove, and haul away old appliances safely.',
    description:
      'Old refrigerator on the porch? Washer-dryer pair you cannot lift? Peninsula Pick Ups removes appliances of every size with the right equipment to protect your floors, walls, and door frames. We also handle proper disposal and recycling so refrigerants and metals get processed correctly.',
    faqs: [
      {
        q: 'Do you disconnect appliances?',
        a: 'Standard disconnections (water, gas-shutoff, plug) are part of the job. For anything that needs a licensed plumber or electrician we will tell you upfront.',
      },
    ],
  },
  {
    slug: 'storage-cleanout',
    name: 'Storage Cleanouts',
    shortName: 'Storage Cleanout',
    formValue: 'storage_cleanout',
    blurb:
      'Cleared-out storage units, garages, and storage rooms. We handle sorting, hauling, and full property cleanup.',
    description:
      'Storage units, attics, garages, basements — Peninsula Pick Ups clears them out so you do not have to. We can sort, set aside donate-able items at your direction, and handle the heavy lifting and disposal. Common for downsizing, relocations, and estate work.',
    faqs: [
      {
        q: 'Can you set aside items for donation?',
        a: 'Yes — tell us what to keep, donate, or trash, and we will sort accordingly while we work.',
      },
    ],
  },
  {
    slug: 'eviction-cleanout',
    name: 'Eviction Cleanouts',
    shortName: 'Eviction Cleanout',
    formValue: 'eviction_cleanout',
    blurb:
      'Full property clearance for landlords and property managers following tenant evictions. Efficient, professional, discreet.',
    description:
      'Peninsula Pick Ups works with Peninsula landlords and property managers on post-eviction cleanouts. We arrive fast, work efficiently, document the work, and leave the unit ready for cleaning, paint, and re-listing. Discreet, professional, and documented.',
    faqs: [
      {
        q: 'Do you provide before/after documentation?',
        a: 'Yes — we photograph the unit on arrival and again at completion, and email you the documentation the same day.',
      },
    ],
  },
  {
    slug: 'commercial-hauling',
    name: 'Commercial Hauling',
    shortName: 'Commercial Hauling',
    formValue: 'commercial_hauling',
    blurb:
      'Office furniture, retail fixtures, warehouse pallets, and commercial-scale debris. We handle jobs big and small.',
    description:
      'Office cleanouts, retail fixture removal, warehouse pallet hauling, restaurant equipment — Peninsula Pick Ups handles commercial-scale jobs across the Peninsula. We work after-hours when needed and coordinate with property managers on access, COIs, and elevator reservations.',
    faqs: [
      {
        q: 'Do you carry insurance for commercial properties?',
        a: 'Yes — we carry general liability and can provide a Certificate of Insurance naming the property when required.',
      },
    ],
  },
  {
    slug: 'residential-cleanout',
    name: 'Residential Cleanouts',
    shortName: 'Residential Cleanout',
    formValue: 'residential_cleanout',
    blurb:
      'Whole-home and estate clearances handled with care. We work with families, executors, and Peninsula real-estate agents.',
    description:
      'Peninsula Pick Ups runs full residential cleanouts — estate clearances, downsizing, pre-sale prep, post-tenant turnovers. We sort, haul, and clean, and we work at the pace the family or owner needs. Estate work in particular is handled with discretion and care.',
    faqs: [],
  },
] as const

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug)
}

export function serviceName(slug: ServiceSlug): string {
  return SERVICES.find((s) => s.slug === slug)?.name ?? slug
}

export function serviceShortName(slug: ServiceSlug): string {
  return SERVICES.find((s) => s.slug === slug)?.shortName ?? slug
}
