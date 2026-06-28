import { createFileRoute } from '@tanstack/react-router'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'

const STUDIO_URL = 'https://honecraft.sanity.studio'

export const Route = createFileRoute('/studio/')({ component: StudioLink })

function StudioLink() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-16 text-center">
      <Badge variant="secondary" className="mb-4">
        Honecraft
      </Badge>
      <h1 className="text-balance text-3xl font-semibold tracking-tight">Content Studio</h1>
      <p className="text-muted-foreground mt-4 text-balance">
        The admin Studio is hosted separately by Sanity.
      </p>
      <Button asChild size="lg" className="mt-8 rounded-full">
        <a href={STUDIO_URL}>Open Studio →</a>
      </Button>
    </main>
  )
}
