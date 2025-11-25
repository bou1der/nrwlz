import type { AuthOptions } from "@lrp/auth/server"
import { telegramAuthClient } from "@lrp/auth/client"
import { ClientOptions, createAuthClient } from "better-auth/client"
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

export class AuthProvider {
  snack = inject(MatSnackBar)
  options = {
    baseURL: window.location.origin,
    fetchOptions: {
      credentials: "include",
      onError: ({ error }) => {
        this.snack.open(error.message ? error.message : "Непредвиденная ошибка", undefined, {
          duration: 4000,
          politeness: "polite",
          panelClass: ["error"]
        })
      }
    },
    plugins: [
      inferAdditionalFields<AuthOptions>(),
      adminClient(),
      telegramAuthClient()
    ]
  } satisfies ClientOptions
  api: ReturnType<typeof createAuthClient<typeof this.options>>

  constructor() {
    this.api = createAuthClient(this.options)
  }
}

export type Session = AuthProvider["api"]["$Infer"]["Session"]
