import { Controller, Get, Inject, NotFoundException, Param, Post, Query, StreamableFile, UploadedFile } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiNotFoundResponse, ApiOkResponse, ApiProduces, ApiTags } from "@nestjs/swagger";
import { FileCreateBody, FileCreateQuery } from "./file.dto";
import { FileProvider } from "./file.provider";
import { S3 } from "@lrp/s3"
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { HttpError } from "@lrp/shared/types/error";
import { IFiles } from "./file.entity";
import { Readable } from "node:stream";
import { ReadableStream } from "node:stream/web";

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
  async GET(@Param("id") id: string) {
    const file = await this.db.createQueryBuilder()
      .select()
      .from(IFiles, "files")
      .where("id = :id", { id })
      .getOne()
    if (!file) throw new NotFoundException("Файл не найден");
    const { Body } = await this.s3.getFile({
      Key: file.id,
    });
    if (!Body) throw new NotFoundException("Файл не найден");

    return new StreamableFile(Readable.fromWeb(Body.transformToWebStream() as ReadableStream), {
      length: file.fileSize,
      type: file.contentType,
      disposition: `attachment;  filename="${encodeURIComponent(file.fileName)}"`,
    })
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
