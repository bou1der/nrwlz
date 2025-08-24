import * as ReactDOM from 'react-dom/client';
import { createRouter as createTanStackRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './tree.gen'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/query-client'
import { StrictMode } from 'react';

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    Wrap: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    ),
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}

const root = ReactDOM.createRoot(
  document.querySelector('html') as HTMLElement
)

root.render(
  <StrictMode>
    <RouterProvider router={createRouter()} />
  </StrictMode>
)
