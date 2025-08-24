import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

export class FileCreateQuery {
  @ApiProperty({
    type: Boolean,
    description: "With this parameter will be generated placeholder",
    nullable: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isImage = false;
}

export class FileCreateBody {
  @ApiProperty({
    type: File,
    format: "binary",
  })
  file: File;
}
