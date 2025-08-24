import { IsNumber, IsOptional, IsString, IsPositive, Max, IsArray, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";

export class FiltersSchema {
  @ApiProperty({
    required: false,
    type: String,
    isArray: true,
    nullable: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? [value] : value))
  ids: string[] | null | undefined;

  @ApiProperty({
    required: false,
    type: String,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  search: string | null | undefined;

  @ApiProperty({
    default: 0,
    required: false,
    type: Number,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  offset = 0;

  @ApiProperty({
    default: 50,
    maximum: 100,
    required: false,
    type: Number,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Max(100)
  @Type(() => Number)
  limit = 50;
}
