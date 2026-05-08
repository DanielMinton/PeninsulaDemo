import type { ServiceSlug, FAQ } from './services'

export interface Area {
  slug: string
  city: string
  county: string
  isHomeBase: boolean
  /** Real-world lat/lng (for JSON-LD geo + secondary uses). */
  geo: { lat: number; lng: number }
  /**
   * Map coordinates inside the 1000x1100 SVG viewBox.
   * Computed from `geo` + a fixed projection — see `coordsFromGeo` if recomputing.
   */
  coords: { x: number; y: number }
  summary: string
  services: ServiceSlug[]
  seoTitle: string
  seoDescription: string
  nearbyAreas: string[]
  neighborhoods?: string[]
  faqs?: FAQ[]
}

/**
 * Cities are projected onto the SVG using a simple linear projection over the bounding box
 * of the Peninsula service area. North=top, west=left.
 *   x = 100 + (lng + 122.50) * 2125
 *   y =  50 + (37.70 - lat)  * 3373
 * Coords are pre-computed below so the file is the single source of truth.
 */
export const AREAS: readonly Area[] = [
  {
    slug: 'san-carlos',
    city: 'San Carlos',
    county: 'San Mateo',
    isHomeBase: true,
    geo: { lat: 37.5074, lng: -122.2585 },
    coords: { x: 614, y: 700 },
    summary:
      'San Carlos is home base for Peninsula Pick Ups. Don and Melissa built this business here in 2021 and know every neighborhood personally. From Burton Park to White Oaks, we handle junk removal, hauling, and full-property cleanouts for homeowners and businesses throughout San Carlos.',
    services: [
      'junk-removal',
      'commercial-hauling',
      'storage-cleanout',
      'appliance-removal',
      'construction-debris',
      'residential-cleanout',
    ],
    seoTitle: 'Junk Removal in San Carlos, CA | Peninsula Pick Ups | (650) 201-1543',
    seoDescription:
      'Peninsula Pick Ups provides junk removal, hauling, and cleanout services in San Carlos, CA 94070. Family owned by Don and Melissa since 2021. Call (650) 201-1543 for a free quote.',
    nearbyAreas: ['Belmont', 'Redwood City', 'San Mateo'],
    neighborhoods: ['Burton Park', 'White Oaks', 'Howard Park', 'Cordilleras Heights', 'Devonshire'],
    faqs: [
      {
        q: 'Are you actually based in San Carlos?',
        a: 'Yes. Peninsula Pick Ups operates from San Carlos, CA 94070, and has since 2021. The business line (650) 201-1543 reaches Don and Melissa directly.',
      },
      {
        q: 'How fast can you come out in San Carlos?',
        a: 'San Carlos is our home base, so same-day service is often available. Most jobs are scheduled within 24 hours.',
      },
    ],
  },
  {
    slug: 'san-mateo',
    city: 'San Mateo',
    county: 'San Mateo',
    isHomeBase: false,
    geo: { lat: 37.5630, lng: -122.3255 },
    coords: { x: 471, y: 512 },
    summary:
      'Peninsula Pick Ups serves all of San Mateo with fast, professional junk removal and hauling. Whether you are clearing a garage in Shoreview, doing a full property cleanout near downtown, or handling post-renovation debris, our crew delivers efficient, reliable service.',
    services: ['junk-removal', 'appliance-removal', 'storage-cleanout', 'construction-debris', 'commercial-hauling'],
    seoTitle: 'Junk Removal in San Mateo, CA | Peninsula Pick Ups | (650) 201-1543',
    seoDescription:
      'Licensed junk removal and hauling services in San Mateo, CA. Peninsula Pick Ups is a family-owned business based in San Carlos. Call (650) 201-1543 today.',
    nearbyAreas: ['San Carlos', 'Belmont', 'Burlingame'],
    neighborhoods: ['Shoreview', 'Hayward Park', 'Hillsdale', 'Aragon', 'Baywood'],
  },
  {
    slug: 'redwood-city',
    city: 'Redwood City',
    county: 'San Mateo',
    isHomeBase: false,
    geo: { lat: 37.4852, lng: -122.2364 },
    coords: { x: 661, y: 775 },
    summary:
      'From Broadway to Woodside Road, Peninsula Pick Ups handles junk removal, construction debris, and full-scale cleanouts throughout Redwood City. We work with homeowners, landlords, and businesses who need fast and professional hauling service.',
    services: ['junk-removal', 'construction-debris', 'eviction-cleanout', 'appliance-removal', 'commercial-hauling'],
    seoTitle: 'Junk Removal in Redwood City, CA | Peninsula Pick Ups | (650) 201-1543',
    seoDescription:
      'Junk removal, construction debris cleanup, and eviction cleanouts in Redwood City, CA. Peninsula Pick Ups is licensed, insured, and locally owned. Call (650) 201-1543.',
    nearbyAreas: ['San Carlos', 'Menlo Park', 'Belmont'],
    neighborhoods: ['Redwood Shores', 'Emerald Hills', 'Friendly Acres', 'Woodside Plaza'],
  },
  {
    slug: 'belmont',
    city: 'Belmont',
    county: 'San Mateo',
    isHomeBase: false,
    geo: { lat: 37.5202, lng: -122.2758 },
    coords: { x: 577, y: 670 },
    summary:
      'Belmont homeowners and businesses trust Peninsula Pick Ups for dependable junk removal and property cleanouts. We service Belmont regularly from our San Carlos base. Quick scheduling, honest pricing, and a professional crew every time.',
    services: ['junk-removal', 'storage-cleanout', 'appliance-removal', 'residential-cleanout'],
    seoTitle: 'Junk Removal in Belmont, CA | Peninsula Pick Ups | (650) 201-1543',
    seoDescription:
      'Junk removal and hauling services in Belmont, CA. Peninsula Pick Ups is a San Carlos-based, family-owned business. Call (650) 201-1543 for a fast, free quote.',
    nearbyAreas: ['San Carlos', 'San Mateo', 'Redwood City'],
  },
  {
    slug: 'burlingame',
    city: 'Burlingame',
    county: 'San Mateo',
    isHomeBase: false,
    geo: { lat: 37.5841, lng: -122.3661 },
    coords: { x: 385, y: 441 },
    summary:
      'Peninsula Pick Ups brings reliable junk removal and hauling to Burlingame residents and business owners. Whether you need a single appliance removed or a full office cleared out, we schedule fast and get the job done right.',
    services: ['junk-removal', 'appliance-removal', 'commercial-hauling', 'storage-cleanout', 'residential-cleanout'],
    seoTitle: 'Junk Removal in Burlingame, CA | Peninsula Pick Ups | (650) 201-1543',
    seoDescription:
      'Professional junk removal and hauling in Burlingame, CA. Licensed and insured. Peninsula Pick Ups is locally owned and operated. Call (650) 201-1543.',
    nearbyAreas: ['San Mateo', 'Millbrae', 'South San Francisco'],
  },
  {
    slug: 'palo-alto',
    city: 'Palo Alto',
    county: 'Santa Clara',
    isHomeBase: false,
    geo: { lat: 37.4419, lng: -122.143 },
    coords: { x: 859, y: 920 },
    summary:
      'Peninsula Pick Ups serves Palo Alto with the same professional standard we bring to every job across the Peninsula. Homeowners, landlords, and businesses rely on us for efficient junk removal, cleanouts, and debris hauling without the runaround.',
    services: ['junk-removal', 'construction-debris', 'appliance-removal', 'storage-cleanout', 'commercial-hauling'],
    seoTitle: 'Junk Removal in Palo Alto, CA | Peninsula Pick Ups | (650) 201-1543',
    seoDescription:
      'Junk removal and cleanout services in Palo Alto, CA. Peninsula Pick Ups is a licensed, locally owned hauling company based in San Carlos. Call (650) 201-1543.',
    nearbyAreas: ['Menlo Park', 'Redwood City'],
  },
  {
    slug: 'menlo-park',
    city: 'Menlo Park',
    county: 'San Mateo',
    isHomeBase: false,
    geo: { lat: 37.453, lng: -122.1817 },
    coords: { x: 777, y: 883 },
    summary:
      'From Belle Haven to the Willows, Peninsula Pick Ups handles Menlo Park junk removal with professionalism and speed. We work around your schedule and leave the property clean. No hidden fees, no surprises.',
    services: ['junk-removal', 'appliance-removal', 'construction-debris', 'residential-cleanout'],
    seoTitle: 'Junk Removal in Menlo Park, CA | Peninsula Pick Ups | (650) 201-1543',
    seoDescription:
      'Junk removal and hauling in Menlo Park, CA. Peninsula Pick Ups is family-owned and based in San Carlos. Licensed, insured, and professional. Call (650) 201-1543.',
    nearbyAreas: ['Palo Alto', 'Redwood City'],
  },
  {
    slug: 'south-san-francisco',
    city: 'South San Francisco',
    county: 'San Mateo',
    isHomeBase: false,
    geo: { lat: 37.6547, lng: -122.4077 },
    coords: { x: 297, y: 203 },
    summary:
      'Peninsula Pick Ups provides junk removal, hauling, and commercial cleanouts throughout South San Francisco. Our team is local, experienced, and ready to handle projects of any size quickly and professionally.',
    services: ['junk-removal', 'commercial-hauling', 'appliance-removal', 'construction-debris', 'storage-cleanout'],
    seoTitle: 'Junk Removal in South San Francisco, CA | Peninsula Pick Ups | (650) 201-1543',
    seoDescription:
      'Junk removal, commercial hauling, and cleanouts in South San Francisco, CA. Family-owned Peninsula Pick Ups serves the entire Peninsula. Call (650) 201-1543.',
    nearbyAreas: ['Daly City', 'Burlingame', 'Millbrae'],
  },
  {
    slug: 'daly-city',
    city: 'Daly City',
    county: 'San Mateo',
    isHomeBase: false,
    geo: { lat: 37.6879, lng: -122.4702 },
    coords: { x: 164, y: 90 },
    summary:
      'Peninsula Pick Ups brings fast, affordable junk removal to Daly City homeowners and property managers. We handle residential and commercial cleanouts, appliance removal, and debris hauling throughout the area.',
    services: ['junk-removal', 'appliance-removal', 'residential-cleanout', 'eviction-cleanout'],
    seoTitle: 'Junk Removal in Daly City, CA | Peninsula Pick Ups | (650) 201-1543',
    seoDescription:
      'Junk removal and property cleanouts in Daly City, CA. Peninsula Pick Ups is locally owned and licensed. Fast quotes, professional crew. Call (650) 201-1543.',
    nearbyAreas: ['South San Francisco', 'Millbrae'],
  },
  {
    slug: 'millbrae',
    city: 'Millbrae',
    county: 'San Mateo',
    isHomeBase: false,
    geo: { lat: 37.5985, lng: -122.3872 },
    coords: { x: 340, y: 392 },
    summary:
      'Serving Millbrae with the same reliability we bring to every job on the Peninsula. Peninsula Pick Ups handles junk removal, storage cleanouts, and appliance hauls with a crew that shows up on time and leaves the job done right.',
    services: ['junk-removal', 'appliance-removal', 'storage-cleanout', 'residential-cleanout'],
    seoTitle: 'Junk Removal in Millbrae, CA | Peninsula Pick Ups | (650) 201-1543',
    seoDescription:
      'Professional junk removal and hauling in Millbrae, CA. Peninsula Pick Ups is a San Carlos-based family business. Free quotes, fast scheduling. Call (650) 201-1543.',
    nearbyAreas: ['Burlingame', 'South San Francisco'],
  },
] as const

export function getAreaBySlug(slug: string): Area | undefined {
  return AREAS.find((a) => a.slug === slug)
}

export const ALL_CITIES: readonly string[] = AREAS.map((a) => a.city)
export const HOME_BASE: Area = AREAS.find((a) => a.isHomeBase) as Area
