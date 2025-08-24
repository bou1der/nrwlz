
import { createClient } from "@nrwlz/api-fetch"

export const api = createClient({
  baseUrl: import.meta.env.BASE_URL
})
