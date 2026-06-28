import { Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { Locale } from '../../sanity/lib/locale'
import type { LessonNeighbors } from '../lib/queries'
import { localized } from '../lib/localized'

export function LessonNav({
  neighbors,
  locale,
}: {
  neighbors: LessonNeighbors
  locale: Locale
}) {
  const { prev, next, pathSlug, pathTitle } = neighbors

  return (
    <div className="border-border mt-12 border-t pt-6">
      <Link
        to="/$locale/paths/$slug"
        params={{ locale, slug: pathSlug }}
        className="text-muted-foreground hover:text-foreground text-sm transition"
      >
        Part of: {localized(pathTitle, locale)}
      </Link>

      <div className="mt-4 flex flex-col items-stretch gap-3 sm:flex-row">
        {prev && (
          <Link
            to="/$locale/articles/$slug"
            params={{ locale, slug: prev.slug.current }}
            className="bg-card border-border hover:border-primary/40 flex min-w-0 flex-1 items-center gap-3 rounded-xl border p-4 shadow-sm transition hover:shadow-md"
          >
            <ArrowLeft className="text-muted-foreground size-4 shrink-0" />
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs uppercase tracking-widest">Previous</p>
              <p className="truncate font-medium">{prev.title}</p>
            </div>
          </Link>
        )}
        {next && (
          <Link
            to="/$locale/articles/$slug"
            params={{ locale, slug: next.slug.current }}
            className="bg-card border-border hover:border-primary/40 flex min-w-0 flex-1 items-center justify-end gap-3 rounded-xl border p-4 text-right shadow-sm transition hover:shadow-md"
          >
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs uppercase tracking-widest">Next</p>
              <p className="truncate font-medium">{next.title}</p>
            </div>
            <ArrowRight className="text-muted-foreground size-4 shrink-0" />
          </Link>
        )}
      </div>
    </div>
  )
}
