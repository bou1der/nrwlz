import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { FileCreateQuery } from "./file.dto";
import mime from "mime-types";
import sharp from "sharp";
import { getPlaiceholder } from "plaiceholder";
import { uuidv7 } from "uuidv7";
import { S3 } from "@lrp/s3";
import { DataSource } from "typeorm";
import { Files } from "./file.entity";
import { InjectDataSource } from "@nestjs/typeorm";

@Injectable()
export class FileProvider {
  constructor(
    @InjectDataSource() private readonly db: DataSource,
    @Inject() readonly s3: S3,
  ) { }

  async uploadFile(file: Express.Multer.File, query: FileCreateQuery) {
    let buf: Buffer<ArrayBuffer | ArrayBufferLike> = file.buffer;

    if (query.isImage) {
      buf = await sharp(buf).webp().toBuffer();
    }

    const id = uuidv7();
    const mime_type = mime.extension(file.filename) || "application/octet-stream";

    await this.db.transaction(async trx => {
      const res = await this.s3.uploadFile({
        Key: id,
      });
      if (res.$metadata.httpStatusCode !== 200) throw new InternalServerErrorException("Ошибка загрузки фотографии");
      await trx.createQueryBuilder().insert()
        .into(Files)
        .values({
          id,
          contentType: mime_type,
          fileName: file.filename,
          fileSize: file.size,
          placeholder: query.isImage ? (await getPlaiceholder(buf)).base64 : null,
        })
        .execute()
    });

    return id;
  }
}
