import { Link } from '@tanstack/react-router'
import { Sparkles } from 'lucide-react'
import type { Locale } from '../../sanity/lib/locale'
import type { ArticleSummary } from '../lib/queries'
import { localized } from '../lib/localized'

interface Props {
  articles: Array<ArticleSummary>
  locale: Locale
}

export function RelatedArticles({ articles, locale }: Props) {
  return (
    <div className="mt-12">
      <h2 className="text-muted-foreground mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest">
        <Sparkles className="size-3.5" />
        Related articles
      </h2>
      <div className="grid gap-3">
        {articles.map((article) => (
          <Link
            key={article._id}
            to="/$locale/articles/$slug"
            params={{ locale, slug: article.slug.current }}
            className="bg-card border-border hover:border-primary/40 rounded-xl border p-4 transition hover:shadow-sm"
          >
            <p className="font-medium">{article.title}</p>
            <p className="text-muted-foreground mt-0.5 text-sm line-clamp-2">{article.excerpt}</p>
            <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
              {article.level && (
                <span>{localized(article.level.title, locale)}</span>
              )}
              {article.readingTime && (
                <span>· {article.readingTime} min read</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
