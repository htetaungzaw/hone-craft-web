import { createFileRoute, Link } from '@tanstack/react-router'
import type { Locale } from '../../../sanity/lib/locale'
import { getGlossaryTerms } from '../../lib/queries'

export const Route = createFileRoute('/$locale/glossary')({
  loader: ({ params }) => getGlossaryTerms(params.locale as Locale),
  component: GlossaryPage,
})

function GlossaryPage() {
  const { locale } = Route.useParams()
  const { terms, isFallback } = Route.useLoaderData()

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link
        to="/$locale"
        params={{ locale }}
        className="text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
      >
        ← Honecraft
      </Link>
      <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        Glossary
      </h1>

      {isFallback && (
        <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
          Not translated yet — showing English terms.
        </p>
      )}

      {terms.length === 0 ? (
        <p className="mt-8 text-neutral-500">No terms yet — the glossary is being written.</p>
      ) : (
        <dl className="mt-8 space-y-6">
          {terms.map((term) => (
            <div key={term._id} id={term.slug.current}>
              <dt className="font-medium">{term.term}</dt>
              <dd className="mt-1 text-neutral-600 dark:text-neutral-300">{term.definition}</dd>
            </div>
          ))}
        </dl>
      )}
    </main>
  )
}
