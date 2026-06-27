import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import type { Locale } from '../../../../sanity/lib/locale'
import { getArticlesByTaxonomy, getTaxonomyTerm } from '../../../lib/queries'
import { localized } from '../../../lib/localized'
import { ArticleList } from '../../../components/ArticleList'

export const Route = createFileRoute('/$locale/levels/$level')({
  loader: async ({ params }) => {
    const term = await getTaxonomyTerm('level', params.level)
    if (!term) throw notFound()
    const articles = await getArticlesByTaxonomy('level', term._id, params.locale as Locale)
    return { term, articles }
  },
  component: LevelPage,
})

function LevelPage() {
  const { locale } = Route.useParams()
  const { term, articles } = Route.useLoaderData()

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link
        to="/$locale"
        params={{ locale }}
        className="text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
      >
        ← Honecraft
      </Link>
      <p className="mt-6 text-sm font-medium uppercase tracking-widest text-neutral-500">Level</p>
      <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {localized(term.title, locale as Locale)}
      </h1>
      {term.description && (
        <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">
          {localized(term.description, locale as Locale)}
        </p>
      )}
      <ArticleList articles={articles} locale={locale as Locale} />
    </main>
  )
}
