---
locale: he
status: needs-human-review
reviewer: null
reviewed: null
notes: Initial draft for Modern Israeli Hebrew. RTL. Needs native review.
---

# Hebrew (he) — voice guide

Modern Israeli Hebrew (עברית מודרנית) — the everyday register used in Israeli media, business, and consumer marketing. **Right-to-left direction** is mandatory; phone numbers and English brand names render LTR via inline override.

## Tone

Warm, direct, confident. Israeli marketing voice is generally less formal than European marketing — direct address with informal verb forms is normal in consumer contexts. Avoid biblical/literary register, which reads as religious or archaic in commercial copy.

## Address form

- For consumer-direct marketing copy, use **את/אתה** (informal "you" — feminine/masculine). This is the Israeli norm; switching to **כבודך** (your honor) reads as bureaucratic-formal.
- Use **אנחנו** (we) or implied verb subject for the business voice.
- Imperatives are direct: **התקשרו** (call — masc plural), **בקשו** (request — masc plural). Plural forms cover both genders in standard marketing copy.

## Vocabulary

- **"Junk removal"** → **פינוי גרוטאות** (pinui grutaot — clearing out junk/scrap). The standard service-business term. Avoid **איסוף אשפה** (collection of trash) which implies municipal pickup.
- **"Hauling"** → **הובלה** (hovala — transport, moving).
- **"Cleanout"** → **פינוי** (pinui — evacuation, clearing) for whole-property; **ניקוי** for general cleaning.
- **"Pickup"** as a service action → **איסוף** (asufa — collection). Brand "Peninsula Pick Ups" stays in Latin lettering.
- **"Free quote"** → **הצעת מחיר חינם** (offer of price for free). Standard.
- **"Same-day service"** → **שירות באותו יום** (service on the same day).
- **"Family-owned"** → **עסק משפחתי** (family business). Warm.
- **"Licensed and insured"** → **בעלי רישיון ומבוטחים** (with license and insured).

## RTL rendering — non-negotiable

Hebrew is right-to-left. Specifically:

- The page-level `<html dir="rtl">` is set per locale at build time.
- Phone numbers `(650) 201-1543` must be wrapped in `<span dir="ltr">` so the parentheses and digits read 6-5-0 not reversed.
- Brand names "Peninsula Pick Ups" stay in Latin script and read LTR within the RTL flow — this is normal Hebrew typography.
- Punctuation: full stops, commas, and quotation marks follow Hebrew convention. Use Hebrew quotes ״...״ if quoting Hebrew text directly; English quotes "..." stay in their LTR-isolated context.

## What to avoid

- **Biblical or rabbinic register** — "אנא" (please, archaic) and "הואיל" (since, formal) read as religious or legal. Use modern equivalents.
- **Over-Anglicization**: "צ'ק את האתר שלנו" reads as Hebrish. Native Hebrew alternatives exist for most marketing concepts.
- **Diacritics (ניקוד)** in body copy. Modern Hebrew marketing copy is unpointed except for ambiguous words. Don't add ניקוד unless it's necessary for disambiguation.

## Trust phrases (locked translations)

- "Licensed and insured" → בעלי רישיון ומבוטחים
- "Family owned" → עסק משפחתי
- "Locally owned" → עסק מקומי
- "Verified business line" → קו עסקי מאומת
- "Free quote" → הצעת מחיר חינם

## Phone numbers and brand names

- Phone number `(650) 201-1543` renders **LTR** exactly as `(650) 201-1543` inside `<span dir="ltr">`. Critical: digits must read 6-5-0, not reversed.
- "Peninsula Pick Ups" stays in Latin lettering — never transliterated to Hebrew letters.
- Owner names "Don" and "Melissa" stay in Latin lettering for the business identity.
- City names stay in English ("San Carlos, CA"). Bay Area Hebrew speakers know these places by their English names.
