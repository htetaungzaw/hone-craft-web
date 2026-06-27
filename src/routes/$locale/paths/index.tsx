import { createFileRoute, Link } from '@tanstack/react-router'
import type { Locale } from '../../../../sanity/lib/locale'
import { getLearningPaths } from '../../../lib/queries'
import { localized } from '../../../lib/localized'

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
      <Link
        to="/$locale"
        params={{ locale }}
        className="text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
      >
        ← Honecraft
      </Link>
      <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        Learning paths
      </h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">
        Curated, ordered tracks through the guide — start to finish.
      </p>

      {paths.length === 0 ? (
        <p className="mt-8 text-neutral-500">No learning paths yet.</p>
      ) : (
        <div className="mt-8 grid gap-4">
          {paths.map((path) => (
            <Link
              key={path._id}
              to="/$locale/paths/$slug"
              params={{ locale, slug: path.slug.current }}
              className="rounded-xl border border-neutral-200 p-5 text-left transition hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
            >
              <h2 className="font-medium">{localized(path.title, loc)}</h2>
              {path.description && (
                <p className="mt-1 text-sm text-neutral-500">
                  {localized(path.description, loc)}
                </p>
              )}
              <p className="mt-2 text-xs uppercase tracking-widest text-neutral-400">
                {path.articleCount} lesson{path.articleCount === 1 ? '' : 's'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
