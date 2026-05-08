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

  // FaqSection chrome
  'faqSection.badge': { value: 'FAQ', tag: 'faq' },
  'faqSection.defaultHeading': { value: 'Frequently Asked Questions', tag: 'faq' },
  'faqSection.moreQuestions': { value: 'More questions?', tag: 'faq' },
  'faqSection.callPrefix': { value: 'Call', tag: 'cta' },

  // TrustSection chrome + 6 trust signals
  'trustSection.badge': { value: 'Why Peninsula Pick Ups', tag: 'trust' },
  'trustSection.headlinePart1': { value: 'Why Customers Trust', tag: 'trust' },
  'trustSection.headlinePart2': { value: 'the Real Peninsula Pick Ups', tag: 'trust' },
  'trustSection.subhead': {
    value:
      'Don and Melissa built Peninsula Pick Ups on one principle: show up, do the job right, and be reachable. No mystery numbers. No vague addresses. A real San Carlos business you can verify.',
    tag: 'trust',
  },
  'trustSection.requestQuoteCta': { value: 'Request a Free Quote', tag: 'cta' },
  'trustSection.callCta': { value: 'Call', tag: 'cta' },
  'trustSection.ownersTitle': { value: 'Owners: Don and Melissa', tag: 'trust' },
  'trustSection.ownersBody': {
    value:
      'Family-operated out of San Carlos, CA 94070. When you request a quote or call the business line, you reach us directly. That is the point.',
    tag: 'trust',
  },
  'trustSection.establishedNote': { value: 'Established 2021 on the Peninsula.', tag: 'trust' },
  'trustSection.signal1Title': { value: 'One verified phone number', tag: 'trust' },
  'trustSection.signal1Body': {
    value: 'When you call (650) 201-1543, you reach Don and Melissa directly. No call center, no redirects, no runaround.',
    tag: 'trust',
  },
  'trustSection.signal2Title': { value: 'Based in San Carlos since 2021', tag: 'trust' },
  'trustSection.signal2Body': {
    value:
      'Peninsula Pick Ups was built on the Peninsula and has been serving the community since 2021. We know the neighborhoods, the roads, and what customers here expect.',
    tag: 'trust',
  },
  'trustSection.signal3Title': { value: 'Real project photos on the way', tag: 'trust' },
  'trustSection.signal3Body': {
    value:
      'We back our work with before-and-after documentation on every job. Verified project media is being added continuously.',
    tag: 'trust',
  },
  'trustSection.signal4Title': { value: 'Transparent pricing, no surprises', tag: 'trust' },
  'trustSection.signal4Body': {
    value:
      'Free quotes with no hidden fees. You know the number before we show up, and the price does not change on-site.',
    tag: 'trust',
  },
  'trustSection.signal5Title': { value: 'Fast scheduling, human response', tag: 'trust' },
  'trustSection.signal5Body': {
    value: 'We respond same day. Most jobs are schedulable within 48 hours. You deal with the owner, not a dispatcher.',
    tag: 'trust',
  },
  'trustSection.signal6Title': { value: 'Licensed and insured', tag: 'trust' },
  'trustSection.signal6Body': {
    value: 'Peninsula Pick Ups carries proper licensing and insurance for every job. Your property is covered, full stop.',
    tag: 'trust',
  },

  // ServicesGrid chrome
  'servicesGrid.badge': { value: 'What We Do', tag: 'service-description' },
  'servicesGrid.headlinePart1': { value: 'Full-Service Hauling', tag: 'service-description' },
  'servicesGrid.headlinePart2': { value: 'From One Item to the Whole Property', tag: 'service-description' },
  'servicesGrid.subhead': {
    value:
      'Peninsula Pick Ups handles residential and commercial jobs across the Peninsula. Whatever needs to go, we load it up and clear it out.',
    tag: 'service-description',
  },
  'servicesGrid.learnMore': { value: 'Learn more', tag: 'cta' },
  'servicesGrid.getQuote': { value: 'Get a quote', tag: 'cta' },

  // ServiceAreas chrome
  'serviceAreas.badge': { value: 'Where We Work', tag: 'misc' },
  'serviceAreas.heading': { value: 'Serving the Entire Peninsula', tag: 'misc' },
  'serviceAreas.subhead': {
    value:
      'Based in San Carlos, Peninsula Pick Ups covers communities from South San Francisco down to Palo Alto. Click your city for local service details.',
    tag: 'misc',
  },
  'serviceAreas.requestPickup': { value: 'Request Pickup', tag: 'cta' },
  'serviceAreas.homeBaseTag': { value: 'Home Base', tag: 'misc' },
  'serviceAreas.countySuffix': { value: 'County', tag: 'misc' },
  'serviceAreas.moreSuffix': { value: '+ {count} more', tag: 'misc' },
  'serviceAreas.dontSeeCity': { value: "Don't see your city?", tag: 'misc' },
  'serviceAreas.requestQuoteLink': { value: 'Request a quote', tag: 'cta' },
  'serviceAreas.weConfirm': { value: "and we'll confirm service availability.", tag: 'misc' },

  // TestimonialsSection chrome
  'testimonialsSection.badge': { value: 'Customer Reviews', tag: 'testimonial' },
  'testimonialsSection.heading': { value: 'What Customers Say', tag: 'testimonial' },
  'testimonialsSection.subhead': {
    value:
      'Real reviews from customers across the Peninsula. Peninsula Pick Ups has {count} reviews and counting on Yelp, plus recommendations on Nextdoor and Alignable.',
    tag: 'testimonial',
  },
  'testimonialsSection.yelpReviewsCount': { value: '{count} reviews', tag: 'testimonial' },
  'testimonialsSection.recommendedNextdoor': { value: 'Recommended on Nextdoor', tag: 'testimonial' },
  'testimonialsSection.verifiedCustomer': { value: 'Verified {source} customer', tag: 'testimonial' },
  'testimonialsSection.viewOnSource': { value: 'View on {source}', tag: 'meta' },
  'testimonialsSection.starRatingLabel': { value: '{count} out of 5 stars', tag: 'meta' },
  'testimonialsSection.experienceHeading': { value: 'Had a Good Experience?', tag: 'testimonial' },
  'testimonialsSection.experienceBody': {
    value:
      "If Peninsula Pick Ups hauled for you, we'd love to hear about it. Reviews from confirmed customers help neighbors find a reliable local service.",
    tag: 'testimonial',
  },
  'testimonialsSection.leaveYelpReview': { value: 'Leave a Yelp Review', tag: 'cta' },
  'testimonialsSection.callCta': { value: 'Call', tag: 'cta' },

  // VerifyStrip
  'verifyStrip.ariaLabel': { value: 'Business verification', tag: 'meta' },
  'verifyStrip.homeBaseSublabel': { value: 'Home Base', tag: 'trust' },
  'verifyStrip.establishedSublabel': { value: 'Operating since 2021', tag: 'trust' },
  'verifyStrip.establishedLabel': { value: 'Established 2021', tag: 'trust' },
  'verifyStrip.verifiedBusinessSublabel': { value: 'Verified Business Line', tag: 'trust' },
  'verifyStrip.ownersLabel': { value: 'Don and Melissa', tag: 'trust' },
  'verifyStrip.ownersSublabel': { value: 'Local Owners', tag: 'trust' },
  'verifyStrip.licensedLabel': { value: 'Licensed and Insured', tag: 'trust' },
  'verifyStrip.licensedSublabel': { value: 'Professional Service', tag: 'trust' },

  // GallerySection chrome
  'gallerySection.badge': { value: 'Real Work, Real Results', tag: 'misc' },
  'gallerySection.heading': { value: 'Project Gallery', tag: 'misc' },
  'gallerySection.subhead': {
    value:
      'Photos from real Peninsula Pick Ups jobs — garage cleanouts, debris removal, appliance hauls, and full-property clearances across the Peninsula.',
    tag: 'misc',
  },
  'gallerySection.yelpPhotosCount': { value: '58 photos', tag: 'misc' },
  'gallerySection.instagramPostsCount': { value: '143+ posts', tag: 'misc' },
  'gallerySection.ctaTitle': { value: '143+ more job photos on Instagram', tag: 'cta' },
  'gallerySection.ctaBodyPre': { value: 'Follow', tag: 'cta' },
  'gallerySection.ctaBodyPost': {
    value:
      'for before-and-after photos from every job — garage cleanouts, construction debris, appliance removals, and more across the Peninsula.',
    tag: 'cta',
  },
  'gallerySection.viewAllCta': { value: 'View All Photos', tag: 'cta' },
  'gallerySection.photo1Label': { value: 'Haul Complete', tag: 'misc' },
  'gallerySection.photo2Label': { value: 'Residential Cleanout', tag: 'misc' },
  'gallerySection.photo3Label': { value: 'Full Load Haul', tag: 'misc' },
  'gallerySection.photo4Label': { value: 'Debris Removal', tag: 'misc' },
  'gallerySection.photo5Label': { value: 'Property Cleanout', tag: 'misc' },
  'gallerySection.photo6Label': { value: 'Job Site', tag: 'misc' },
  'gallerySection.locationSanMateoCounty': { value: 'San Mateo County', tag: 'misc' },
  'gallerySection.locationPeninsula': { value: 'Peninsula, CA', tag: 'misc' },
  'gallerySection.locationBayArea': { value: 'Bay Area, CA', tag: 'misc' },

  // ShareCity
  'shareCity.shareLabel': { value: 'Share {city} page', tag: 'cta' },
  'shareCity.copied': { value: 'Link copied', tag: 'misc' },
  'shareCity.shareText': { value: 'Peninsula Pick Ups serves {city}, CA — (650) 201-1543.', tag: 'cta' },

  // Area page chrome
  'areaPage.breadcrumbServiceAreas': { value: 'Service Areas', tag: 'nav' },
  'areaPage.countyBadge': { value: '{county} County', tag: 'misc' },
  'areaPage.homeBaseBadge': { value: 'Home Base', tag: 'trust' },
  'areaPage.headlinePart1': { value: 'Junk Removal in', tag: 'hero' },
  'areaPage.requestPickupIn': { value: 'Request Pickup in {city}', tag: 'cta' },
  'areaPage.callPrefix': { value: 'Call', tag: 'cta' },
  'areaPage.textUs': { value: 'Text Us', tag: 'cta' },
  'areaPage.textMessage': { value: 'Hi Peninsula Pick Ups — I need a pickup in {city}, CA.', tag: 'cta' },
  'areaPage.servicesHeading': { value: 'Services Available in {city}', tag: 'service-description' },
  'areaPage.servicesSubhead': {
    value: 'Peninsula Pick Ups provides the following services throughout {city}, CA.',
    tag: 'service-description',
  },
  'areaPage.nearbyHeading': { value: 'Also Serving Nearby Areas', tag: 'misc' },
  'areaPage.faqHeading': { value: '{city} FAQ', tag: 'faq' },
  'areaPage.faqSubhead': { value: 'Common questions about junk removal and hauling in {city}, CA.', tag: 'faq' },
  'areaPage.backToHome': { value: 'Back to Peninsula Pick Ups', tag: 'nav' },
  'areaPage.statHomeBase': { value: 'Home Base', tag: 'trust' },
  'areaPage.statServingPeninsula': { value: 'Serving the Peninsula', tag: 'trust' },
  'areaPage.statVerifiedLine': { value: 'Verified Line', tag: 'trust' },
  'areaPage.statLocalOwners': { value: 'Local Owners', tag: 'trust' },
  'areaPage.statProfessionalService': { value: 'Professional Service', tag: 'trust' },
  'areaPage.statLicensedAndInsured': { value: 'Licensed and Insured', tag: 'trust' },
  'areaPage.statEstablishedPrefix': { value: 'Established', tag: 'trust' },

  // Service page chrome
  'servicePage.breadcrumbServices': { value: 'Services', tag: 'nav' },
  'servicePage.serviceBadge': { value: 'Service', tag: 'service-description' },
  'servicePage.requestQuote': { value: 'Request a Quote', tag: 'cta' },
  'servicePage.callPrefix': { value: 'Call', tag: 'cta' },
  'servicePage.citiesWeServeHeading': { value: 'Cities We Serve', tag: 'misc' },
  'servicePage.citiesWeServeSubhead': {
    value: '{service} is available across every Peninsula Pick Ups service area.',
    tag: 'service-description',
  },
  'servicePage.faqHeading': { value: '{service} FAQ', tag: 'faq' },
  'servicePage.faqSubhead': { value: 'Common questions about {service} with Peninsula Pick Ups.', tag: 'faq' },
  'servicePage.otherServicesHeading': { value: 'Other Services', tag: 'service-description' },

  // Verify page chrome (long-form imposter note paragraph carved out — keeps English under legal review)
  'verifyPage.breadcrumb': { value: 'Verify', tag: 'nav' },
  'verifyPage.badge': { value: 'Verified Identity', tag: 'trust' },
  'verifyPage.headlinePart1': { value: 'This is the', tag: 'hero' },
  'verifyPage.headlinePart2': { value: 'legitimate Peninsula Pick Ups.', tag: 'hero' },
  'verifyPage.subhead': {
    value: 'Public-record verification for the family-owned junk removal and hauling business based in San Carlos, CA since 2021.',
    tag: 'trust',
  },
  'verifyPage.businessOfRecord': { value: 'Business of Record', tag: 'trust' },
  'verifyPage.factLegalName': { value: 'Legal name', tag: 'trust' },
  'verifyPage.factDomain': { value: 'Domain', tag: 'trust' },
  'verifyPage.factVerifiedPhone': { value: 'Verified phone', tag: 'trust' },
  'verifyPage.factAddress': { value: 'Address', tag: 'trust' },
  'verifyPage.factOwners': { value: 'Owners', tag: 'trust' },
  'verifyPage.factFounded': { value: 'Founded', tag: 'trust' },
  'verifyPage.factLicensed': { value: 'Licensed and insured', tag: 'trust' },
  'verifyPage.factLicensedYes': { value: 'Yes', tag: 'trust' },
  'verifyPage.imposterHeading': { value: 'A note on imposter sites', tag: 'trust' },
  'verifyPage.profilesHeading': { value: 'Profiles & Reviews of Record', tag: 'trust' },
  'verifyPage.profilesSubhead': {
    value:
      'Every link below is a published profile we operate. These are the canonical destinations cited by our schema and by every page on this site.',
    tag: 'trust',
  },
  'verifyPage.confirmHeading': { value: 'Need to confirm something live?', tag: 'trust' },
  'verifyPage.confirmBody': {
    value: 'Don or Melissa answers the verified business line directly during business hours, Monday through Saturday.',
    tag: 'trust',
  },
  'verifyPage.callCta': { value: 'Call', tag: 'cta' },
  'verifyPage.textCta': { value: 'Text Us', tag: 'cta' },

  // ── Service business copy (per slug) ─────────────────────────────────────
  // Keys mirror src/content/services.ts shape. Read via getServiceCopy(slug, t).

  'service.junk-removal.name': { value: 'Junk Removal', tag: 'service-description' },
  'service.junk-removal.shortName': { value: 'Junk Removal', tag: 'service-description' },
  'service.junk-removal.blurb': {
    value: 'Full-property junk removal for homes, garages, yards, and estates. We load it, haul it, and leave the space clean.',
    tag: 'service-description',
  },
  'service.junk-removal.description': {
    value:
      'Peninsula Pick Ups handles general junk removal across the SF Peninsula — from a single piece of furniture to a full garage clear-out. Our crew arrives with a real truck and a real plan: we do all the loading, sweep up after, and dispose responsibly. No hidden fees, no surprises, and no estimates that change once we are on-site.',
    tag: 'service-description',
  },
  'service.junk-removal.faq.0.q': { value: 'What kind of junk do you take?', tag: 'faq' },
  'service.junk-removal.faq.0.a': {
    value:
      'Furniture, mattresses, appliances, e-waste, yard waste, construction debris, household clutter — almost anything non-hazardous. If you are not sure, send a photo when you call (650) 201-1543 and we will tell you on the spot.',
    tag: 'faq',
  },
  'service.junk-removal.faq.1.q': { value: 'How is pricing set?', tag: 'faq' },
  'service.junk-removal.faq.1.a': {
    value: 'Pricing is based on volume in the truck plus any special handling. We give a firm quote before any work starts and the price does not change on-site.',
    tag: 'faq',
  },
  'service.junk-removal.faq.2.q': { value: 'How quickly can you come out?', tag: 'faq' },
  'service.junk-removal.faq.2.a': {
    value: 'Most jobs are scheduled within 48 hours. Same-day pickups are often available — call (650) 201-1543 to check.',
    tag: 'faq',
  },

  'service.construction-debris.name': { value: 'Construction Debris Removal', tag: 'service-description' },
  'service.construction-debris.shortName': { value: 'Construction Debris', tag: 'service-description' },
  'service.construction-debris.blurb': {
    value: 'Post-renovation cleanup, demolition debris, drywall, wood, concrete, and contractor scraps hauled away fast.',
    tag: 'service-description',
  },
  'service.construction-debris.description': {
    value:
      'Peninsula Pick Ups clears post-renovation and demolition debris across the Peninsula — drywall, framing scraps, broken concrete, tile, flooring, cabinetry, and contractor refuse. We work with general contractors, remodelers, and homeowners. Tell us the scope, we will quote it, and we will be on-site when you need the site cleared.',
    tag: 'service-description',
  },
  'service.construction-debris.faq.0.q': { value: 'Do you work with contractors directly?', tag: 'faq' },
  'service.construction-debris.faq.0.a': {
    value: 'Yes. Many of our regular jobs are post-build cleanups for GCs and remodelers. We can schedule on a rolling basis or on-call.',
    tag: 'faq',
  },
  'service.construction-debris.faq.1.q': { value: 'Can you handle concrete and tile?', tag: 'faq' },
  'service.construction-debris.faq.1.a': {
    value: 'Yes — heavy debris is part of what we do. We will give you a volume-based quote that accounts for weight.',
    tag: 'faq',
  },

  'service.appliance-removal.name': { value: 'Appliance Removal', tag: 'service-description' },
  'service.appliance-removal.shortName': { value: 'Appliance Removal', tag: 'service-description' },
  'service.appliance-removal.blurb': {
    value: 'Refrigerators, washers, dryers, stoves, and more. We disconnect, remove, and haul away old appliances safely.',
    tag: 'service-description',
  },
  'service.appliance-removal.description': {
    value:
      'Old refrigerator on the porch? Washer-dryer pair you cannot lift? Peninsula Pick Ups removes appliances of every size with the right equipment to protect your floors, walls, and door frames. We also handle proper disposal and recycling so refrigerants and metals get processed correctly.',
    tag: 'service-description',
  },
  'service.appliance-removal.faq.0.q': { value: 'Do you disconnect appliances?', tag: 'faq' },
  'service.appliance-removal.faq.0.a': {
    value: 'Standard disconnections (water, gas-shutoff, plug) are part of the job. For anything that needs a licensed plumber or electrician we will tell you upfront.',
    tag: 'faq',
  },

  'service.storage-cleanout.name': { value: 'Storage Cleanouts', tag: 'service-description' },
  'service.storage-cleanout.shortName': { value: 'Storage Cleanout', tag: 'service-description' },
  'service.storage-cleanout.blurb': {
    value: 'Cleared-out storage units, garages, and storage rooms. We handle sorting, hauling, and full property cleanup.',
    tag: 'service-description',
  },
  'service.storage-cleanout.description': {
    value:
      'Storage units, attics, garages, basements — Peninsula Pick Ups clears them out so you do not have to. We can sort, set aside donate-able items at your direction, and handle the heavy lifting and disposal. Common for downsizing, relocations, and estate work.',
    tag: 'service-description',
  },
  'service.storage-cleanout.faq.0.q': { value: 'Can you set aside items for donation?', tag: 'faq' },
  'service.storage-cleanout.faq.0.a': {
    value: 'Yes — tell us what to keep, donate, or trash, and we will sort accordingly while we work.',
    tag: 'faq',
  },

  'service.eviction-cleanout.name': { value: 'Eviction Cleanouts', tag: 'service-description' },
  'service.eviction-cleanout.shortName': { value: 'Eviction Cleanout', tag: 'service-description' },
  'service.eviction-cleanout.blurb': {
    value: 'Full property clearance for landlords and property managers following tenant evictions. Efficient, professional, discreet.',
    tag: 'service-description',
  },
  'service.eviction-cleanout.description': {
    value:
      'Peninsula Pick Ups works with Peninsula landlords and property managers on post-eviction cleanouts. We arrive fast, work efficiently, document the work, and leave the unit ready for cleaning, paint, and re-listing. Discreet, professional, and documented.',
    tag: 'service-description',
  },
  'service.eviction-cleanout.faq.0.q': { value: 'Do you provide before/after documentation?', tag: 'faq' },
  'service.eviction-cleanout.faq.0.a': {
    value: 'Yes — we photograph the unit on arrival and again at completion, and email you the documentation the same day.',
    tag: 'faq',
  },

  'service.commercial-hauling.name': { value: 'Commercial Hauling', tag: 'service-description' },
  'service.commercial-hauling.shortName': { value: 'Commercial Hauling', tag: 'service-description' },
  'service.commercial-hauling.blurb': {
    value: 'Office furniture, retail fixtures, warehouse pallets, and commercial-scale debris. We handle jobs big and small.',
    tag: 'service-description',
  },
  'service.commercial-hauling.description': {
    value:
      'Office cleanouts, retail fixture removal, warehouse pallet hauling, restaurant equipment — Peninsula Pick Ups handles commercial-scale jobs across the Peninsula. We work after-hours when needed and coordinate with property managers on access, COIs, and elevator reservations.',
    tag: 'service-description',
  },
  'service.commercial-hauling.faq.0.q': { value: 'Do you carry insurance for commercial properties?', tag: 'faq' },
  'service.commercial-hauling.faq.0.a': {
    value: 'Yes — we carry general liability and can provide a Certificate of Insurance naming the property when required.',
    tag: 'faq',
  },

  'service.residential-cleanout.name': { value: 'Residential Cleanouts', tag: 'service-description' },
  'service.residential-cleanout.shortName': { value: 'Residential Cleanout', tag: 'service-description' },
  'service.residential-cleanout.blurb': {
    value: 'Whole-home and estate clearances handled with care. We work with families, executors, and Peninsula real-estate agents.',
    tag: 'service-description',
  },
  'service.residential-cleanout.description': {
    value:
      'Peninsula Pick Ups runs full residential cleanouts — estate clearances, downsizing, pre-sale prep, post-tenant turnovers. We sort, haul, and clean, and we work at the pace the family or owner needs. Estate work in particular is handled with discretion and care.',
    tag: 'service-description',
  },

  // ── Area summaries (per slug) — surface text the user reads on /areas/[city] ──
  // City names, county names, geo, and neighborhoods stay English (DNT list).

  'area.san-carlos.summary': {
    value:
      'San Carlos is home base for Peninsula Pick Ups. Don and Melissa built this business here in 2021 and know every neighborhood personally. From Burton Park to White Oaks, we handle junk removal, hauling, and full-property cleanouts for homeowners and businesses throughout San Carlos.',
    tag: 'service-description',
  },
  'area.san-carlos.faq.0.q': { value: 'Are you actually based in San Carlos?', tag: 'faq' },
  'area.san-carlos.faq.0.a': {
    value: 'Yes. Peninsula Pick Ups operates from San Carlos, CA 94070, and has since 2021. The business line (650) 201-1543 reaches Don and Melissa directly.',
    tag: 'faq',
  },
  'area.san-carlos.faq.1.q': { value: 'How fast can you come out in San Carlos?', tag: 'faq' },
  'area.san-carlos.faq.1.a': {
    value: 'San Carlos is our home base, so same-day service is often available. Most jobs are scheduled within 24 hours.',
    tag: 'faq',
  },
  'area.san-mateo.summary': {
    value:
      'Peninsula Pick Ups serves all of San Mateo with fast, professional junk removal and hauling. Whether you are clearing a garage in Shoreview, doing a full property cleanout near downtown, or handling post-renovation debris, our crew delivers efficient, reliable service.',
    tag: 'service-description',
  },
  'area.redwood-city.summary': {
    value:
      'From Broadway to Woodside Road, Peninsula Pick Ups handles junk removal, construction debris, and full-scale cleanouts throughout Redwood City. We work with homeowners, landlords, and businesses who need fast and professional hauling service.',
    tag: 'service-description',
  },
  'area.belmont.summary': {
    value:
      'Belmont homeowners and businesses trust Peninsula Pick Ups for dependable junk removal and property cleanouts. We service Belmont regularly from our San Carlos base. Quick scheduling, honest pricing, and a professional crew every time.',
    tag: 'service-description',
  },
  'area.burlingame.summary': {
    value:
      'Peninsula Pick Ups brings reliable junk removal and hauling to Burlingame residents and business owners. Whether you need a single appliance removed or a full office cleared out, we schedule fast and get the job done right.',
    tag: 'service-description',
  },
  'area.palo-alto.summary': {
    value:
      'Peninsula Pick Ups serves Palo Alto with the same professional standard we bring to every job across the Peninsula. Homeowners, landlords, and businesses rely on us for efficient junk removal, cleanouts, and debris hauling without the runaround.',
    tag: 'service-description',
  },
  'area.menlo-park.summary': {
    value:
      'From Belle Haven to the Willows, Peninsula Pick Ups handles Menlo Park junk removal with professionalism and speed. We work around your schedule and leave the property clean. No hidden fees, no surprises.',
    tag: 'service-description',
  },
  'area.south-san-francisco.summary': {
    value:
      'Peninsula Pick Ups provides junk removal, hauling, and commercial cleanouts throughout South San Francisco. Our team is local, experienced, and ready to handle projects of any size quickly and professionally.',
    tag: 'service-description',
  },
  'area.daly-city.summary': {
    value:
      'Peninsula Pick Ups brings fast, affordable junk removal to Daly City homeowners and property managers. We handle residential and commercial cleanouts, appliance removal, and debris hauling throughout the area.',
    tag: 'service-description',
  },
  'area.millbrae.summary': {
    value:
      'Serving Millbrae with the same reliability we bring to every job on the Peninsula. Peninsula Pick Ups handles junk removal, storage cleanouts, and appliance hauls with a crew that shows up on time and leaves the job done right.',
    tag: 'service-description',
  },

  // ── Homepage FAQs ────────────────────────────────────────────────────────

  'homepageFaq.0.q': { value: 'Where is Peninsula Pick Ups based?', tag: 'faq' },
  'homepageFaq.0.a': {
    value: 'Peninsula Pick Ups operates from San Carlos, CA 94070. Owners Don and Melissa have run the business from the Peninsula since 2021. The verified business line is (650) 201-1543.',
    tag: 'faq',
  },
  'homepageFaq.1.q': { value: 'What areas do you serve?', tag: 'faq' },
  'homepageFaq.1.a': {
    value: 'We serve the SF Peninsula from Daly City and South San Francisco down through San Mateo, Belmont, San Carlos, Redwood City, Menlo Park, and Palo Alto. If your city is not listed, call (650) 201-1543 — we usually can.',
    tag: 'faq',
  },
  'homepageFaq.2.q': { value: 'How fast can you come out?', tag: 'faq' },
  'homepageFaq.2.a': {
    value: 'Most jobs are scheduled within 24 to 48 hours. Same-day service is often available, especially in San Carlos and adjacent cities.',
    tag: 'faq',
  },
  'homepageFaq.3.q': { value: 'How is pricing set?', tag: 'faq' },
  'homepageFaq.3.a': {
    value: 'Pricing is based on volume in the truck plus any special handling. We give a firm quote before any work starts and the price does not change on-site.',
    tag: 'faq',
  },
  'homepageFaq.4.q': { value: 'How do I know I have the right Peninsula Pick Ups?', tag: 'faq' },
  'homepageFaq.4.a': {
    value: 'Our domain is thepeninsulapickup.com. The verified business line is (650) 201-1543. Don and Melissa answer that line directly. See /verify for our complete identity record across Yelp, Instagram, Facebook, Nextdoor, Alignable, and JunkSpots.',
    tag: 'faq',
  },

  // Page meta titles + descriptions
  'meta.home.title': {
    value: 'Peninsula Pick Ups | Junk Removal & Hauling | San Carlos, CA',
    tag: 'meta',
  },
  'meta.home.description': {
    value:
      'Peninsula Pick Ups provides junk removal, hauling, cleanouts, and construction debris removal across the SF Peninsula. Locally owned by Don and Melissa in San Carlos since 2021. Call (650) 201-1543.',
    tag: 'meta',
  },
  'meta.home.ogAlt': {
    value: 'Peninsula Pick Ups — Junk Removal & Hauling, San Carlos, CA',
    tag: 'meta',
  },

  // Map section
  'map.badge': { value: 'The Peninsula', tag: 'misc' },
  'map.heading': { value: 'Where Peninsula Pick Ups Works', tag: 'misc' },
  'map.sub': {
    value:
      'Pick a city to see local service details. We are based in San Carlos and run the entire SF Peninsula from there.',
    tag: 'misc',
  },
  'map.tooltipPreview': { value: '{city} preview', tag: 'meta' },
  'map.homeBaseTag': { value: 'Home Base', tag: 'misc' },
  'map.servicesAvailable': { value: '{count} services available', tag: 'misc' },
  'map.requestPickupHere': { value: 'Request pickup here', tag: 'cta' },
} as const satisfies Record<string, Segment>

export type MessageKey = keyof typeof MESSAGES

/** Runtime guard. Useful in places that take a string from outside the closed set. */
export function isMessageKey(s: string): s is MessageKey {
  return s in MESSAGES
}

export const MESSAGES_VERSION = 1
