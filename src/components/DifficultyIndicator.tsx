import type { Locale } from '../../sanity/lib/locale'
import type { TaxonomyTerm } from '../lib/queries'
import { localized } from '../lib/localized'
import { cn } from '../lib/utils'

const LEVEL_ORDER: Record<string, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  professional: 4,
}
const TOTAL_PIPS = 4

const LEVEL_COLORS: Record<string, string> = {
  beginner: 'bg-emerald-500',
  intermediate: 'bg-amber-500',
  advanced: 'bg-orange-500',
  professional: 'bg-rose-500',
}

interface Props {
  level: TaxonomyTerm
  locale: Locale
}

export function DifficultyIndicator({ level, locale }: Props) {
  const filled = LEVEL_ORDER[level.key] ?? 1
  const color = LEVEL_COLORS[level.key] ?? 'bg-primary'

  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex items-center gap-0.5">
        {Array.from({ length: TOTAL_PIPS }).map((_, i) => (
          <span
            key={i}
            className={cn(
              'h-1.5 w-3 rounded-full transition-colors',
              i < filled ? color : 'bg-border',
            )}
          />
        ))}
      </span>
      <span className="text-muted-foreground text-sm">{localized(level.title, locale)}</span>
    </span>
  )
}
