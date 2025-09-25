import { Bot, Context, Middleware, webhookCallback } from "grammy";
import { DynamicModule, Module, ModuleMetadata, Injectable, Global, NestModule, MiddlewareConsumer, RequestMethod, Inject } from "@nestjs/common";
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
    utils?: Object
  }>;
}

@Injectable()
export class GBot extends Bot {
  constructor(config: Awaited<ReturnType<TelegramBotOptions["useFactory"]>>) {
    super(config.token)
  }
}

@Global()
@Module({
})
export class GrammyBot implements NestModule {
  constructor(
    private readonly adapter: HttpAdapterHost,
    @Inject() private readonly bot: GBot
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

  static forRootAsync(options: TelegramBotOptions): DynamicModule {
    return {
      module: GrammyBot,
      imports: options.imports,
      providers: [
        {
          inject: options.inject,
          provide: options.provide || GBot,
          useFactory: async (...args: any[]) => {
            const config = await options.useFactory(...args)
            const bot = new GBot(config)
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
            return bot;
          }
        }
      ],
      exports: [options.provide || GBot]
    }
  }
}



