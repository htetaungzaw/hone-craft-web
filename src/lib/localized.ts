import type { Locale } from '../../sanity/lib/locale'

export function localized(
  field: Record<Locale, string | undefined> | undefined,
  locale: Locale,
): string {
  if (!field) return ''
  return field[locale] || field.en || ''
}
