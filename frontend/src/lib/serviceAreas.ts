export interface ServiceAreaData {
  city: string
  slug: string
  county: string
  summary: string
  services: string[]
  seoTitle: string
  seoDescription: string
  nearbyAreas?: string[]
}

export const SERVICE_AREAS: ServiceAreaData[] = [
  {
    city: 'San Carlos',
    slug: 'san-carlos',
    county: 'San Mateo',
    summary:
      'San Carlos is home base for Peninsula Pick Ups. Don and Melissa built this business here in 2021 and know every neighborhood personally. From Burton Park to White Oaks, we handle junk removal, hauling, and full-property cleanouts for homeowners and businesses throughout San Carlos.',
    services: [
      'Junk Removal',
      'Hauling',
      'Storage Cleanouts',
      'Appliance Removal',
      'Construction Debris Removal',
      'Residential Cleanouts',
      'Commercial Hauling',
    ],
    seoTitle: 'Junk Removal in San Carlos, CA | Peninsula Pick Ups | (650) 201-1543',
    seoDescription:
      'Peninsula Pick Ups provides junk removal, hauling, and cleanout services in San Carlos, CA 94070. Family owned by Don and Melissa since 2021. Call (650) 201-1543 for a free quote.',
    nearbyAreas: ['Belmont', 'Redwood City', 'San Mateo'],
  },
  {
    city: 'San Mateo',
    slug: 'san-mateo',
    county: 'San Mateo',
    summary:
      'Peninsula Pick Ups serves all of San Mateo with fast, professional junk removal and hauling. Whether you are clearing a garage in Shoreview, doing a full property cleanout near downtown, or handling post-renovation debris, our crew delivers efficient, reliable service.',
    services: [
      'Junk Removal',
      'Hauling',
      'Appliance Removal',
      'Storage Cleanouts',
      'Construction Debris Removal',
      'Commercial Hauling',
    ],
    seoTitle: 'Junk Removal in San Mateo, CA | Peninsula Pick Ups | (650) 201-1543',
    seoDescription:
      'Licensed junk removal and hauling services in San Mateo, CA. Peninsula Pick Ups is a family-owned business based in San Carlos. Call (650) 201-1543 today.',
    nearbyAreas: ['San Carlos', 'Belmont', 'Burlingame'],
  },
  {
    city: 'Redwood City',
    slug: 'redwood-city',
    county: 'San Mateo',
    summary:
      'From Broadway to Woodside Road, Peninsula Pick Ups handles junk removal, construction debris, and full-scale cleanouts throughout Redwood City. We work with homeowners, landlords, and businesses who need fast and professional hauling service.',
    services: [
      'Junk Removal',
      'Construction Debris Removal',
      'Eviction Cleanouts',
      'Hauling',
      'Appliance Removal',
      'Commercial Hauling',
    ],
    seoTitle: 'Junk Removal in Redwood City, CA | Peninsula Pick Ups | (650) 201-1543',
    seoDescription:
      'Junk removal, construction debris cleanup, and eviction cleanouts in Redwood City, CA. Peninsula Pick Ups is licensed, insured, and locally owned. Call (650) 201-1543.',
    nearbyAreas: ['San Carlos', 'Menlo Park', 'Belmont'],
  },
  {
    city: 'Belmont',
    slug: 'belmont',
    county: 'San Mateo',
    summary:
      'Belmont homeowners and businesses trust Peninsula Pick Ups for dependable junk removal and property cleanouts. We service Belmont regularly from our San Carlos base. Quick scheduling, honest pricing, and a professional crew every time.',
    services: [
      'Junk Removal',
      'Hauling',
      'Storage Cleanouts',
      'Appliance Removal',
      'Residential Cleanouts',
    ],
    seoTitle: 'Junk Removal in Belmont, CA | Peninsula Pick Ups | (650) 201-1543',
    seoDescription:
      'Junk removal and hauling services in Belmont, CA. Peninsula Pick Ups is a San Carlos-based, family-owned business. Call (650) 201-1543 for a fast, free quote.',
    nearbyAreas: ['San Carlos', 'San Mateo', 'Redwood City'],
  },
  {
    city: 'Burlingame',
    slug: 'burlingame',
    county: 'San Mateo',
    summary:
      'Peninsula Pick Ups brings reliable junk removal and hauling to Burlingame residents and business owners. Whether you need a single appliance removed or a full office cleared out, we schedule fast and get the job done right.',
    services: [
      'Junk Removal',
      'Appliance Removal',
      'Commercial Hauling',
      'Storage Cleanouts',
      'Residential Cleanouts',
    ],
    seoTitle: 'Junk Removal in Burlingame, CA | Peninsula Pick Ups | (650) 201-1543',
    seoDescription:
      'Professional junk removal and hauling in Burlingame, CA. Licensed and insured. Peninsula Pick Ups is locally owned and operated. Call (650) 201-1543.',
    nearbyAreas: ['San Mateo', 'Millbrae', 'South San Francisco'],
  },
  {
    city: 'Palo Alto',
    slug: 'palo-alto',
    county: 'Santa Clara',
    summary:
      'Peninsula Pick Ups serves Palo Alto with the same professional standard we bring to every job across the Peninsula. Homeowners, landlords, and businesses rely on us for efficient junk removal, cleanouts, and debris hauling without the runaround.',
    services: [
      'Junk Removal',
      'Construction Debris Removal',
      'Appliance Removal',
      'Storage Cleanouts',
      'Commercial Hauling',
    ],
    seoTitle: 'Junk Removal in Palo Alto, CA | Peninsula Pick Ups | (650) 201-1543',
    seoDescription:
      'Junk removal and cleanout services in Palo Alto, CA. Peninsula Pick Ups is a licensed, locally owned hauling company based in San Carlos. Call (650) 201-1543.',
    nearbyAreas: ['Menlo Park', 'Redwood City', 'East Palo Alto'],
  },
  {
    city: 'Menlo Park',
    slug: 'menlo-park',
    county: 'San Mateo',
    summary:
      'From Belle Haven to the Willows, Peninsula Pick Ups handles Menlo Park junk removal with professionalism and speed. We work around your schedule and leave the property clean. No hidden fees, no surprises.',
    services: [
      'Junk Removal',
      'Hauling',
      'Appliance Removal',
      'Construction Debris Removal',
      'Residential Cleanouts',
    ],
    seoTitle: 'Junk Removal in Menlo Park, CA | Peninsula Pick Ups | (650) 201-1543',
    seoDescription:
      'Junk removal and hauling in Menlo Park, CA. Peninsula Pick Ups is family-owned and based in San Carlos. Licensed, insured, and professional. Call (650) 201-1543.',
    nearbyAreas: ['Palo Alto', 'Redwood City', 'East Palo Alto'],
  },
  {
    city: 'South San Francisco',
    slug: 'south-san-francisco',
    county: 'San Mateo',
    summary:
      'Peninsula Pick Ups provides junk removal, hauling, and commercial cleanouts throughout South San Francisco. Our team is local, experienced, and ready to handle projects of any size quickly and professionally.',
    services: [
      'Junk Removal',
      'Commercial Hauling',
      'Appliance Removal',
      'Construction Debris Removal',
      'Storage Cleanouts',
    ],
    seoTitle: 'Junk Removal in South San Francisco, CA | Peninsula Pick Ups | (650) 201-1543',
    seoDescription:
      'Junk removal, commercial hauling, and cleanouts in South San Francisco, CA. Family-owned Peninsula Pick Ups serves the entire Peninsula. Call (650) 201-1543.',
    nearbyAreas: ['Daly City', 'Burlingame', 'Millbrae'],
  },
  {
    city: 'Daly City',
    slug: 'daly-city',
    county: 'San Mateo',
    summary:
      'Peninsula Pick Ups brings fast, affordable junk removal to Daly City homeowners and property managers. We handle residential and commercial cleanouts, appliance removal, and debris hauling throughout the area.',
    services: [
      'Junk Removal',
      'Hauling',
      'Appliance Removal',
      'Residential Cleanouts',
      'Eviction Cleanouts',
    ],
    seoTitle: 'Junk Removal in Daly City, CA | Peninsula Pick Ups | (650) 201-1543',
    seoDescription:
      'Junk removal and property cleanouts in Daly City, CA. Peninsula Pick Ups is locally owned and licensed. Fast quotes, professional crew. Call (650) 201-1543.',
    nearbyAreas: ['South San Francisco', 'Millbrae', 'San Mateo'],
  },
  {
    city: 'Millbrae',
    slug: 'millbrae',
    county: 'San Mateo',
    summary:
      'Serving Millbrae with the same reliability we bring to every job on the Peninsula. Peninsula Pick Ups handles junk removal, storage cleanouts, and appliance hauls with a crew that shows up on time and leaves the job done right.',
    services: [
      'Junk Removal',
      'Appliance Removal',
      'Storage Cleanouts',
      'Residential Cleanouts',
      'Hauling',
    ],
    seoTitle: 'Junk Removal in Millbrae, CA | Peninsula Pick Ups | (650) 201-1543',
    seoDescription:
      'Professional junk removal and hauling in Millbrae, CA. Peninsula Pick Ups is a San Carlos-based family business. Free quotes, fast scheduling. Call (650) 201-1543.',
    nearbyAreas: ['Burlingame', 'South San Francisco', 'San Mateo'],
  },
]

export function getServiceAreaBySlug(slug: string): ServiceAreaData | undefined {
  return SERVICE_AREAS.find((area) => area.slug === slug)
}

export const ALL_CITIES = SERVICE_AREAS.map((a) => a.city)
