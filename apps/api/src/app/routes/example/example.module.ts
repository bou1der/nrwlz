import { Module } from "@nestjs/common";
import { ExampleController } from "./example.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Example } from "./example.entity";


@Module({
  imports: [TypeOrmModule.forFeature([Example])],
  controllers: [ExampleController],
})
export class ExampleModule { }
