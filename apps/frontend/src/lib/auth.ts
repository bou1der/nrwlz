import type { AuthOptions } from "@nrwlz/auth/types"
import { telegramAuthClient } from "@nrwlz/auth/plugins/client"
import { ClientOptions, createAuthClient } from "better-auth/client"
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { Injectable } from "@angular/core";


const options = {
  baseURL: "http://localhost:8000",
  plugins: [
    inferAdditionalFields<AuthOptions>(),
    adminClient(),
    telegramAuthClient()
  ]
} satisfies ClientOptions

@Injectable()
export class AuthProvider {
  client: ReturnType<typeof createAuthClient<typeof options>>
  constructor() {
    this.client = createAuthClient(options)
  }
}
