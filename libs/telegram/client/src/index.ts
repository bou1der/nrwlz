import { Module } from "@nestjs/common";
import { ConfigService, ConfigModule } from "@nestjs/config";
import { REDIS, Redis, RedisModule } from "@lrp/redis";
import { BOT } from "@lrp/telegram/bot";
import { Bot, InputFile } from "grammy";
import { TelegramClient } from "telegram";
import { RedisSession } from "./redis-session";
import Qrcode from "qrcode"


export interface TelegramClientOptions {
  apiId: number;
  apiHash: string;
  password: string;
  phone: string;
  admin_id: string;
}

export class TelegramAccount {
  telegram: TelegramClient;
  private session: RedisSession;
  config: TelegramClientOptions;
  tgBot: Bot;

  constructor(config: TelegramClientOptions, bot: Bot, redis: Redis) {
    this.tgBot = bot;
    this.config = config;
    this.session = new RedisSession(redis);
    this.telegram = new TelegramClient(
      this.session,
      config.apiId,
      config.apiHash,
      { connectionRetries: 5, useWSS: true },
    );
  }

  async connect(): Promise<void> {
    try {
      await this.session.load();
      await this.telegram?.connect();

      const isAuthorized = await this.telegram.isUserAuthorized();

      if (isAuthorized) {
        return;
      }

      let wasSent = false;
      await this.telegram.signInUserWithQrCode(
        { apiId: this.config.apiId, apiHash: this.config.apiHash },
        {
          password: async () => this.config.password,
          qrCode: async ({ token, expires }) => {
            const url = token.toString("base64url");
            const qrBuffer = await Qrcode.toBuffer(`tg://login?token=${url}`);
            if (!wasSent && !isNaN(expires)) {
              await this.tgBot.api.sendPhoto(this.config.admin_id, new InputFile(qrBuffer));
              wasSent = true;
            }
          },
          onError: async (err) => {
            console.error(err)
            await this.tgBot.api.sendMessage(
              this.config.admin_id,
              `❌ Ошибка авторизации: ${err.message}`,
            );
            throw err;
          },
        },
      );

      await this.session.save();
      await this.tgBot.api.sendMessage(
        this.config.admin_id,
        "✅ Клиент успешно авторизован",
      );
    } catch (error) {
      console.error(error)
      throw error;
    }
  }
}



export const TELEGRAM_CLIENT = "telegram_client"
@Module({
  imports: [
    ConfigModule,
    RedisModule,
  ],
  providers: [
    {
      provide: TELEGRAM_CLIENT,
      inject: [ConfigService, BOT, REDIS],
      useFactory: async (env: ConfigService, bot: Bot, redis: Redis) => {
        const client = new TelegramAccount({
          admin_id: env.getOrThrow('TELEGRAM_ADMIN_ID'),
          apiId: Number(env.getOrThrow('TELEGRAM_API_ID')),
          apiHash: env.getOrThrow('TELEGRAM_API_HASH'),
          password: env.getOrThrow('TELEGRAM_CLIENT_PASSWORD'),
          phone: env.getOrThrow('TELEGRAM_PHONE_NUMBER'),
        }, bot, redis);
        await client.connect()
        return client;
      }
    }
  ],
  exports: [TELEGRAM_CLIENT]
})
export class TelegramClientModule { }


