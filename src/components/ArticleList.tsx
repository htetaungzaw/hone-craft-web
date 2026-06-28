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
      <p className="text-muted-foreground mt-8">
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
          className="bg-card border-border hover:border-primary/40 rounded-xl border p-5 text-left shadow-sm transition hover:shadow-md"
        >
          <h2 className="font-medium">{article.title}</h2>
          <p className="text-muted-foreground mt-1 text-sm">{article.excerpt}</p>
        </Link>
      ))}
    </div>
  )
}
