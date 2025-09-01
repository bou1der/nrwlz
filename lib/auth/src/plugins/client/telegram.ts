import type { BetterAuthClientPlugin } from "better-auth";
import type { TelegramAuthPlugin } from "@nrwlz/auth/types";

export const telegramAuthClient = () =>
  ({
    id: "telegram-auth-client",
    $InferServerPlugin: {} as TelegramAuthPlugin,
    pathMethods: {
      "/telegram/sign-in": "POST",
    },
  }) satisfies BetterAuthClientPlugin;
