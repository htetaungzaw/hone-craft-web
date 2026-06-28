import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import type { Locale } from '../../sanity/lib/locale'

export function BackLink({ locale }: { locale: Locale | string }) {
  return (
    <Link
      to="/$locale"
      params={{ locale }}
      className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition"
    >
      <ArrowLeft className="size-4" />
      Honecraft
    </Link>
  )
}
