import { createFileRoute, notFound } from '@tanstack/react-router'
import type { Locale } from '../../../../sanity/lib/locale'
import { getArticleBySlug, getLessonNeighbors } from '../../../lib/queries'
import { localized } from '../../../lib/localized'
import { urlFor } from '../../../lib/image'
import { Badge } from '../../../components/ui/badge'
import { BackLink } from '../../../components/BackLink'
import { ArticleBody } from '../../../components/ArticleBody'
import { LessonNav } from '../../../components/LessonNav'

export const Route = createFileRoute('/$locale/articles/$slug')({
  loader: async ({ params }) => {
    const result = await getArticleBySlug(params.slug, params.locale as Locale)
    if (!result) throw notFound()
    const neighbors = await getLessonNeighbors(result.article, params.locale as Locale)
    return { ...result, neighbors }
  },
  component: ArticlePage,
})

function ArticlePage() {
  const { locale } = Route.useParams()
  const { article, isFallback, neighbors } = Route.useLoaderData()

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <BackLink locale={locale} />

      {isFallback && (
        <p className="mt-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
          This article isn't translated yet — showing the English version.
        </p>
      )}

      <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {article.title}
      </h1>
      <p className="text-muted-foreground mt-3 text-lg">{article.excerpt}</p>

      <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-2 text-sm">
        {article.level && (
          <Badge variant="secondary">{localized(article.level.title, locale as Locale)}</Badge>
        )}
        {article.roles.map((role) => (
          <Badge key={role._id} variant="outline">
            {localized(role.title, locale as Locale)}
          </Badge>
        ))}
        {article.readingTime && <span>{article.readingTime} min read</span>}
      </div>

      {Boolean(article.heroImage) && (
        <img
          src={urlFor(article.heroImage as never).width(1200).url()}
          alt=""
          className="border-border mt-8 w-full rounded-xl border"
        />
      )}

      <div className="prose prose-theme mt-8 max-w-none">
        <ArticleBody value={article.body} />
      </div>

      {article.author && (
        <div className="border-border mt-12 flex items-center gap-3 border-t pt-6">
          {Boolean(article.author.avatar) && (
            <img
              src={urlFor(article.author.avatar as never).width(80).height(80).url()}
              alt=""
              className="h-10 w-10 rounded-full"
            />
          )}
          <div>
            <p className="font-medium">{article.author.name}</p>
            {article.author.bio && (
              <p className="text-muted-foreground text-sm">{article.author.bio}</p>
            )}
          </div>
        </div>
      )}

      {neighbors && <LessonNav neighbors={neighbors} locale={locale as Locale} />}
    </main>
  )
}
