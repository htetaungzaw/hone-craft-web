import { createFileRoute, Link } from '@tanstack/react-router'
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
    <main className="mx-auto max-w-2xl px-6 py-16">
      <BackLink locale={locale} />
      <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
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
              <p className="text-muted-foreground/70 mt-2 text-xs uppercase tracking-widest">
                {path.articleCount} lesson{path.articleCount === 1 ? '' : 's'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
