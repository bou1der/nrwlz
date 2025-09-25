import { Controller, Get, Inject, NotFoundException, Param, Post, Query, Res, UploadedFile } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiNotFoundResponse, ApiOkResponse, ApiProduces, ApiTags } from "@nestjs/swagger";
import { FileCreateBody, FileCreateQuery } from "./file.dto";
import { FileProvider } from "./file.provider";
import { S3 } from "@lrp/s3"
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { HttpError } from "@lrp/shared";
import { Files } from "./file.entity";
import type { Response } from "express"

@ApiTags("Files")
@Controller({
  path: "/file",
})
export class FileController {
  constructor(
    private readonly s3: S3,
    @InjectDataSource() private readonly db: DataSource,
    @Inject() private readonly fileProvider: FileProvider,
  ) {
  }

  @ApiNotFoundResponse({
    description: "Image not found",
    type: HttpError,
  })
  @ApiOkResponse({
    description: "The file stream",
    type: "string",
  })
  @ApiProduces("application/octet-stream")
  @Get("/:id")
  async GET(@Param("id") id: string, @Res() res: Response): Promise<ReadableStream> {
    const file = await this.db.createQueryBuilder()
      .select()
      .from(Files, "files")
      .where("id = :id", { id })
      .getOne()
    if (!file) throw new NotFoundException("Файл не найден");
    const { Body } = await this.s3.getFile({
      Key: file.id,
    });
    if (!Body) throw new NotFoundException("Файл не найден");
    res.setHeader("Content-Type", file.contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(file.fileName)}"`);
    return Body.transformToWebStream();
  }

  // @hasRole([UserRoleEnum.admin])
  @ApiConsumes("multipart/form-data")
  @ApiOkResponse({
    type: String,
    description: "Return created image id",
  })
  @ApiBody({
    type: FileCreateBody,
  })
  @Post("/")
  async POST(
    @UploadedFile()
    file: Express.Multer.File,
    @Query() query: FileCreateQuery,
  ) {
    return await this.fileProvider.uploadFile(file, query);
  }
}
