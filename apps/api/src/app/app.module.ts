import { Module } from '@nestjs/common';
import { RootModule } from './routes/root.module';
import { RedisModule } from "@lrp/redis"
import { S3Module } from "@lrp/s3"
import { TypeOrm } from "@lrp/db/typeorm"
import { AuthModule, IAccount, ISession, IUser, IVerification, typeormAdapter } from "@lrp/auth/server"
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from "@lrp/throttler"
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Logger, LoggerModule } from '@lrp/logger';

@Module({
  imports: [
    RootModule,
    RedisModule,
    S3Module,
    TypeOrm,
    ThrottlerModule,
    LoggerModule,
    AuthModule.forRootAsync({
      imports: [
        TypeOrmModule.forFeature([IUser, IAccount, IVerification, ISession]),
        ConfigModule,
      ],
      inject: [
        DataSource,
        ConfigService,
        Logger
      ],
      useFactory: async (db: DataSource, env: ConfigService, logger: Logger) => ({
        adapter: typeormAdapter(db),
        env,
        logger: {
          log: (level, message, ...args) => {
            switch (level) {
              case "error":
              case "warn":
                logger[level](message, ...args, "BetterAuth")
                break;
            }
          }
        },
      })
    }),
  ],
  providers: [
    ThrottlerModule.guard,
    AuthModule.guard
  ]
})
export class AppModule { }
