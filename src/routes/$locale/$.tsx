import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/$locale/$')({ component: ComingSoon })

function ComingSoon() {
  const { locale } = Route.useParams()

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="mb-4 text-sm font-medium uppercase tracking-widest text-neutral-500">
        Honecraft
      </p>
      <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        Coming soon
      </h1>
      <p className="mt-5 max-w-md text-balance text-lg text-neutral-600 dark:text-neutral-300">
        This section is being built. The site updates as each phase ships —
        check back soon.
      </p>
      <Link
        to="/$locale"
        params={{ locale }}
        className="mt-8 rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium dark:border-neutral-700"
      >
        ← Back home
      </Link>
    </main>
  )
}
