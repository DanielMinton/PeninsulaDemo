import { test, expect, type Page } from '@playwright/test'

const SERVICES = [
  'junk-removal',
  'construction-debris',
  'appliance-removal',
  'storage-cleanout',
  'eviction-cleanout',
  'commercial-hauling',
  'residential-cleanout',
]
const AREAS = [
  'san-carlos',
  'san-mateo',
  'redwood-city',
  'belmont',
  'burlingame',
  'palo-alto',
  'menlo-park',
  'south-san-francisco',
  'daly-city',
  'millbrae',
]

const PAGES = [
  '/',
  '/verify',
  '/terms',
  '/privacy',
  '/dashboard',
  ...SERVICES.map((s) => `/services/${s}`),
  ...AREAS.map((a) => `/areas/${a}`),
]

interface LinkAudit {
  href: string
  text: string
  target: string
  visible: boolean
}

async function gatherLinks(page: Page): Promise<LinkAudit[]> {
  return page.$$eval('a', (els) =>
    els.map((a) => ({
      href: a.getAttribute('href') ?? '',
      text: (a.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 60),
      target: a.getAttribute('target') ?? '',
      visible: !!(a.offsetParent || a.getClientRects().length),
    })),
  )
}

async function gatherButtons(page: Page) {
  return page.$$eval('button', (els) =>
    els.map((b) => ({
      type: b.getAttribute('type') ?? 'button',
      text: (b.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 60),
      disabled: b.disabled,
      ariaLabel: b.getAttribute('aria-label') ?? '',
    })),
  )
}

const PHONE_E164 = '+16502011543'

const VALID_TEL = (h: string) => h === `tel:${PHONE_E164}`
const VALID_SMS = (h: string) => h.startsWith(`sms:${PHONE_E164}`)
const VALID_MAILTO = (h: string) => /^mailto:[^@\s]+@[^@\s]+\.[^@\s]+/.test(h)

for (const path of PAGES) {
  test(`audit ${path}`, async ({ page }) => {
    const consoleErrors: string[] = []
    const pageErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    page.on('pageerror', (err) => pageErrors.push(err.message))

    const response = await page.goto(path, { waitUntil: 'domcontentloaded' })
    expect.soft(response, `${path}: no response`).toBeTruthy()
    expect.soft(response?.status(), `${path}: status ${response?.status()}`).toBeLessThan(400)

    await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {})

    const links = await gatherLinks(page)
    const buttons = await gatherButtons(page)

    const issues: string[] = []

    for (const link of links) {
      const href = link.href
      const label = link.text || `aria/${link.target}` || '(no text)'

      if (!href) {
        issues.push(`[empty href] "${label}"`)
        continue
      }
      if (href === '#') {
        issues.push(`[hash-only #] "${label}"`)
        continue
      }
      if (href.startsWith('#')) {
        const id = href.slice(1)
        if (!id) {
          issues.push(`[empty anchor] "${label}"`)
          continue
        }
        const count = await page.locator(`[id="${id}"]`).count()
        if (count === 0) {
          issues.push(`[missing anchor target #${id}] "${label}"`)
        }
        continue
      }
      if (href.startsWith('tel:')) {
        if (!VALID_TEL(href)) issues.push(`[bad tel ${href}] "${label}"`)
        continue
      }
      if (href.startsWith('sms:')) {
        if (!VALID_SMS(href)) issues.push(`[bad sms ${href}] "${label}"`)
        continue
      }
      if (href.startsWith('mailto:')) {
        if (!VALID_MAILTO(href)) issues.push(`[bad mailto ${href}] "${label}"`)
        continue
      }
      if (href.startsWith('http://') || href.startsWith('https://')) {
        // external — covered by separate HEAD-check script
        continue
      }
      if (href.startsWith('/')) {
        // internal — covered by visiting each PAGES entry directly
        continue
      }
      issues.push(`[unknown href scheme ${href}] "${label}"`)
    }

    // Attach diagnostics for the report.
    test.info().annotations.push({ type: 'link-count', description: String(links.length) })
    test.info().annotations.push({ type: 'button-count', description: String(buttons.length) })
    if (issues.length) {
      test.info().annotations.push({ type: 'link-issues', description: issues.join(' | ') })
    }
    if (consoleErrors.length) {
      test.info().annotations.push({
        type: 'console-errors',
        description: consoleErrors.slice(0, 5).join(' | '),
      })
    }
    if (pageErrors.length) {
      test.info().annotations.push({
        type: 'page-errors',
        description: pageErrors.slice(0, 5).join(' | '),
      })
    }

    expect.soft(issues, `link issues on ${path}`).toEqual([])
    expect.soft(pageErrors, `page errors on ${path}`).toEqual([])
  })
}

test('nav CTA scrolls to a quote target on home', async ({ page }) => {
  await page.goto('/')
  const nav = page.locator('header').getByRole('link', { name: /request|quote/i }).first()
  await nav.click()
  await page.waitForTimeout(800)
  const url = page.url()
  // We expect the URL to contain a hash. Capture whatever it is — bug reporting cares about the target.
  const hash = new URL(url).hash
  test.info().annotations.push({ type: 'nav-cta-final-hash', description: hash || '(none)' })
  if (hash) {
    const target = await page.locator(`[id="${hash.slice(1)}"]`).count()
    expect(target, `expected #${hash.slice(1)} on home`).toBeGreaterThan(0)
  }
})

test('quote form on /areas/san-carlos submits successfully', async ({ page }) => {
  await page.goto('/areas/san-carlos')
  await page.locator('#quote').scrollIntoViewIfNeeded()

  // Form inputs use id="qf-*" (no name attribute — submission is React state, not FormData).
  await page.fill('#qf-name', 'Test Lead - Claude Audit')
  await page.fill('#qf-phone', '(650) 555-2671')
  await page.selectOption('#qf-location', 'San Carlos')
  await page.check('#qf-consent')

  const [response] = await Promise.all([
    page.waitForResponse((r) => r.url().includes('/api/lead'), { timeout: 15_000 }),
    page.locator('button[type="submit"]').click(),
  ])

  const status = response.status()
  const body = await response.text().catch(() => '')
  test.info().annotations.push({ type: 'lead-api-status', description: String(status) })
  test.info().annotations.push({ type: 'lead-api-body', description: body.slice(0, 400) })
  expect(status, `expected /api/lead 200, body=${body}`).toBe(200)
})
