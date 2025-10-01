import { createClient } from "redis";
import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

export type Redis = ReturnType<typeof createClient>

export const REDIS = "redis"

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const client = createClient({ url: config.getOrThrow('REDIS_URL') });
        await client.connect()
        return client;
      }
    },
  ],
  exports: [REDIS],
})
export class RedisModule { }
