import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Boxes, GraduationCap, Users } from 'lucide-react'
import { LOCALE_LABELS, SUPPORTED_LOCALES } from '../../../sanity/lib/locale'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'

export const Route = createFileRoute('/$locale/')({ component: Home })

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
  const { locale } = Route.useParams()

  return (
    <main className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(ellipse_at_top,_var(--secondary)_0%,_transparent_70%)] opacity-60 dark:opacity-20"
      />

      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center sm:py-28">
        <Badge variant="secondary" className="mb-5">
          Honecraft
        </Badge>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Learn to build with AI — and{' '}
          <span className="text-primary">hone your craft</span>.
        </h1>
        <p className="text-muted-foreground mt-5 max-w-xl text-balance text-lg">
          A practical, multilingual guide to using AI as a developer, software
          engineer, and DevOps in 2026 — from your first prompt to agentic
          workflows.
        </p>

        <div className="text-muted-foreground mt-6 flex items-center gap-2 text-sm">
          <span>Available in</span>
          {SUPPORTED_LOCALES.map((loc) => (
            <Link
              key={loc}
              to="/$locale"
              params={{ locale: loc }}
              className={`rounded-full border px-2.5 py-0.5 transition ${
                loc === locale
                  ? 'border-primary text-primary font-medium'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {LOCALE_LABELS[loc]}
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/$locale/browse" params={{ locale }}>
              Browse all articles
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/$locale/paths" params={{ locale }}>
              Learning paths
            </Link>
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-3">
          {facets.map(({ icon: Icon, title, desc }) => (
            <Link
              key={title}
              to="/$locale/browse"
              params={{ locale }}
              className="group bg-card border-border hover:border-primary/40 rounded-xl border p-5 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="bg-secondary text-secondary-foreground mb-3 flex h-9 w-9 items-center justify-center rounded-lg">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="font-medium">{title}</h2>
              <p className="text-muted-foreground mt-1 text-sm">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
