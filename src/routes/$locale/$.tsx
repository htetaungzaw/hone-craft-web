import { createFileRoute, Link } from '@tanstack/react-router'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'

export const Route = createFileRoute('/$locale/$')({ component: ComingSoon })

function ComingSoon() {
  const { locale } = Route.useParams()

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
      <Badge variant="secondary" className="mb-4">
        Honecraft
      </Badge>
      <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        Coming soon
      </h1>
      <p className="text-muted-foreground mt-5 max-w-md text-balance text-lg">
        This section is being built. The site updates as each phase ships —
        check back soon.
      </p>
      <Button asChild variant="outline" className="mt-8">
        <Link to="/$locale" params={{ locale }}>
          ← Back home
        </Link>
      </Button>
    </main>
  )
}
