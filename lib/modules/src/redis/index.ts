import { createClient } from "redis";
import { Global, Injectable, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Injectable()
export class Redis implements OnModuleInit {
  public readonly api: ReturnType<typeof createClient>;
  constructor(private configService: ConfigService) {
    const url = this.configService.getOrThrow('REDIS_URL');
    this.api = createClient({ url });
  }
  async onModuleInit() {
    await this.api.connect()
  }
}

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: Redis,
      useClass: Redis,
    },
  ],
  exports: [Redis],
})
export class RedisModule { }
