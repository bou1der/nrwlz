import type { AuthOptions } from "@lrp/auth/server"
import { telegramAuthClient } from "@lrp/auth/client"
import { ClientOptions, createAuthClient } from "better-auth/client"
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";

const options = {
  baseURL: window.location.origin,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [
    inferAdditionalFields<AuthOptions>(),
    adminClient(),
    telegramAuthClient()
  ]
} satisfies ClientOptions

export class AuthProvider {
  api: ReturnType<typeof createAuthClient<typeof options>>
  constructor() {
    this.api = createAuthClient(options)
  }
}
