import { Link } from '@tanstack/react-router'
import { Languages } from 'lucide-react'
import type { Locale } from '../../sanity/lib/locale'
import { LOCALE_LABELS } from '../../sanity/lib/locale'
import type { ArticleTranslation } from '../lib/queries'
import { cn } from '../lib/utils'

interface Props {
  translations: Array<ArticleTranslation>
  currentLocale: Locale
}

export function LanguageSwitcher({ translations, currentLocale }: Props) {
  if (translations.length <= 1) return null

  return (
    <div className="border-border mt-8 flex flex-wrap items-center gap-2 rounded-xl border p-3">
      <Languages className="text-muted-foreground size-4 shrink-0" />
      <span className="text-muted-foreground text-sm">Available in</span>
      {translations.map((t) => (
        <Link
          key={t._id}
          to="/$locale/articles/$slug"
          params={{ locale: t.language, slug: t.slug.current }}
          className={cn(
            'rounded-md px-2.5 py-1 text-sm font-medium transition',
            t.language === currentLocale
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
          )}
        >
          {LOCALE_LABELS[t.language] ?? t.language}
        </Link>
      ))}
    </div>
  )
}
