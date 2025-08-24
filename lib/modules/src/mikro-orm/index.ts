// // import { Module } from "@nestjs/common";
// import { MikroOrmModule } from "@mikro-orm/nestjs"
// import { PostgreSqlDriver } from "@mikro-orm/postgresql"
// import { ConfigModule, ConfigService } from "@nestjs/config";
//
//
// import { DynamicModule } from '@nestjs/common';
// import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
// import { join } from "path";
//
// export class MikroORM {
//   static forRoot(options?: MikroOrmModuleOptions): DynamicModule {
//     return {
//       module: MikroORM,
//       imports: [
//         MikroOrmModule.forRootAsync({
//           imports: [ConfigModule],
//           inject: [ConfigService],
//           useFactory: async (config: ConfigService) => ({
//             ...options,
//             migrations: {
//               path: join(__dirname, './migrations'),
//             },
//             driver: PostgreSqlDriver,
//             clientUrl: config.getOrThrow('DATABASE_URL'),
//             autoLoadEntities: true,
//             debug: process.env.NODE_ENV === 'development',
//             entities: [join(__dirname, './**/*.entity.js')],
//             entitiesTs: ['./**/*.entity.ts'],
//           })
//         }),
//       ],
//     };
//   }
// }
