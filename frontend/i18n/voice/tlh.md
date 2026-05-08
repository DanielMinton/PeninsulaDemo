---
locale: tlh
status: experimental
reviewer: null
reviewed: null
notes: Klingon has no native speakers. This is a brand-personality / easter-egg locale, not a serious customer-service register. Latin transliteration following the Klingon Language Institute (KLI) standard is the rendering form. The pIqaD native script is not used because it lives in Unicode Private Use and is not reliably renderable.
---

# Klingon (tlh) — voice guide

Klingon (tlhIngan Hol) is a constructed language created by Marc Okrand for Star Trek. **It has no native speakers** and a small fluent-learner community. This locale ships as a brand-personality choice — a wink at customers who appreciate the joke — not as serious customer-service copy. Treat it accordingly.

## Rendering form

- **Latin transliteration only**, following the Klingon Language Institute (KLI) standard. The pIqaD script (Unicode Private Use Area, U+F8D0–U+F8FF) is intentionally NOT used — it requires a custom font most readers don't have, and it would render as boxes for nearly everyone.
- KLI Latin orthography is **case-sensitive at the phonemic level**:
  - Capitals D, S, Q, H denote distinct sounds from lowercase d, s, q, h.
  - The apostrophe `'` is the glottal stop — a real consonant. Never drop it.
  - Examples: **tlhIngan** (Klingon), **Hol** (language), **Qapla'** (success), **DaH** (now).

## Grammar shape

Klingon is **OVS (Object-Verb-Subject)**, agglutinative, with a small but rigorous grammar:

- Verb suffixes encode tense, mood, and aspect rather than separate words.
- Pronouns are usually built into verb prefixes: **vIneH** = I want it; **DaneH** = you want it.
- The pronoun marker for "we" addressing a third-person object: **wI-** (e.g., **wIngeH** — we send it).
- Klingon vocabulary intentionally lacks many modern-business concepts. When no direct translation exists, use:
  1. The closest paraphrase (e.g., "junk" → **veQ** [garbage] or **patlh ngeb** [false rank items]).
  2. A descriptive compound where idiomatic Klingon doesn't exist.
  3. Latin-script English brand terms left untranslated.

## Tone

In-canon, Klingons value **directness, honor, and competence**. Marketing softeners ("please", "we'd love to") don't translate well. Klingon copy should read as **direct service offers**: "We remove junk. Call us." rather than "We'd love to help with your junk removal needs."

The Klingon voice is also famously **boastful** when warranted — claiming reliability, strength, and discipline is culturally appropriate. "Our truck is mighty" is fine. Hyperbole is fine.

## Address form

- Refer to the customer using **the implied "you"** baked into verb prefixes (Da-, bo-, etc.).
- Refer to ourselves as **maH** (we) or via verb prefix.
- Imperatives are direct verb forms with the appropriate prefix: **HItlhob!** = "Ask me!" (literally "you-ask-me imperative"). For service CTAs, second-person imperative: **maHvaD HIyaj!** = "Address yourself to us!"

## Vocabulary (best-effort approximations)

These are reasonable Klingon renderings; native fluent learners may suggest better forms.

- **"Junk removal"** → **veQ teqwI'** (one who removes garbage) or **veQ teq** (garbage-remove, gerund form).
- **"Hauling"** → **lupwI'** (transporter) or **lupwI'pu' jaj** (transport day) for service.
- **"Cleanout"** → **Say'moHmeH** (in order to clean — purposive form).
- **"Pickup"** as a service action → **wIqemmoH** (we cause to bring) or keep "Peninsula Pick Ups" in Latin.
- **"Free quote"** → **vIH HuchHom Hal** (free price-information source) — best-effort. Or just `huch poQbe' jang` ("answer that requires no money").
- **"Family-owned"** → **qorDu' ghom Daq** (the family ensemble's place — paraphrase).
- **"Licensed and insured"** → **chaw' wIghaj 'ej Hubchu' wImaSchugh** (we have permission AND we choose comprehensive protection — paraphrase).

## What to avoid

- **Soft-marketing language**. "We'd be happy to help" doesn't fit. Direct: "We remove junk. Call."
- **Anglicized Klingon**. Don't write "junk removal-Daq" — write either real Klingon or untranslated English.
- **The native pIqaD script**. Use Latin transliteration only.

## Trust phrases (locked translations — best-effort)

- "Licensed and insured" → **chaw' wIghaj 'ej Hub wIghajqu'** (we have permit and we have strong protection)
- "Family owned" → **qorDu' Daj 'oH** (this is the family's)
- "Locally owned" → **Daq vam Daj 'oH** (this place's own — local)
- "Verified business line" → **lutu'lu' tu'lu'pu'bogh ghogh** (the voice that has been verified)
- "Free quote" → **Huch poQbe'bogh jang** (answer that demands no money)

## Phone numbers and brand names

- Phone number `(650) 201-1543` renders LTR exactly as `(650) 201-1543`. Klingon does not reformat numbers.
- "Peninsula Pick Ups" stays in Latin lettering. The Klingon copy will mix tlhIngan Hol verbs with the Latin brand name; that's expected for an English-brand-in-Klingon-context.
- Owner names "Don" and "Melissa" stay in Latin lettering. Don could optionally be Klingonized as a transliteration but isn't conventional.
- City names stay in English ("San Carlos, CA").

## Acceptance criterion

This locale's quality bar is **culturally distinctive Klingon**, not perfect Klingon. The goal is "this is unmistakably Klingon and reads as the brand having made a real attempt" — not "this would pass an audit by Marc Okrand." If a phrase doesn't have a clean Klingon rendering, use a paraphrase that preserves spirit, mark it experimental in this guide, and flag the segment in the review queue.

## Permanent flag

`experimental: true` is permanent for this locale. There is no native-speaker pool that could un-flag it. The "Beta" tag in the slide-out picker is the right UX signal.
