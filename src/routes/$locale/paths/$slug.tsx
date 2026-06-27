import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import type { Locale } from '../../../../sanity/lib/locale'
import { getLearningPathBySlug } from '../../../lib/queries'
import { localized } from '../../../lib/localized'

export const Route = createFileRoute('/$locale/paths/$slug')({
  loader: async ({ params }) => {
    const path = await getLearningPathBySlug(params.slug)
    if (!path) throw notFound()
    return path
  },
  component: PathPage,
})

function PathPage() {
  const { locale } = Route.useParams()
  const path = Route.useLoaderData()
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
      <p className="mt-6 text-sm font-medium uppercase tracking-widest text-neutral-500">
        Learning path
      </p>
      <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {localized(path.title, loc)}
      </h1>
      {path.description && (
        <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">
          {localized(path.description, loc)}
        </p>
      )}

      <ol className="mt-8 space-y-4">
        {path.articles.map((article, index) => (
          <li key={article._id}>
            <Link
              to="/$locale/articles/$slug"
              params={{ locale, slug: article.slug.current }}
              className="flex gap-4 rounded-xl border border-neutral-200 p-5 transition hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
            >
              <span className="text-sm font-medium text-neutral-400">{index + 1}</span>
              <div>
                <h2 className="font-medium">{article.title}</h2>
                <p className="mt-1 text-sm text-neutral-500">{article.excerpt}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  )
}
