import { RedisModule } from "@lrp/redis";
import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Context as GrammyContext } from "grammy";
import { DataSource } from "typeorm";
import { GrammyBot } from "@lrp/telegram/bot"


export interface Context extends GrammyContext {
  utils: {
    db: DataSource;
    env: ConfigService;
  }
}


@Global()
@Module({
  imports: [
    ConfigModule,
    GrammyBot.forRootAsync({
      imports: [ConfigModule, RedisModule],
      inject: [ConfigService, DataSource],
      useFactory: async (env: ConfigService, db: DataSource) => ({
        token: env.getOrThrow('TELEGRAM_BOT_TOKEN'),
        webhookURL: `${env.getOrThrow("API_URL")}/telegram`,
        modules: [
        ],
        utils: {
          db,
          env,
        } satisfies Context["utils"]
      })
    }),
    // TelegramClientModule
  ],
})
export class TelegramModule { }

