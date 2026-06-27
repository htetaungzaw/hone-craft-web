import type { Locale } from '../../sanity/lib/locale'

export function localized(
  field: Partial<Record<Locale, string>> | undefined,
  locale: Locale,
): string {
  if (!field) return ''
  return field[locale] || field.en || ''
}
