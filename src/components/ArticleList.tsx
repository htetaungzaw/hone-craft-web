import { Link } from '@tanstack/react-router'
import type { Locale } from '../../sanity/lib/locale'
import type { ArticleSummary } from '../lib/queries'

export function ArticleList({
  articles,
  locale,
}: {
  articles: Array<ArticleSummary>
  locale: Locale
}) {
  if (articles.length === 0) {
    return (
      <p className="mt-8 text-neutral-500">
        No articles here yet — content is being written.
      </p>
    )
  }

  return (
    <div className="mt-8 grid gap-4">
      {articles.map((article) => (
        <Link
          key={article._id}
          to="/$locale/articles/$slug"
          params={{ locale, slug: article.slug.current }}
          className="rounded-xl border border-neutral-200 p-5 text-left transition hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
        >
          <h2 className="font-medium">{article.title}</h2>
          <p className="mt-1 text-sm text-neutral-500">{article.excerpt}</p>
        </Link>
      ))}
    </div>
  )
}
