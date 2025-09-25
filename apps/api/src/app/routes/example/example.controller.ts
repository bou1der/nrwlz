import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FiltersSchema } from "@lrp/shared";

@ApiTags("example")
@Controller("test")
export class ExampleController {
  constructor(
    // private readonly db: DataSource
  ) { }

  @Get("/")
  async all(@Query() query: FiltersSchema) {
    // this.db.createQueryBuilder()
    //   .select()
    return "hello example"
  }
}
