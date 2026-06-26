export const SUPPORTED_LOCALES = ['en', 'ja', 'my'] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ja: '日本語',
  my: 'မြန်မာ',
}

export function localeStringField(title: string, description?: string) {
  return {
    type: 'object',
    title,
    description,
    fields: SUPPORTED_LOCALES.map((locale) => ({
      name: locale,
      title: LOCALE_LABELS[locale],
      type: 'string',
    })),
  } as const
}

export function localeTextField(title: string, description?: string) {
  return {
    type: 'object',
    title,
    description,
    fields: SUPPORTED_LOCALES.map((locale) => ({
      name: locale,
      title: LOCALE_LABELS[locale],
      type: 'text',
      rows: 3,
    })),
  } as const
}
