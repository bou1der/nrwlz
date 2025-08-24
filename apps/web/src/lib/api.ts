
import { createClient } from "@nrwlz/api-fetch"

export const api = createClient({
  baseUrl: import.meta.env.VITE_API_URL,
})
