import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'
import { ThemeToggle } from '../components/ThemeToggle'
import { themeBootstrapScript } from '../lib/theme'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Honecraft — learn to build with AI',
      },
      {
        name: 'description',
        content:
          'A practical, multilingual guide to using AI as a developer, software engineer, and DevOps in 2026 — from your first prompt to agentic workflows.',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-widest">
        Honecraft
      </p>
      <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        Not found
      </h1>
      <p className="text-muted-foreground mt-5 max-w-md text-balance text-lg">
        We couldn't find that page.
      </p>
    </main>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body className="bg-background text-foreground">
        <div className="fixed right-4 top-4 z-50">
          <ThemeToggle />
        </div>
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
