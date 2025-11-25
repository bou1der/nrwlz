import { Global, Module } from "@nestjs/common";
import { FileController } from "./file.controller";
import { FileProvider } from "./file.provider";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IFiles } from "./file.entity";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([IFiles])],
  controllers: [FileController],
  providers: [FileProvider],
  exports: [FileProvider],
})
export class FileModule { }
