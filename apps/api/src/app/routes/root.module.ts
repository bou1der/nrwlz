import { Module } from "@nestjs/common";
import { ExampleModule } from "./example/example.module";
import { FileModule } from "./file/file.module";


@Module({
  imports: [
    ExampleModule,
    FileModule
  ]
})
export class RootModule { }

