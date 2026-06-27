import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })

  if (typeof window !== 'undefined') {
    // After a new deploy, route chunks the client already loaded can reference
    // hashed filenames that no longer exist on the server. Reload to fetch the
    // current build instead of showing an error.
    window.addEventListener('vite:preloadError', () => {
      window.location.reload()
    })
  }

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
