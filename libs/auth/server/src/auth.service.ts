import { Adapter, betterAuth, BetterAuthOptions, BetterAuthPlugin, Logger } from "better-auth";
import { admin, openAPI } from "better-auth/plugins";
import { UserRoleEnum } from "@lrp/shared/types/user";
import { AdminPlugin, adminPluginConfig } from "./plugins/admin";
import { telegramAuth } from "./plugins";
import { ConfigService } from "@nestjs/config";
// import { IUser } from "./entities";

export interface AuthServiceOptions {
  env: ConfigService;
  adapter: (args: BetterAuthOptions) => Adapter;
  logger?: Logger,
}


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
      balance: {
        type: "number",
        required: true,
        defaultValue: 0,
        input: false,
      },
      telegramId: {
        type: "string",
        required: false,
      }
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

export class AuthService {
  readonly client: BetterAuthClient

  constructor(
    options: AuthServiceOptions
  ) {
    this.client = betterAuth({
      secret: options.env.getOrThrow("AUTH_SECRET"),
      basePath: "/auth",
      // baseURL: env.getOrThrow("API_URL"),
      rateLimit: {
        enabled: options.env.getOrThrow("NODE_ENV") === "production",
        max: 100,
      },
      logger: options.logger,
      advanced: {
        defaultCookieAttributes: {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          partitioned: true,
        },
        useSecureCookies: true,
        crossSubDomainCookies: {
          enabled: true,
          domain: `.${new URL(options.env.getOrThrow("API_URL")).host.split(".").slice(-2).join('.')}`
        },
      },
      database: options.adapter,
      emailAndPassword: {
        enabled: false,
      },
      plugins: [
        // telegramAuth({
        //   templates: {
        //     getTempEmail: tg => `${getNameFromTelegram(tg)}@example.com`,
        //     getTempName: tg => `${getNameFromTelegram(tg)}`,
        //   },
        //   token: options.env.getOrThrow("TELEGRAM_BOT_TOKEN"),
        //   hooks: {
        //     create: {
        //       after: async ({ user, initData, adapter }) => {
        //         if (!user.id) return;
        //         if (initData.start_param) {
        //           const inviter = await adapter.findOne<IUser>({
        //             where: [
        //               {
        //                 field: "telegramId",
        //                 operator: "eq",
        //                 value: initData.start_param
        //               },
        //               {
        //                 field: "id",
        //                 operator: "ne",
        //                 value: user.id
        //               }
        //             ],
        //             model: "user",
        //           })
        //
        //           if (!inviter) return
        //
        //           await adapter.update<IUser>({
        //             where: [
        //               {
        //                 field: "id",
        //                 operator: "eq",
        //                 value: user.id
        //               }
        //             ],
        //             model: "user",
        //             update: {
        //               invitedBy: inviter.id,
        //             }
        //           })
        //         }
        //       }
        //     }
        //   }
        // }),
        admin(adminPluginConfig),
        ...(options.env.get("NODE_ENV") === "development" ? [openAPI()] : []),
      ],
      trustedOrigins: JSON.parse(options.env.get("TRUSTED_ORIGINS") || "[]"),
      ...additionalField,
    } satisfies AuthOptions);
  }
}

export type Auth = ReturnType<typeof betterAuth<AuthOptions>>;
export type DefaultSession = NonNullable<Awaited<ReturnType<Auth["api"]["getSession"]>>>

export interface Session<T extends null | "!" = "!"> {
  user: T extends null ? DefaultSession["user"] | null : DefaultSession["user"];
  session: DefaultSession["session"] | null;
}
