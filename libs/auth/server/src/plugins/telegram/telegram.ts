import type { Adapter, BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint } from "better-auth/plugins";
import { InitData, parse, validate } from "@tma.js/init-data-node"
import { z } from "zod";
import { IAccount, IUser } from "../../entities";
import { UserRoleEnum } from "@lrp/shared/types/user";

type MaybePromise<T> = T | Promise<T>;

const SESSION_MAX_AGE = 60 * 60 * 24 * 1;
const cookie_name = "session_token";
export const provider_id = "telegram";

export const getNameFromTelegram = (user: NonNullable<InitData["user"]>) =>
  user.username || `${user.first_name} ${user.last_name}`;

type Hook<T = undefined> = (data: {
  user: Partial<IUser>,
  initData: InitData,
  adapter: Adapter
}) => T extends undefined ? MaybePromise<Partial<IUser>> : T;

export interface TelegramAuthOptions {
  templates: {
    getTempEmail: (telegramIUser: NonNullable<InitData["user"]>) => string;
    getTempName: (telegramIUser: NonNullable<InitData["user"]>) => string;
  };
  hooks?: {
    create?: {
      before?: Hook,
      after?: Hook<void>,
    },
  },
  token: string
}

export const telegramAuth = ({ templates, hooks, token }: TelegramAuthOptions) =>
  ({
    id: "tg-mini-app-auth",
    schema: {
      user: {
        modelName: "user",
        fields: {
          telegramId: {
            type: "string",
            unique: true,
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
            validate(req.body.initDataRaw, token, {
              expiresIn: SESSION_MAX_AGE * 2,
            });
          } catch (_err) {
            if (_err instanceof Error) {
              context.logger.error(_err.message, _err.name)
            } else {
              context.logger.error(_err as string)
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

          const account = await context.adapter.findOne<IAccount>({
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

          let user: IUser | null = null;

          if (account) {
            user = (await context.adapter.findOne({
              model: "user",
              where: [
                {
                  field: "id",
                  value: account.userId,
                  operator: "eq",
                },
              ],
            }));
          } else {
            const { id: telegramId, ...data } = initData.user;

            let user_data: Partial<IUser> = {
              ...data,
              telegramId: telegramId.toString(),
              role: UserRoleEnum.user,
              image: data.photo_url,
              name: templates.getTempName(initData.user),
              email: templates.getTempEmail(initData.user),
              emailVerified: false,
              updatedAt: new Date(),
              createdAt: new Date(),
            }

            if (hooks?.create?.before) {
              user_data = {
                ...user_data,
                ...hooks?.create?.before?.({
                  user: user_data,
                  initData,
                  adapter: context.adapter
                })
              }
            }
            user = await context.adapter.create<Partial<IUser>, IUser>({
              model: "user",
              data: user_data,
            });
            await context.adapter.create<Partial<IAccount>>({
              model: "account",
              data: {
                accountId: initData.user.id.toString(),
                providerId: provider_id,
                userId: user.id,
                updatedAt: new Date(),
                createdAt: new Date(),
              },
            });

            if (hooks?.create?.after) hooks?.create?.after?.({ user, initData, adapter: context.adapter })
          }
          if (!user) throw new Error("IUser not found")

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
              context.logger.error(err.message, err.name)
            } else {
              console.error(err)
            }
          }

          const session = await context.internalAdapter.createSession(user.id, {
            ...req,
            context
          }, false);
          await req.setSignedCookie(cookie.name, session.token, context.secret, cookie.attributes);
          return req.json({
            ok: true,
          });
        },
      ),
    },
  }) satisfies BetterAuthPlugin;

export type TelegramAuthPlugin = ReturnType<typeof telegramAuth>

