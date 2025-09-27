import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("example")
@Controller("test")
export class ExampleController {
  constructor(
    // private readonly db: DataSource
  ) { }

  @Get("/")
  async all() {
    return "hello example"
  }
}
