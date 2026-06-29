import { createFileRoute, notFound } from '@tanstack/react-router'
import type { Locale } from '../../../../sanity/lib/locale'
import { getArticlesByTaxonomy, getTaxonomyTerm } from '../../../lib/queries'
import { localized } from '../../../lib/localized'
import { GraduationCap } from 'lucide-react'
import { ArticleList } from '../../../components/ArticleList'
import { BackLink } from '../../../components/BackLink'
import { TaxonomyHeader } from '../../../components/TaxonomyHeader'

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
      <BackLink locale={locale} />
      <TaxonomyHeader
        icon={GraduationCap}
        label="Level"
        title={localized(term.title, locale as Locale)}
        description={term.description ? localized(term.description, locale as Locale) : undefined}
      />
      <ArticleList articles={articles} locale={locale as Locale} />
    </main>
  )
}
