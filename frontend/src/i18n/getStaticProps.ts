/**
 * Page-level helper for `getStaticProps`: returns the locale + flat messages
 * dict that the next-intl provider in _app.tsx consumes.
 *
 * Usage:
 *   export const getStaticProps: GetStaticProps = async (ctx) => ({
 *     props: { ...localeProps(ctx) },
 *   })
 *
 * For dynamic pages with their own props:
 *   export const getStaticProps: GetStaticProps = async (ctx) => ({
 *     props: { ...localeProps(ctx), area: getAreaBySlug(ctx.params!.city) },
 *   })
 */

import type { GetStaticPropsContext } from 'next'
import { DEFAULT_LOCALE, isLocale, type Locale } from './locales'
import { loadMessages } from './load'

type NestedMessages = { [key: string]: string | NestedMessages }

export interface LocaleProps {
  locale: Locale
  messages: NestedMessages
}

export function localeProps(ctx: GetStaticPropsContext): LocaleProps {
  const locale: Locale = isLocale(ctx.locale) ? ctx.locale : DEFAULT_LOCALE
  return { locale, messages: loadMessages(locale) }
}
