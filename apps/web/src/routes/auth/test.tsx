import { createFileRoute } from '@tanstack/react-router'
import { Button } from "@nrwlz/react-ui"

export const Route = createFileRoute('/auth/test')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Button >Test button</Button>
}
