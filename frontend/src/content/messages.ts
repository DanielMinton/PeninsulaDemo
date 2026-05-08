/**
 * Typed message registry — single source of truth for every UI string on the
 * site. Every locale-aware function in the codebase reads from this file or
 * the catalog it generates.
 *
 * Pipeline:
 *   src/content/messages.ts (this file)
 *     -> scripts/emit-messages.ts -> messages/en.json
 *     -> scripts/translate.ts       -> messages/<locale>.json
 *     -> src/i18n/load.ts (runtime) -> next-intl messages prop
 *
 * Each entry carries:
 *   - value: the English source string (the source of truth).
 *   - tag:   content-type for the RAG translator's example retrieval.
 *
 * Adding a new key here is the only step needed to extend the typed catalog.
 * Run `npm run messages:emit` to refresh messages/en.json, then `npm run translate`
 * to fan out to all 14 target locales.
 *
 * NOTE: long-form content currently in src/content/{services,areas,faqs,reviews}.ts
 * is NOT yet migrated through this registry — those are tagged for follow-up
 * migration. See SHIPLOG_I18N.md.
 */

export type ContentTag =
  | 'nav'
  | 'hero'
  | 'cta'
  | 'trust'
  | 'service-description'
  | 'faq'
  | 'legal'
  | 'form-label'
  | 'form-error'
  | 'meta'
  | 'misc'
  | 'picker'
  | 'testimonial'

export interface Segment {
  value: string
  tag: ContentTag
}

/**
 * Flat key namespace `<area>.<key>`. Areas mirror component file names
 * where reasonable (nav, hero, footer, quote-form, locale-picker, etc.).
 */
export const MESSAGES = {
  // Locale picker (its own labels are themselves translated)
  'picker.openLabel': { value: 'Choose language', tag: 'picker' },
  'picker.title': { value: 'Choose language', tag: 'picker' },
  'picker.searchPlaceholder': { value: 'Search languages…', tag: 'picker' },
  'picker.recent': { value: 'Recent', tag: 'picker' },
  'picker.allLanguages': { value: 'All languages', tag: 'picker' },
  'picker.beta': { value: 'Beta', tag: 'picker' },
  'picker.noResults': { value: 'No matching languages.', tag: 'picker' },
  'picker.footerReviewed': { value: 'Translations are reviewed for cultural accuracy.', tag: 'picker' },
  'picker.footerReportLink': { value: 'Report a translation issue', tag: 'picker' },
  'picker.announceChange': { value: 'Language changed to {native}.', tag: 'picker' },
  'picker.closeLabel': { value: 'Close language picker', tag: 'picker' },

  // Nav
  'nav.servicesLink': { value: 'Services', tag: 'nav' },
  'nav.areasLink': { value: 'Service Areas', tag: 'nav' },
  'nav.aboutLink': { value: 'About', tag: 'nav' },
  'nav.contactLink': { value: 'Contact', tag: 'nav' },
  'nav.requestPickupCta': { value: 'Request Pickup', tag: 'cta' },
  'nav.callNowCta': { value: 'Call Now', tag: 'cta' },
  'nav.openMenu': { value: 'Open menu', tag: 'nav' },
  'nav.closeMenu': { value: 'Close menu', tag: 'nav' },
  'nav.mainAriaLabel': { value: 'Main navigation', tag: 'nav' },
  'nav.homeAriaLabel': { value: 'Peninsula Pick Ups home', tag: 'nav' },
  'nav.cityTagline': { value: 'San Carlos, CA', tag: 'misc' },
  'nav.requestPickupLong': { value: 'Request a Pickup', tag: 'cta' },

  // Hero
  'hero.badge': { value: 'San Carlos, CA. Licensed and insured since 2021.', tag: 'trust' },
  'hero.headlinePart1': { value: 'The Pickup', tag: 'hero' },
  'hero.headlinePart2': { value: 'You Can Count On.', tag: 'hero' },
  'hero.subhead': {
    value:
      'Peninsula Pick Ups handles junk removal, hauling, and full-property cleanouts across San Carlos and the entire Peninsula. Real owners. Real phone. Real results.',
    tag: 'hero',
  },
  'hero.verifiedBusinessLine': { value: 'Verified Business Line', tag: 'trust' },
  'hero.requestPickupCta': { value: 'Request a Pickup', tag: 'cta' },
  'hero.callNowCta': { value: 'Call Now', tag: 'cta' },
  'hero.scrollIndicator': { value: 'Scroll', tag: 'misc' },
  'hero.heroAriaLabel': { value: 'Peninsula Pick Ups hero', tag: 'meta' },
  'hero.servicesListAriaLabel': { value: 'Services offered', tag: 'meta' },
  'hero.serviceJunkRemoval': { value: 'Junk Removal', tag: 'service-description' },
  'hero.serviceConstructionDebris': { value: 'Construction Debris', tag: 'service-description' },
  'hero.serviceApplianceRemoval': { value: 'Appliance Removal', tag: 'service-description' },
  'hero.serviceStorageCleanouts': { value: 'Storage Cleanouts', tag: 'service-description' },
  'hero.serviceEvictionCleanouts': { value: 'Eviction Cleanouts', tag: 'service-description' },
  'hero.serviceCommercialHauling': { value: 'Commercial Hauling', tag: 'service-description' },

  // Trust section
  'trust.heading': { value: 'Why Peninsula Pick Ups', tag: 'trust' },
  'trust.licensedTitle': { value: 'Licensed and insured', tag: 'trust' },
  'trust.licensedSub': { value: 'General liability coverage. COIs available for commercial properties.', tag: 'trust' },
  'trust.familyTitle': { value: 'Family owned and operated', tag: 'trust' },
  'trust.familySub': { value: 'Don and Melissa run the business. They answer the phone themselves.', tag: 'trust' },
  'trust.localTitle': { value: 'Locally owned in San Carlos', tag: 'trust' },
  'trust.localSub': { value: 'Home base since 2021. We know every neighborhood on the Peninsula.', tag: 'trust' },
  'trust.honestPricingTitle': { value: 'Honest pricing', tag: 'trust' },
  'trust.honestPricingSub': { value: 'Firm quotes before any work starts. The price does not change on-site.', tag: 'trust' },

  // Services grid
  'services.heading': { value: 'What We Do', tag: 'service-description' },
  'services.sub': {
    value: 'From a single item to a full property — the same calm crew, the same firm pricing.',
    tag: 'service-description',
  },
  'services.learnMore': { value: 'Learn more', tag: 'cta' },

  // Service Areas section
  'areas.heading': { value: 'Where We Work', tag: 'misc' },
  'areas.sub': {
    value: 'San Carlos is home base. Same-day service across the SF Peninsula.',
    tag: 'misc',
  },
  'areas.viewArea': { value: 'View area', tag: 'cta' },

  // Testimonials
  'testimonials.heading': { value: 'What Peninsula Customers Say', tag: 'testimonial' },
  'testimonials.sub': { value: 'Reviews from our verified Yelp profile.', tag: 'testimonial' },
  'testimonials.readMore': { value: 'Read all reviews on Yelp', tag: 'cta' },

  // FAQ section
  'faq.heading': { value: 'Common Questions', tag: 'faq' },
  'faq.sub': { value: 'Quick answers — call (650) 201-1543 if yours is not here.', tag: 'faq' },

  // Verify strip
  'verify.heading': { value: 'Had a Good Experience?', tag: 'trust' },
  'verify.sub': {
    value: 'Verify our identity across every platform we operate on. Need to confirm something live? Call (650) 201-1543.',
    tag: 'trust',
  },
  'verify.confirmLive': { value: 'Need to confirm something live?', tag: 'trust' },
  'verify.businessOfRecord': { value: 'Business of Record', tag: 'trust' },
  'verify.findOnline': { value: 'Find Us Online', tag: 'trust' },

  // Quote selector
  'quoteSelector.badge': { value: 'Fast Quote Path', tag: 'cta' },
  'quoteSelector.heading': { value: 'Get a Quote in 60 Seconds', tag: 'cta' },
  'quoteSelector.sub': {
    value: 'Pick your service, tell us the load, and drop your contact info. Peninsula Pick Ups will reach out fast.',
    tag: 'cta',
  },
  'quoteSelector.stepService': { value: 'Service', tag: 'form-label' },
  'quoteSelector.stepLoad': { value: 'Load Size', tag: 'form-label' },
  'quoteSelector.stepLocation': { value: 'Location', tag: 'form-label' },
  'quoteSelector.stepUrgency': { value: 'Urgency', tag: 'form-label' },
  'quoteSelector.stepContact': { value: 'Contact', tag: 'form-label' },
  'quoteSelector.askService': { value: 'What service do you need?', tag: 'form-label' },
  'quoteSelector.askLoad': { value: 'How much needs to go?', tag: 'form-label' },
  'quoteSelector.askLocation': { value: 'Where is the pickup located?', tag: 'form-label' },
  'quoteSelector.askUrgency': { value: 'How soon do you need it done?', tag: 'form-label' },
  'quoteSelector.askContact': { value: 'Where should we send the quote?', tag: 'form-label' },
  'quoteSelector.cityLabel': { value: 'City or Address', tag: 'form-label' },
  'quoteSelector.cityDefault': { value: 'Select a city...', tag: 'form-label' },
  'quoteSelector.cityOtherOption': { value: 'Other / Not Listed', tag: 'form-label' },
  'quoteSelector.cityOtherLabel': { value: 'Enter your city or address', tag: 'form-label' },
  'quoteSelector.cityOtherPlaceholder': { value: 'e.g. Foster City, CA', tag: 'form-label' },
  'quoteSelector.loadSingle': { value: 'Single Item', tag: 'form-label' },
  'quoteSelector.loadSingleSub': { value: '1 large piece', tag: 'form-label' },
  'quoteSelector.loadQuarter': { value: 'Small Load', tag: 'form-label' },
  'quoteSelector.loadQuarterSub': { value: '1/4 truck or less', tag: 'form-label' },
  'quoteSelector.loadHalf': { value: 'Medium Load', tag: 'form-label' },
  'quoteSelector.loadHalfSub': { value: '1/2 truck', tag: 'form-label' },
  'quoteSelector.loadFull': { value: 'Full Load', tag: 'form-label' },
  'quoteSelector.loadFullSub': { value: 'Full truck or more', tag: 'form-label' },
  'quoteSelector.urgencyAsap': { value: 'ASAP', tag: 'form-label' },
  'quoteSelector.urgencyAsapSub': { value: 'Within 1-2 days', tag: 'form-label' },
  'quoteSelector.urgencyThisWeek': { value: 'This Week', tag: 'form-label' },
  'quoteSelector.urgencyThisWeekSub': { value: 'Within 7 days', tag: 'form-label' },
  'quoteSelector.urgencyFlexible': { value: 'Flexible', tag: 'form-label' },
  'quoteSelector.urgencyFlexibleSub': { value: 'When available', tag: 'form-label' },
  'quoteSelector.serviceOther': { value: 'Not Sure / Other', tag: 'form-label' },
  'quoteSelector.nameLabel': { value: 'Your Name', tag: 'form-label' },
  'quoteSelector.namePlaceholder': { value: 'Full name', tag: 'form-label' },
  'quoteSelector.phoneLabel': { value: 'Phone Number', tag: 'form-label' },
  'quoteSelector.phonePlaceholder': { value: '(650) 555-0100', tag: 'form-label' },
  'quoteSelector.emailLabel': { value: 'Email', tag: 'form-label' },
  'quoteSelector.emailOptional': { value: '(optional)', tag: 'form-label' },
  'quoteSelector.emailPlaceholder': { value: 'you@example.com', tag: 'form-label' },
  'quoteSelector.continueCta': { value: 'Continue', tag: 'cta' },
  'quoteSelector.backCta': { value: 'Back', tag: 'cta' },
  'quoteSelector.requestQuoteCta': { value: 'Request My Quote', tag: 'cta' },
  'quoteSelector.sendingCta': { value: 'Sending...', tag: 'cta' },
  'quoteSelector.preferToCall': { value: 'Prefer to call?', tag: 'cta' },
  'quoteSelector.successHeading': { value: 'Quote Request Received', tag: 'cta' },
  'quoteSelector.successSub': {
    value: 'Peninsula Pick Ups will be in touch shortly. If you need an immediate response, call us.',
    tag: 'cta',
  },
  'quoteSelector.consentText': {
    value:
      'I agree to be contacted by Peninsula Pick Ups at the phone number above regarding my quote request, including by SMS and call. Consent is not a condition of service. Message and data rates may apply. Reply STOP to opt out.',
    tag: 'legal',
  },
  'quoteSelector.privacyLink': { value: 'See our Privacy Policy.', tag: 'legal' },
  'quoteSelector.progressAria': { value: 'Quote form progress: step {step} of {total}, {label}', tag: 'meta' },
  'quoteSelector.headingAria': { value: 'Get a quote', tag: 'meta' },

  // Quote form (long form on /verify and elsewhere)
  'quoteForm.badge': { value: 'Get a Free Quote', tag: 'cta' },
  'quoteForm.heading': { value: 'Tell Us About the Job', tag: 'cta' },
  'quoteForm.subPrefix': { value: 'Fill out the form and Peninsula Pick Ups will follow up directly.', tag: 'cta' },
  'quoteForm.subFasterResponse': { value: 'For faster response, call or text us.', tag: 'cta' },
  'quoteForm.contactPhoneSub': { value: 'Verified business line. Don and Melissa.', tag: 'trust' },
  'quoteForm.contactCitySub': { value: 'Home base since 2021.', tag: 'trust' },
  'quoteForm.contactSameDayTitle': { value: 'Same-day response', tag: 'trust' },
  'quoteForm.contactSameDaySub': { value: 'Most jobs scheduled within 48 hours.', tag: 'trust' },
  'quoteForm.nameLabel': { value: 'Name', tag: 'form-label' },
  'quoteForm.namePlaceholder': { value: 'Your full name', tag: 'form-label' },
  'quoteForm.phoneLabel': { value: 'Phone', tag: 'form-label' },
  'quoteForm.phonePlaceholder': { value: '(650) 555-0100', tag: 'form-label' },
  'quoteForm.emailLabel': { value: 'Email', tag: 'form-label' },
  'quoteForm.emailOptional': { value: '(optional)', tag: 'form-label' },
  'quoteForm.emailPlaceholder': { value: 'you@example.com', tag: 'form-label' },
  'quoteForm.serviceLabel': { value: 'Service Needed', tag: 'form-label' },
  'quoteForm.serviceDefault': { value: 'Select a service...', tag: 'form-label' },
  'quoteForm.locationLabel': { value: 'Service Location', tag: 'form-label' },
  'quoteForm.locationDefault': { value: 'Select city...', tag: 'form-label' },
  'quoteForm.locationOther': { value: 'Other', tag: 'form-label' },
  'quoteForm.dateLabel': { value: 'Preferred Date', tag: 'form-label' },
  'quoteForm.messageLabel': { value: 'Message', tag: 'form-label' },
  'quoteForm.messagePlaceholder': {
    value: 'Describe what needs to be removed, any access notes, or specific questions...',
    tag: 'form-label',
  },
  'quoteForm.sendCta': { value: 'Send Quote Request', tag: 'cta' },
  'quoteForm.sendingCta': { value: 'Sending Request...', tag: 'cta' },
  'quoteForm.consentText': {
    value:
      'I agree to be contacted by Peninsula Pick Ups at the phone number and email above regarding my quote request, including by SMS and call. Consent is not a condition of service. Message and data rates may apply. Reply STOP to opt out at any time.',
    tag: 'legal',
  },
  'quoteForm.consentSeePrivacy': { value: 'See our Privacy Policy.', tag: 'legal' },
  'quoteForm.successHeading': { value: 'Request Submitted', tag: 'cta' },
  'quoteForm.successSub': { value: 'Peninsula Pick Ups will be in touch soon.', tag: 'cta' },
  'quoteForm.submitAnotherCta': { value: 'Submit Another Request', tag: 'cta' },
  'quoteForm.errorFallback': { value: 'Something went wrong. Call us at (650) 201-1543.', tag: 'form-error' },
  'quoteForm.errorUnavailable': { value: 'Unable to submit. Please call us directly at (650) 201-1543.', tag: 'form-error' },

  // Form errors (Zod errorMap source)
  'errors.nameRequired': { value: 'Tell us your name', tag: 'form-error' },
  'errors.nameTooShort': { value: 'Please enter your name.', tag: 'form-error' },
  'errors.phoneInvalid': { value: 'Enter a valid phone number', tag: 'form-error' },
  'errors.emailInvalid': { value: 'Enter a valid email', tag: 'form-error' },
  'errors.noUrls': { value: 'No URLs allowed', tag: 'form-error' },
  'errors.noBrackets': { value: 'No angle brackets allowed', tag: 'form-error' },
  'errors.maxLength': { value: 'Must be {max} characters or fewer', tag: 'form-error' },
  'errors.consentRequired': { value: 'Consent is required', tag: 'form-error' },

  // Footer
  'footer.tagline': {
    value:
      'Licensed junk removal and hauling on the San Francisco Peninsula. Family owned and operated by Don and Melissa since 2021.',
    tag: 'trust',
  },
  'footer.servicesHeading': { value: 'Services', tag: 'nav' },
  'footer.areasHeading': { value: 'Service Areas', tag: 'nav' },
  'footer.getQuoteHeading': { value: 'Get a Quote', tag: 'cta' },
  'footer.getQuoteSub': {
    value: 'Ready to clear it out? Request a free quote or call us directly. We respond fast.',
    tag: 'cta',
  },
  'footer.requestPickupCta': { value: 'Request Pickup', tag: 'cta' },
  'footer.callPrefix': { value: 'Call', tag: 'cta' },
  'footer.licensedTag': { value: 'Licensed', tag: 'trust' },
  'footer.insuredTag': { value: 'Insured', tag: 'trust' },
  'footer.localTag': { value: 'Local', tag: 'trust' },
  'footer.findUsOnline': { value: 'Find Us Online', tag: 'misc' },
  'footer.allRightsReserved': { value: 'All rights reserved.', tag: 'legal' },
  'footer.verifyLink': { value: 'Verify', tag: 'nav' },
  'footer.privacyLink': { value: 'Privacy Policy', tag: 'nav' },
  'footer.termsLink': { value: 'Terms of Service', tag: 'nav' },
  'footer.verifyBusinessLink': { value: 'Verify this business', tag: 'trust' },

  // Common UI affordances
  'common.loading': { value: 'Loading…', tag: 'misc' },
  'common.error': { value: 'Something went wrong.', tag: 'misc' },
  'common.required': { value: 'required', tag: 'form-label' },
  'common.optional': { value: 'optional', tag: 'form-label' },
} as const satisfies Record<string, Segment>

export type MessageKey = keyof typeof MESSAGES

/** Runtime guard. Useful in places that take a string from outside the closed set. */
export function isMessageKey(s: string): s is MessageKey {
  return s in MESSAGES
}

export const MESSAGES_VERSION = 1
