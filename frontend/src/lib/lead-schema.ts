import { z } from 'zod'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { SERVICES } from '@/content/services'
import { AREAS } from '@/content/areas'

const SERVICE_VALUES = [...SERVICES.map((s) => s.formValue), 'other'] as const
const CITY_VALUES = [...AREAS.map((a) => a.city), 'Other'] as const
const URGENCY_VALUES = ['asap', 'this_week', 'flexible'] as const
const LOAD_VALUES = ['', 'single_item', 'quarter_truck', 'half_truck', 'full_truck'] as const

const NO_HTML_OR_URL = (max: number) =>
  z
    .string()
    .max(max, `Must be ${max} characters or fewer`)
    .refine((v) => !/[<>]/.test(v), 'No angle brackets allowed')
    .refine((v) => !/https?:\/\//i.test(v), 'No URLs allowed')

const optionalEmail = z
  .string()
  .max(254)
  .email('Enter a valid email')
  .or(z.literal(''))
  .optional()

const phoneE164 = z.string().transform((v, ctx) => {
  const parsed = parsePhoneNumberFromString(v, 'US')
  if (!parsed || !parsed.isValid()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Enter a valid phone number' })
    return z.NEVER
  }
  return parsed.format('E.164')
})

/**
 * Server-side schema for /api/lead. Names match the Django CRM payload contract.
 * Honeypot field "company" must be empty — bots love filling it in.
 */
export const LeadSchema = z.object({
  name: NO_HTML_OR_URL(120).min(2, 'Tell us your name'),
  phone: phoneE164,
  email: optionalEmail,
  service_requested: z.enum(SERVICE_VALUES).or(z.literal('')).optional(),
  service_location: z.enum(CITY_VALUES),
  load_size: z.enum(LOAD_VALUES).optional(),
  urgency: z.enum(URGENCY_VALUES).optional(),
  preferred_date: z.string().max(40).optional(),
  message: NO_HTML_OR_URL(2000).optional().or(z.literal('')),
  consent: z.literal(true, { message: 'Consent is required' }),
  source_page: z.string().max(500).optional(),
  /** Honeypot. Must be absent or empty. */
  company: z.string().max(0).optional().or(z.literal('')),
  /** Cloudflare Turnstile token; required when TURNSTILE_SECRET_KEY is set. */
  turnstileToken: z.string().optional(),
})

export type LeadInput = z.input<typeof LeadSchema>
export type Lead = z.output<typeof LeadSchema>
