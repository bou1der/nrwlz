import { Module } from '@nestjs/common';
import { RootModule } from './routes/root.module';
import { RedisModule } from "@lrp/redis"
import { S3Module } from "@lrp/s3"
import { TypeOrm } from "@lrp/db/typeorm"
import { AuthModule } from "@lrp/server"

@Module({
  imports: [
    RootModule,
    RedisModule,
    S3Module,
    TypeOrm,
    AuthModule,
  ],

})
export class AppModule { }
