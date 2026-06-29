import { createFileRoute } from '@tanstack/react-router'
import type { Locale } from '../../../sanity/lib/locale'
import { getGlossaryTerms } from '../../lib/queries'
import { BackLink } from '../../components/BackLink'

export const Route = createFileRoute('/$locale/glossary')({
  loader: ({ params }) => getGlossaryTerms(params.locale as Locale),
  component: GlossaryPage,
})

function GlossaryPage() {
  const { locale } = Route.useParams()
  const { terms, isFallback } = Route.useLoaderData()

  return (
    <main className="relative mx-auto max-w-2xl overflow-hidden px-6 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(ellipse_at_top,_var(--secondary)_0%,_transparent_70%)] opacity-50 dark:opacity-20"
      />
      <BackLink locale={locale} />
      <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        Glossary
      </h1>

      {isFallback && (
        <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
          Not translated yet — showing English terms.
        </p>
      )}

      {terms.length === 0 ? (
        <p className="text-muted-foreground mt-8">No terms yet — the glossary is being written.</p>
      ) : (
        <dl className="mt-8 space-y-6">
          {terms.map((term) => (
            <div key={term._id} id={term.slug.current} className="border-border border-b pb-5">
              <dt className="text-primary font-semibold">{term.term}</dt>
              <dd className="text-muted-foreground mt-1.5">{term.definition}</dd>
            </div>
          ))}
        </dl>
      )}
    </main>
  )
}
