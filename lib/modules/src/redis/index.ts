import { createClient } from "redis";
import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

export const REDIS = "s3-adapter";
export type Redis = ReturnType<typeof createClient>;

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS,
      inject: [ConfigService],
      useFactory: async (env: ConfigService) => {
        const redis = createClient({ url: env.getOrThrow("REDIS_URL") });
        return await redis.connect();
      },
    },
  ],
  exports: [REDIS],
})
export class RedisModule { }
