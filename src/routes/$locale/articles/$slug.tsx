import { createFileRoute, notFound } from '@tanstack/react-router'
import { CalendarDays, RefreshCw } from 'lucide-react'
import { useEffect } from 'react'
import type { Locale } from '../../../../sanity/lib/locale'
import { getArticleBySlug, getLessonNeighbors, getRelatedArticles, getArticleTranslations } from '../../../lib/queries'
import { localized } from '../../../lib/localized'
import { urlFor } from '../../../lib/image'
import { formatDate, timeAgo } from '../../../lib/date'
import { useReadArticles } from '../../../lib/useReadArticles'
import { useBookmarks } from '../../../lib/useBookmarks'
import { Badge } from '../../../components/ui/badge'
import { BackLink } from '../../../components/BackLink'
import { ArticleBody } from '../../../components/ArticleBody'
import { LessonNav } from '../../../components/LessonNav'
import { RelatedArticles } from '../../../components/RelatedArticles'
import { LanguageSwitcher } from '../../../components/LanguageSwitcher'
import { BookmarkButton } from '../../../components/BookmarkButton'
import { DifficultyIndicator } from '../../../components/DifficultyIndicator'
import { AiPromptCallout } from '../../../components/AiPromptCallout'

export const Route = createFileRoute('/$locale/articles/$slug')({
  loader: async ({ params }) => {
    const result = await getArticleBySlug(params.slug, params.locale as Locale)
    if (!result) throw notFound()
    const [neighbors, related, translations] = await Promise.all([
      getLessonNeighbors(result.article, params.locale as Locale),
      getRelatedArticles(result.article, params.locale as Locale),
      getArticleTranslations(result.article),
    ])
    return { ...result, neighbors, related, translations }
  },
  component: ArticlePage,
})

function ArticlePage() {
  const { locale } = Route.useParams()
  const { article, isFallback, neighbors, related, translations } = Route.useLoaderData()
  const [, markRead] = useReadArticles()
  const [bookmarks, toggleBookmark] = useBookmarks()

  useEffect(() => {
    markRead(article._id)
  }, [article._id])

  return (
    <main className="relative mx-auto max-w-2xl overflow-hidden px-6 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(ellipse_at_top,_var(--secondary)_0%,_transparent_70%)] opacity-40 dark:opacity-15"
      />
      <div className="flex items-center justify-between">
        <BackLink locale={locale} />
        <BookmarkButton
          bookmarked={bookmarks.has(article._id)}
          onToggle={() => toggleBookmark({ id: article._id, title: article.title, slug: article.slug.current, locale })}
        />
      </div>

      {isFallback && (
        <p className="mt-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
          This article isn't translated yet — showing the English version.
        </p>
      )}

      <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {article.title}
      </h1>
      <p className="text-muted-foreground mt-3 text-lg">{article.excerpt}</p>

      <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
        {article.level && (
          <DifficultyIndicator level={article.level} locale={locale as Locale} />
        )}
        {article.roles.map((role) => (
          <Badge key={role._id} variant="outline">
            {localized(role.title, locale as Locale)}
          </Badge>
        ))}
        {article.readingTime && <span>{article.readingTime} min read</span>}

        <span className="bg-border mx-1 hidden h-3.5 w-px sm:inline-block" aria-hidden="true" />

        <span className="flex items-center gap-1.5">
          <CalendarDays className="size-3.5 shrink-0 opacity-60" />
          {formatDate(article._createdAt)}
        </span>

        {article._updatedAt !== article._createdAt && (
          <span className="flex items-center gap-1.5">
            <RefreshCw className="size-3.5 shrink-0 opacity-60" />
            {formatDate(article._updatedAt)}
            <span
              className="text-muted-foreground/60"
              title={new Date(article._updatedAt).toLocaleString('en', { dateStyle: 'medium', timeStyle: 'short' })}
            >
              ({timeAgo(article._updatedAt)})
            </span>
          </span>
        )}
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

      {article.aiPrompt && <AiPromptCallout prompt={article.aiPrompt} />}

      <LanguageSwitcher translations={translations} currentLocale={locale as Locale} />

      {neighbors && <LessonNav neighbors={neighbors} locale={locale as Locale} />}

      {related.length > 0 && (
        <RelatedArticles articles={related} locale={locale as Locale} />
      )}

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
    </main>
  )
}
