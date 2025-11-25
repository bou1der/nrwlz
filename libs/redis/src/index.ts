import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Redis } from "ioredis";

export class RedisClient extends Redis {
  constructor(uri: string) {
    super(uri)
  }
}
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: RedisClient,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const client = new RedisClient(config.getOrThrow('REDIS_URL'));
        return client;
      }
    },
  ],
  exports: [RedisClient],
})
export class RedisModule { }
