import { Module } from "@nestjs/common";
import { ExampleModule } from "./example/example.module";
// import { FileModule } from "./file/file.module";
// import { TelegramModule } from "./telegram/telegram.module";


@Module({
  imports: [
    ExampleModule,
    // FileModule,
    // TelegramModule
  ]
})
export class RootModule { }

