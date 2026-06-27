import type { Locale } from '../../sanity/lib/locale'
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
      <legend className="text-sm font-medium uppercase tracking-widest text-neutral-500">
        {title}
      </legend>
      <div className="mt-3 flex flex-col gap-2">
        {terms.map((term) => (
          <label key={term.key} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selected.has(term.key)}
              onChange={() => onToggle(term.key)}
              className="h-4 w-4 rounded border-neutral-300 dark:border-neutral-700"
            />
            {localized(term.title, locale)}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
