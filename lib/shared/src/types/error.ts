import { InternalServerErrorException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class HttpError extends InternalServerErrorException {
  @ApiProperty({
    type: String,
    description: "Error name",
  })
  declare name: string;
  @ApiProperty({
    type: String,
    description: "Error message",
  })
  declare message: string;
  @ApiProperty({
    type: String,
    description: "Error cause",
  })
  declare cause: unknown;
}
