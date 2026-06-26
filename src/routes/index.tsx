import { createFileRoute } from '@tanstack/react-router'
import { Boxes, GraduationCap, Users } from 'lucide-react'

export const Route = createFileRoute('/')({ component: Home })

const facets = [
  {
    icon: GraduationCap,
    title: 'By level',
    desc: 'Beginner → professional. Climb at your own pace.',
  },
  {
    icon: Users,
    title: 'By role',
    desc: 'Developer, software engineer, DevOps / SRE.',
  },
  {
    icon: Boxes,
    title: 'By topic',
    desc: 'Types of AI, agentic AI, tooling, pitfalls.',
  },
]

function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="mb-4 text-sm font-medium uppercase tracking-widest text-neutral-500">
        Honecraft
      </p>
      <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
        Learn to build with AI — and hone your craft.
      </h1>
      <p className="mt-5 max-w-xl text-balance text-lg text-neutral-600 dark:text-neutral-300">
        A practical, multilingual guide to using AI as a developer, software
        engineer, and DevOps in 2026 — from your first prompt to agentic
        workflows.
      </p>

      <div className="mt-6 flex items-center gap-2 text-sm text-neutral-500">
        <span>Available in</span>
        <span className="rounded-full border border-neutral-300 px-2 py-0.5 dark:border-neutral-700">
          English
        </span>
        <span className="rounded-full border border-neutral-300 px-2 py-0.5 dark:border-neutral-700">
          日本語
        </span>
        <span className="rounded-full border border-neutral-300 px-2 py-0.5 dark:border-neutral-700">
          မြန်မာ
        </span>
      </div>

      <div className="mt-12 grid w-full gap-4 sm:grid-cols-3">
        {facets.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="rounded-xl border border-neutral-200 p-5 text-left dark:border-neutral-800"
          >
            <Icon className="mb-3 h-5 w-5 text-neutral-700 dark:text-neutral-300" />
            <h2 className="font-medium">{title}</h2>
            <p className="mt-1 text-sm text-neutral-500">{desc}</p>
          </div>
        ))}
      </div>

      <p className="mt-12 text-sm text-neutral-400">
        Phase 1 scaffold · content &amp; CMS coming next
      </p>
    </main>
  )
}
