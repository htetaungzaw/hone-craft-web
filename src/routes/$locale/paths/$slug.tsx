import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { CheckCircle2, Clock } from 'lucide-react'
import type { Locale } from '../../../../sanity/lib/locale'
import { getLearningPathBySlug } from '../../../lib/queries'
import { localized } from '../../../lib/localized'
import { useReadArticles } from '../../../lib/useReadArticles'
import { BackLink } from '../../../components/BackLink'

export const Route = createFileRoute('/$locale/paths/$slug')({
  loader: async ({ params }) => {
    const path = await getLearningPathBySlug(params.slug, params.locale as Locale)
    if (!path) throw notFound()
    return path
  },
  component: PathPage,
})

function PathPage() {
  const { locale } = Route.useParams()
  const path = Route.useLoaderData()
  const loc = locale as Locale
  const [readArticles] = useReadArticles()

  const totalMinutes = path.articles.reduce((sum, a) => sum + (a.readingTime ?? 0), 0)
  const completedCount = path.articles.filter((a) => readArticles.has(a._id)).length
  const progressPct = path.articles.length > 0
    ? Math.round((completedCount / path.articles.length) * 100)
    : 0

  return (
    <main className="relative mx-auto max-w-2xl overflow-hidden px-6 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(ellipse_at_top,_var(--secondary)_0%,_transparent_70%)] opacity-50 dark:opacity-20"
      />
      <BackLink locale={locale} />
      <p className="text-muted-foreground mt-6 text-sm font-medium uppercase tracking-widest">
        Learning path
      </p>
      <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {localized(path.title, loc)}
      </h1>
      {path.description && (
        <p className="text-muted-foreground mt-3 text-lg">{localized(path.description, loc)}</p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
        {totalMinutes > 0 && (
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Clock className="size-3.5 opacity-60" />
            {totalMinutes} min total
          </span>
        )}
        <span className="text-muted-foreground flex items-center gap-1.5">
          <CheckCircle2 className="size-3.5 opacity-60" />
          {completedCount} / {path.articles.length} completed
        </span>
      </div>

      {completedCount > 0 && (
        <div className="mt-3">
          <div className="bg-secondary h-1.5 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      <ol className="mt-8 space-y-4">
        {path.articles.map((article, index) => (
          <li key={article._id}>
            <Link
              to="/$locale/articles/$slug"
              params={{ locale, slug: article.slug.current }}
              className="bg-card border-border hover:border-primary/40 flex gap-4 rounded-xl border p-5 shadow-sm transition hover:shadow-md"
            >
              <span className="bg-secondary text-secondary-foreground flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-medium">{article.title}</h2>
                <p className="text-muted-foreground mt-1 text-sm">{article.excerpt}</p>
              </div>
              {readArticles.has(article._id) && (
                <CheckCircle2 className="text-primary size-4 shrink-0 self-center" />
              )}
            </Link>
          </li>
        ))}
      </ol>
    </main>
  )
}
