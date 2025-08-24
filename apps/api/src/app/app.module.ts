import { Module } from '@nestjs/common';
import { RedisModule, S3Module, TypeOrm } from '@nrwlz/modules';
import { RootModule } from './routes/root.module';
import { AuthModule } from "@nrwlz/auth"

@Module({
  imports: [
    RootModule,
    RedisModule,
    S3Module,
    TypeOrm,
    AuthModule
    // MikroORM.forRoot(),
    // MikroOrmModule.forFeature([TestEntity])
  ],

})
export class AppModule { }
