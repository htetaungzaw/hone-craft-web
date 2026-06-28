import { createFileRoute, notFound } from '@tanstack/react-router'
import type { Locale } from '../../../../sanity/lib/locale'
import { getArticlesByTaxonomy, getTaxonomyTerm } from '../../../lib/queries'
import { localized } from '../../../lib/localized'
import { ArticleList } from '../../../components/ArticleList'
import { BackLink } from '../../../components/BackLink'

export const Route = createFileRoute('/$locale/topics/$topic')({
  loader: async ({ params }) => {
    const term = await getTaxonomyTerm('topic', params.topic)
    if (!term) throw notFound()
    const articles = await getArticlesByTaxonomy('topics', term._id, params.locale as Locale)
    return { term, articles }
  },
  component: TopicPage,
})

function TopicPage() {
  const { locale } = Route.useParams()
  const { term, articles } = Route.useLoaderData()

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <BackLink locale={locale} />
      <p className="text-muted-foreground mt-6 text-sm font-medium uppercase tracking-widest">Topic</p>
      <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {localized(term.title, locale as Locale)}
      </h1>
      {term.description && (
        <p className="text-muted-foreground mt-3 text-lg">
          {localized(term.description, locale as Locale)}
        </p>
      )}
      <ArticleList articles={articles} locale={locale as Locale} />
    </main>
  )
}
