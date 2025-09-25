import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (env: ConfigService) => ({
        type: "postgres",
        url: env.getOrThrow("DATABASE_URL"),
        synchronize: true,
        entities: [`${__dirname}/**/*.schema{.js, .ts}`, `${__dirname}/**/*.entity{.js, .ts}`],
        autoLoadEntities: true,
        // logger: new Log(),
        logging: true,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrm { }
