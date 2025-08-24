import type { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint } from "better-auth/plugins";
import { InitData, parse, validate } from "@telegram-apps/init-data-node";
import { z } from "zod";
import { Account, User } from "../entities";
import { UserRoleEnum } from "@nrwlz/shared/types/user";

const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const cookie_name = "session_token";
const provider_id = "telegram";

export const getNameFromTelegram = (user: NonNullable<InitData["user"]>) =>
  user.username || `${user.firstName} ${user.lastName}`;

export interface TelegramAuthOptions {
  templates: {
    getTempEmail: (telegramUser: NonNullable<InitData["user"]>) => string;
    getTempName: (telegramUser: NonNullable<InitData["user"]>) => string;
  };
  // startParamEvent?: (data: {
  //   user: typeof schema.user.$inferSelect;
  //   startParam: URLSearchParams;
  // }) => Promise<void>;
}

export const telegramAuth = ({ templates }: TelegramAuthOptions) =>
  ({
    id: "tg-mini-app-auth",
    schema: {
      user: {
        modelName: "user",
        fields: {
          telegramId: {
            type: "string",
            unique: true,
            required: true,
          },
          username: {
            type: "string",
            unique: true,
            required: false,
          },
          firstName: {
            type: "string",
            unique: false,
            required: true,
          },
          lastName: {
            type: "string",
            unique: false,
            required: false,
          },
        },
      },
    },
    endpoints: {
      telegramAuth: createAuthEndpoint(
        "/telegram/sign-in",
        {
          method: "POST",
          requireHeaders: true,
          body: z.object({
            initDataRaw: z.string(),
          }),
        },
        async ({ context, ...req }) => {
          try {
            validate(req.body.initDataRaw, process.env.TELEGRAM_BOT_TOKEN as string);
          } catch (_err) {
            if (_err instanceof Error) {
              context.logger.error(_err.message, _err.name, _err.cause)
            } else {
              console.error(_err)
            }
            return req.error(401, {
              message: "Data not valid",
              code: "INVALID_INIT_DATA",
            });
          }
          const initData = parse(req.body.initDataRaw);
          if (!initData.user)
            return req.error("BAD_REQUEST", {
              code: "INVALID_TELEGRAM_USER",
              message: "Ошибка получения пользователя",
            });

          const account = await context.adapter.findOne({
            model: "account",
            where: [
              {
                field: "providerId",
                value: provider_id,
                operator: "eq",
              },
              {
                field: "accountId",
                value: initData.user.id.toString(),
              },
            ],
          });

          let user: User | null = null;

          if (account) {
            user = (await context.adapter.findOne({
              model: "user",
              where: [
                {
                  field: "telegramId",
                  value: initData.user.id.toString(),
                  operator: "eq",
                },
              ],
            }))!;
          } else {
            const { id: _, ...data } = initData.user;
            user = await context.adapter.create<Partial<User>, User>({
              model: "user",
              data: {
                // telegramId: initData.user.id.toString(),
                ...data,
                role: initData.user.id.toString() === process.env.MAIN_ADMIN_ID ? UserRoleEnum.admin : UserRoleEnum.user,
                // name: templates.getTempName(initData.user),
                email: templates.getTempEmail(initData.user),
                emailVerified: false,
                updatedAt: new Date(),
                createdAt: new Date(),
              },
            });
            await context.adapter.create<Partial<Account>>({
              model: "account",
              data: {
                accountId: initData.user.id.toString(),
                providerId: provider_id,
                user: user,
                updatedAt: new Date(),
                createdAt: new Date(),
              },
            });
          }
          // if (startParamEvent && initData.startParam) {
          //   await startParamEvent({
          //     user,
          //     startParam: new URLSearchParams(initData.startParam),
          //   });
          // }
          const cookie = context.createAuthCookie(cookie_name, {
            maxAge: SESSION_MAX_AGE,
          });
          try {
            async function clearOldSession() {
              const oldToken = await req.getSignedCookie(cookie.name, context.secret);
              if (oldToken) {
                await context.internalAdapter.deleteSession(oldToken);
              }
            }
            clearOldSession();
          } catch (err) {
            if (err instanceof Error) {
              context.logger.error(err.message, err.name, err.cause)
            } else {
              console.error(err)
            }
          }
          const session = await context.internalAdapter.createSession(user.id, req.headers, false);
          await req.setSignedCookie(cookie.name, session.token, context.secret, cookie.attributes);
          return req.json({
            ok: true,
          });
        },
      ),
    },
  }) satisfies BetterAuthPlugin;

export type TelegramAuthPlugin = ReturnType<typeof telegramAuth>
