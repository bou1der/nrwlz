import { betterAuth, BetterAuthOptions, BetterAuthPlugin } from "better-auth";
import { admin, openAPI } from "better-auth/plugins";
import { UserRoleEnum } from "@lrp/shared";
import { AdminPlugin, adminPluginConfig } from "./plugins/admin";
import { Global, Injectable } from "@nestjs/common";
// import { getNameFromTelegram, telegramAuth } from "./plugins";
import { ConfigService } from "@nestjs/config";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { typeormAdapter } from "./adapters/typeorm.adapter";

export type Plugins = [
  // ReturnType<typeof telegramAuth>,
  AdminPlugin,
  ...BetterAuthPlugin[]
];

const additionalField = {
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: UserRoleEnum.user,
        input: false,
      },
    },
  },
} as const satisfies Pick<BetterAuthOptions, "user" | "session" | "account" | "verification">;
type AdditionalFields = typeof additionalField;

export interface AuthOptions
  extends Omit<BetterAuthOptions, "plugins" | "user" | "session" | "account" | "verification">,
  AdditionalFields {
  readonly plugins: Plugins;
}

type BetterAuthClient = Omit<ReturnType<typeof betterAuth<AuthOptions>>, "$ERROR_CODES">;

@Global()
@Injectable()
export class AuthService {
  readonly client: BetterAuthClient

  constructor(
    env: ConfigService,
    @InjectDataSource() db: DataSource,
  ) {
    this.client = betterAuth({
      secret: env.getOrThrow("AUTH_SECRET"),
      basePath: "/auth",
      baseURL: env.getOrThrow("API_URL"),
      rateLimit: {
        enabled: env.getOrThrow("NODE_ENV") === "production",
        max: 100,
      },
      advanced: {
        defaultCookieAttributes: {
          httpOnly: true,
          secure: true,
          partitioned: true,
        },
        useSecureCookies: true,
        crossSubDomainCookies: {
          enabled: true,
        },
      },
      database: typeormAdapter(db),
      plugins: [
        // telegramAuth({
        //   templates: {
        //     getTempEmail: tg => `${getNameFromTelegram(tg)}@${env.get("NEXT_PUBLIC_DOMAIN")}`,
        //     getTempName: tg => `${getNameFromTelegram(tg)}`,
        //   },
        //   token: env.getOrThrow("TELEGRAM_BOT_TOKEN"),
        // }),
        admin(adminPluginConfig),
        ...(env.get("NODE_ENV") === "development" ? [openAPI()] : []),
      ],
      trustedOrigins: JSON.parse(env.get("TRUSTED_ORIGINS") || "[]"),
      ...additionalField,
    } satisfies AuthOptions);
  }
}

export type Auth = ReturnType<typeof betterAuth<AuthOptions>>;

export type UserSession<T extends null | "!" = "!"> = T extends null ?
  Awaited<ReturnType<Auth["api"]["getSession"]>>
  : NonNullable<Awaited<ReturnType<Auth["api"]["getSession"]>>>;
