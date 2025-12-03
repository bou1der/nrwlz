import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Logger, LoggerModule } from "@lrp/logger"

@Global()
@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService, Logger],
      useFactory: (env: ConfigService, logger: Logger) => {
        const ro_url = env.get("DATABASE_RO_URL")
        const url = env.getOrThrow("DATABASE_URL")
        return {
          replication: ro_url ? {
            master: {
              url
            },
            slaves: [
              {
                url: ro_url
              }
            ],
            defaultMode: "slave",
          } : undefined,
          type: "postgres",
          url: ro_url ? undefined : url,
          synchronize: false,
          autoLoadEntities: true,
          entities: [`${__dirname}/**/*.schema{.js, .ts}`, `${__dirname}/**/*.entity{.js, .ts}`],
          logger: {
            logQueryError: (error, query, params) => {
              logger.error(
                error instanceof Error ? error.message : error,
                `query: ${query} \n-- PARAMETERS: ${JSON.stringify(params)}`,
                TypeOrm.name
              )
            },
            logQuery: (query, parameters) => {
              logger.log(`query: ${query}\n-- PARAMETERS: ${JSON.stringify(parameters)}`, TypeOrm.name)
            },
            logQuerySlow: (time, query, parameters) => {
              logger.warn(`slow query: ${query} \n-- PARAMETERS: ${JSON.stringify(parameters)} \ntime: ${time}`, TypeOrm.name)
            },
            logMigration: (migration) => logger.log(`Migration: ${migration}`, TypeOrm.name),
            log: (query, parameters, time) => {
              logger.log(`query: ${query} \n-- PARAMETERS: ${JSON.stringify(parameters)} \ntime: ${time}`, TypeOrm.name)
            },
            logSchemaBuild: (schema) => logger.log(`schema: ${schema}`, TypeOrm.name),
          },
          logging: true,
        }
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrm { }
