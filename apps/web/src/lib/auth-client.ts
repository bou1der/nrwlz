import { AuthOptions } from "@nrwlz/auth/types"
import { telegramAuthClient } from "@nrwlz/auth/plugins/client"
import { createAuthClient } from "better-auth/client"
import { inferAdditionalFields, adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: import.meta.env.API_URL,
  plugins: [
    inferAdditionalFields<AuthOptions>(),
    adminClient(),
    telegramAuthClient()
  ]
})

