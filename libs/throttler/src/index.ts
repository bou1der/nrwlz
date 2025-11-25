import { Global, InjectionToken, Module, Provider } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerModule as RPSThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { RedisClient } from "@lrp/redis";
import Bottleneck from "bottleneck";

interface ThrottlerOptions extends Partial<Bottleneck.ConstructorOptions> {
  id?: string;
  provide: InjectionToken;
}


@Global()
@Module({
  imports: [
    ConfigModule,
    RPSThrottlerModule.forRootAsync({
      inject: [RedisClient],
      useFactory: async () => ({
        throttlers: [
          {
            ttl: 3_000,
            limit: 30,
          }
        ],
      })
    }),
  ],
})
export class ThrottlerModule {
  public static guard: Provider = {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  }

  public static forRootThrottler(options: ThrottlerOptions): Provider {
    return {
      provide: options.provide,
      inject: [RedisClient, ConfigService],
      useFactory: async (redis: RedisClient, env: ConfigService) => {
        const throttler = new Bottleneck({
          maxConcurrent: 5,
          minTime: 50,
          datastore: "ioredis",
          clientOptions: env.getOrThrow('REDIS_URL'),
          connection: new Bottleneck.IORedisConnection({
            client: redis.duplicate(),
          }),
          ...options,
        })
        return throttler
      }
    }
  }
}
