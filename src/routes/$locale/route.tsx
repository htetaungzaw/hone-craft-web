import { createFileRoute, notFound, Outlet } from '@tanstack/react-router'
import type { Locale } from '../../../sanity/lib/locale'
import { SUPPORTED_LOCALES } from '../../../sanity/lib/locale'

export const Route = createFileRoute('/$locale')({
  beforeLoad: ({ params }) => {
    if (!SUPPORTED_LOCALES.includes(params.locale as Locale)) {
      throw notFound()
    }
  },
  component: () => <Outlet />,
})
