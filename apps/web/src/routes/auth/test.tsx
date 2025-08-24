import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/test')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/auth/test"!</div>
}
