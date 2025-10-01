import { Module } from "@nestjs/common";
import { FileModule } from "./file/file.module";
import { TelegramModule } from "./telegram/telegram.module";

@Module({
  imports: [
    FileModule,
    TelegramModule,
  ],
})
export class RootModule { }

