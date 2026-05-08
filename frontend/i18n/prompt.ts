/**
 * RAG prompt assembly for the translation pipeline.
 *
 * Inputs:
 *  - source string + content-type tag
 *  - locale code (BCP-47)
 *  - corpus: glossary, voice guide, examples, DNT list
 *
 * Output: a {system, user} pair the Claude API call uses verbatim.
 *
 * The prompt is intentionally strict: the model returns translation only,
 * no commentary, no surrounding prose. Anything else is a parse error and
 * gets retried up to 2 times.
 */

import fs from 'node:fs'
import path from 'node:path'
import type { Locale } from '../src/i18n/locales'

const ROOT = path.resolve(__dirname, '..')

export interface CorpusForLocale {
  glossary: Record<string, string>
  voice: string
  examples: { tag: string; source: string; target?: string }[]
  dnt: { literals: string[]; patterns: string[] }
}

export function loadCorpus(locale: Locale): CorpusForLocale {
  const glossaryPath = path.join(ROOT, 'i18n', 'glossary', `${locale}.json`)
  const voicePath = path.join(ROOT, 'i18n', 'voice', `${locale}.md`)
  const examplesPath = path.join(ROOT, 'i18n', 'examples', `${locale}.json`)
  const dntPath = path.join(ROOT, 'i18n', 'dnt.json')

  const glossaryRaw = JSON.parse(fs.readFileSync(glossaryPath, 'utf-8')) as { terms?: Record<string, string> }
  const voice = fs.readFileSync(voicePath, 'utf-8')
  const examplesRaw = JSON.parse(fs.readFileSync(examplesPath, 'utf-8')) as {
    examples?: { tag: string; source: string; target?: string }[]
  }
  const dnt = JSON.parse(fs.readFileSync(dntPath, 'utf-8')) as { literals: string[]; patterns: string[] }

  return {
    glossary: glossaryRaw.terms ?? {},
    voice,
    examples: examplesRaw.examples ?? [],
    dnt: { literals: dnt.literals, patterns: dnt.patterns },
  }
}

interface BuildPromptArgs {
  source: string
  tag: string
  locale: Locale
  corpus: CorpusForLocale
}

export interface ChatPrompt {
  system: string
  user: string
}

export function buildPrompt({ source, tag, locale, corpus }: BuildPromptArgs): ChatPrompt {
  const matchingExamples = corpus.examples
    .filter((e) => e.tag === tag && e.target)
    .slice(0, 5)

  const glossaryLines = Object.entries(corpus.glossary)
    .map(([k, v]) => `  - ${k}: ${v}`)
    .join('\n')

  const dntLine = corpus.dnt.literals.map((s) => JSON.stringify(s)).join(', ')

  const fewShot = matchingExamples
    .map((e) => `EN: ${e.source}\n${locale}: ${e.target}`)
    .join('\n\n')

  const system = [
    `You are translating UI copy for Peninsula Pick Ups, a family-owned junk removal business in San Carlos, California.`,
    `The brand voice is warm, plainspoken, and confident — neighborly, not corporate.`,
    `Translate the source string to ${locale}. Return ONLY the translated string. No commentary, no quotes, no prefix.`,
    ``,
    `## Voice guide for ${locale}`,
    corpus.voice.trim(),
    ``,
    `## Glossary (use these locked terms verbatim where they appear)`,
    glossaryLines || '  (no locale-specific glossary entries — preserve brand terms as in source)',
    ``,
    `## Do not translate (preserve verbatim)`,
    dntLine,
    ``,
    `## Hard rules`,
    `- Brand name "Peninsula Pick Ups" stays in English.`,
    `- Phone number "(650) 201-1543" stays formatted exactly as shown.`,
    `- Owner names "Don" and "Melissa" stay in English.`,
    `- City names (San Carlos, San Mateo, Redwood City, etc.) stay in English with "CA" suffix.`,
    `- URLs, email addresses, and tel:/sms: links are never translated.`,
    `- Preserve any ICU placeholders like {name} or {count} unchanged.`,
    `- Preserve markdown links like [text](url): translate the text, never the URL.`,
    `- If the source uses sentence-final punctuation (. ! ?), the target should too.`,
  ].join('\n')

  const userBlocks: string[] = []
  if (fewShot) {
    userBlocks.push(`Reference examples for tag "${tag}":\n\n${fewShot}\n\n---\n`)
  }
  userBlocks.push(`Tag: ${tag}\nSource (English):\n${source}\n\nTranslated (${locale}):`)

  return {
    system,
    user: userBlocks.join('\n'),
  }
}

interface BuildQaPromptArgs {
  source: string
  translation: string
  tag: string
  locale: Locale
  corpus: CorpusForLocale
}

export function buildQaPrompt({ source, translation, tag, locale, corpus }: BuildQaPromptArgs): ChatPrompt {
  const glossaryLines = Object.entries(corpus.glossary)
    .map(([k, v]) => `  - ${k}: ${v}`)
    .join('\n')

  const system = [
    `You are reviewing a UI translation for cultural fit, brand voice, and glossary compliance.`,
    `Locale: ${locale}. Content tag: ${tag}.`,
    `Brand: Peninsula Pick Ups, family-owned junk removal in San Carlos, CA.`,
    ``,
    `## Voice guide for ${locale}`,
    corpus.voice.trim(),
    ``,
    `## Glossary (translation MUST use these where applicable)`,
    glossaryLines || '  (none)',
    ``,
    `Respond as JSON ONLY, exactly this shape:`,
    `{"verdict":"ok"|"flag","issue":"..."}`,
    ``,
    `"ok" = translation is acceptable.`,
    `"flag" = translation reads as machine-translated, breaks the glossary, uses wrong register, or carries cultural off-notes. Briefly explain in "issue".`,
  ].join('\n')

  const user = [
    `Source (English):`,
    source,
    ``,
    `Translation (${locale}):`,
    translation,
    ``,
    `Verdict?`,
  ].join('\n')

  return { system, user }
}
