import { Global, Module } from "@nestjs/common";
import { FileController } from "./file.controller";
import { FileProvider } from "./file.provider";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Files } from "./file.entity";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Files])],
  controllers: [FileController],
  providers: [FileProvider],
  exports: [FileProvider],
})
export class FileModule { }
