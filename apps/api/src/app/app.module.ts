import { Module } from '@nestjs/common';
import { RootModule } from './routes/root.module';
import { RedisModule } from "@lrp/redis"
import { S3Module } from "@lrp/s3"
import { TypeOrm } from "@lrp/db/typeorm"
import { AuthModule } from "@lrp/auth/server"
// import { ScheduleModule } from "@nestjs/schedule"
// import { UploaderTransportModule } from "@lrp/uploader/transport"

@Module({
  imports: [
    RootModule,
    RedisModule,
    S3Module,
    TypeOrm,
    AuthModule,
    // ScheduleModule.forRoot(),
    // UploaderTransportModule
  ],
})
export class AppModule { }
