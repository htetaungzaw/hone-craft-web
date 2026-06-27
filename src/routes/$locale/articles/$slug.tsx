import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { PortableText } from '@portabletext/react'
import type { Locale } from '../../../../sanity/lib/locale'
import { getArticleBySlug } from '../../../lib/queries'
import { localized } from '../../../lib/localized'
import { urlFor } from '../../../lib/image'

export const Route = createFileRoute('/$locale/articles/$slug')({
  loader: async ({ params }) => {
    const result = await getArticleBySlug(params.slug, params.locale as Locale)
    if (!result) throw notFound()
    return result
  },
  component: ArticlePage,
})

function ArticlePage() {
  const { locale } = Route.useParams()
  const { article, isFallback } = Route.useLoaderData()

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link
        to="/$locale"
        params={{ locale }}
        className="text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
      >
        ← Honecraft
      </Link>

      {isFallback && (
        <p className="mt-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
          This article isn't translated yet — showing the English version.
        </p>
      )}

      <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {article.title}
      </h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">{article.excerpt}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-neutral-500">
        {article.level && (
          <span className="rounded-full border border-neutral-300 px-2 py-0.5 dark:border-neutral-700">
            {localized(article.level.title, locale as Locale)}
          </span>
        )}
        {article.roles.map((role) => (
          <span
            key={role._id}
            className="rounded-full border border-neutral-300 px-2 py-0.5 dark:border-neutral-700"
          >
            {localized(role.title, locale as Locale)}
          </span>
        ))}
        {article.readingTime && <span>{article.readingTime} min read</span>}
      </div>

      {Boolean(article.heroImage) && (
        <img
          src={urlFor(article.heroImage as never).width(1200).url()}
          alt=""
          className="mt-8 w-full rounded-xl"
        />
      )}

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <PortableText value={article.body as never} />
      </div>

      {article.author && (
        <div className="mt-12 flex items-center gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-800">
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
              <p className="text-sm text-neutral-500">{article.author.bio}</p>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
