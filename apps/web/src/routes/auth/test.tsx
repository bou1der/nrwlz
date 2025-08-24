import { createFileRoute } from '@tanstack/react-router'
import { Button } from "@nrwlz/react-ui"
import { useQuery } from '@tanstack/react-query'
import { api } from '~/lib/api'

export const Route = createFileRoute('/auth/test')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isPending } = useQuery({
    queryKey: ["test"],
    queryFn: async () => {
      const res = await api.GET("/test")
      if (res.error) throw res.error
      return res.data
    },
  })

  return <Button disabled={isPending}> Test button</Button>
}
