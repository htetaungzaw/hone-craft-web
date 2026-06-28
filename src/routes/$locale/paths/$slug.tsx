import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import type { Locale } from '../../../../sanity/lib/locale'
import { getLearningPathBySlug } from '../../../lib/queries'
import { localized } from '../../../lib/localized'
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

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
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
              <div>
                <h2 className="font-medium">{article.title}</h2>
                <p className="text-muted-foreground mt-1 text-sm">{article.excerpt}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  )
}
