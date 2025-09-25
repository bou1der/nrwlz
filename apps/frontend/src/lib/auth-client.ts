import { AuthOptions } from "@nrwlz/auth/types"
import { telegramAuthClient } from "@nrwlz/auth/plugins/client"
import { createAuthClient } from "better-auth/client"
import { inferAdditionalFields, adminClient } from "better-auth/client/plugins";

const config: Omit<AuthOptions, "plugins" | "user"> = {
  baseURL: process.env.API_URL!,
  basePath: "/auth",
}

type Plugins = [
  ReturnType<typeof telegramAuthClient>,
  ReturnType<typeof adminClient>,
  ReturnType<typeof inferAdditionalFields<AuthOptions>>
]

const plugins: Plugins = [
  telegramAuthClient(),
  adminClient(),
  inferAdditionalFields<AuthOptions>(),
];

type Client = ReturnType<typeof createAuthClient<typeof config & {
  plugins: Plugins
}>>

export const authClient: Client = createAuthClient({ ...config, plugins })

