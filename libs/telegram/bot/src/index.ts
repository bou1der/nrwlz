import { Bot, Context, Middleware, webhookCallback } from "grammy";
import { DynamicModule, ModuleMetadata, NestModule, MiddlewareConsumer, RequestMethod, Inject } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import bodyParser from "body-parser";

type MaybePromise<T> = T | Promise<T>;

export interface TelegramBotOptions extends Pick<ModuleMetadata, "imports"> {
  inject?: any[];
  provide?: string;
  useFactory: (...args: any[]) => MaybePromise<{
    token: string;
    webhookURL?: string;
    modules?: Middleware<Context | any>[]
    utils?: {}
  }>;
}

export const BOT = "telegram_bot"

export class GrammyBot {
  static forRootAsync(options: TelegramBotOptions): DynamicModule {
    return {
      global: true,
      module: GrammyBot,
      imports: Array.isArray(options.imports) ? [...options.imports, WebhookModule] : [WebhookModule],
      providers: [
        {
          inject: options.inject,
          provide: BOT,
          useFactory: async (...args: any[]) => {
            const config = await options.useFactory(...args)
            const bot = new Bot(config.token)
            await bot.init();
            if (config.webhookURL) {
              const del = await bot.api.deleteWebhook();
              const set = await bot.api.setWebhook(
                config.webhookURL,
                {
                  allowed_updates: [
                    "channel_post",
                    "chat_member",
                    "message",
                    "inline_query",
                    "callback_query",
                    "shipping_query",
                    "pre_checkout_query",
                    "shipping_query",
                  ],
                },
              );
              const get = await bot.api.getWebhookInfo();
              console.log({ del, set, get });
            } else {
              await bot.api.deleteWebhook();
            }
            bot.use(async (ctx, next) => {
              (ctx as Context & { utils: any }).utils = config.utils || {}
              await next();
            })
            config.modules?.map(m => bot.use(m))
            bot.catch(err => {
              console.error(err)
            })
            return bot;
          }
        }
      ],
      exports: [BOT]
    }
  }
}

export class WebhookModule implements NestModule {
  constructor(
    private readonly adapter: HttpAdapterHost,
    @Inject(BOT) private readonly bot: Bot
  ) { }

  async configure(consumer: MiddlewareConsumer) {
    const webhook = await this.bot.api.getWebhookInfo()
    if (webhook.url) {
      const app = this.adapter.httpAdapter.getInstance<ExpressAdapter>()
      app.use(bodyParser.json())
      app.use(bodyParser.urlencoded({ extended: true }));
      consumer
        .apply(webhookCallback(this.bot, "express"))
        .forRoutes({ path: new URL(webhook.url).pathname, method: RequestMethod.ALL })
    }
  }
}



