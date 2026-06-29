import { createFileRoute, Link } from '@tanstack/react-router'
import { Map } from 'lucide-react'
import type { Locale } from '../../../../sanity/lib/locale'
import { getLearningPaths } from '../../../lib/queries'
import { localized } from '../../../lib/localized'
import { BackLink } from '../../../components/BackLink'

export const Route = createFileRoute('/$locale/paths/')({
  loader: () => getLearningPaths(),
  component: PathsIndexPage,
})

function PathsIndexPage() {
  const { locale } = Route.useParams()
  const paths = Route.useLoaderData()
  const loc = locale as Locale

  return (
    <main className="relative mx-auto max-w-2xl overflow-hidden px-6 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(ellipse_at_top,_var(--secondary)_0%,_transparent_70%)] opacity-50 dark:opacity-20"
      />
      <BackLink locale={locale} />
      <div className="bg-secondary text-secondary-foreground mt-6 flex h-10 w-10 items-center justify-center rounded-lg">
        <Map className="h-5 w-5" />
      </div>
      <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        Learning paths
      </h1>
      <p className="text-muted-foreground mt-3 text-lg">
        Curated, ordered tracks through the guide — start to finish.
      </p>

      {paths.length === 0 ? (
        <p className="text-muted-foreground mt-8">No learning paths yet.</p>
      ) : (
        <div className="mt-8 grid gap-4">
          {paths.map((path) => (
            <Link
              key={path._id}
              to="/$locale/paths/$slug"
              params={{ locale, slug: path.slug.current }}
              className="bg-card border-border hover:border-primary/40 rounded-xl border p-5 text-left shadow-sm transition hover:shadow-md"
            >
              <h2 className="font-medium">{localized(path.title, loc)}</h2>
              {path.description && (
                <p className="text-muted-foreground mt-1 text-sm">
                  {localized(path.description, loc)}
                </p>
              )}
              <p className="text-primary mt-2 text-xs font-semibold uppercase tracking-widest">
                {path.articleCount} lesson{path.articleCount === 1 ? '' : 's'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
