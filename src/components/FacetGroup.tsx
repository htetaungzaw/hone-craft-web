import type { Locale } from '../../sanity/lib/locale'
import { cn } from '../lib/utils'
import { localized } from '../lib/localized'
import type { IndexTaxonomyTerm } from '../lib/searchIndex'

export function FacetGroup({
  title,
  terms,
  locale,
  selected,
  onToggle,
}: {
  title: string
  terms: Array<IndexTaxonomyTerm>
  locale: Locale
  selected: Set<string>
  onToggle: (key: string) => void
}) {
  return (
    <fieldset>
      <legend className="text-muted-foreground text-sm font-medium uppercase tracking-widest">
        {title}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {terms.map((term) => {
          const active = selected.has(term.key)
          return (
            <button
              key={term.key}
              type="button"
              onClick={() => onToggle(term.key)}
              aria-pressed={active}
              className={cn(
                'rounded-full border px-3 py-1 text-sm font-medium transition',
                active
                  ? 'bg-primary text-primary-foreground border-transparent'
                  : 'bg-card border-border text-foreground hover:border-primary/40',
              )}
            >
              {localized(term.title, locale)}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
