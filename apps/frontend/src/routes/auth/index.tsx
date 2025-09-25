import { createFileRoute } from '@tanstack/react-router'
// import { Button } from "@lrp/react-ui"
import { useQuery } from '@tanstack/react-query'
// import { api } from '~/lib/api'

export const Route = createFileRoute('/auth/')({
  component: RouteComponent,
})

function RouteComponent() {
  // const { isPending } = useQuery({
  //   queryKey: ["test"],
  //   queryFn: async () => {
  //     const res = await api.GET("/test")
  //     if (res.error) throw res.error
  //     return res.data
  //   },
  // })

  return (
    <div>
      <h1 className="text-background">Test</h1>
    </div>
  )
}
// <Button disabled={isPending}> Test button</Button>
