import { createFileRoute } from '@tanstack/react-router'

const STUDIO_URL = 'https://honecraft.sanity.studio'

export const Route = createFileRoute('/studio/')({ component: StudioLink })

function StudioLink() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-16 text-center">
      <p className="mb-4 text-sm font-medium uppercase tracking-widest text-neutral-500">
        Honecraft
      </p>
      <h1 className="text-balance text-3xl font-semibold tracking-tight">
        Content Studio
      </h1>
      <p className="mt-4 text-balance text-neutral-600 dark:text-neutral-300">
        The admin Studio is hosted separately by Sanity.
      </p>
      <a
        href={STUDIO_URL}
        className="mt-8 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
      >
        Open Studio →
      </a>
    </main>
  )
}
