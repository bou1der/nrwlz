import {
  CompleteMultipartUploadCommand,
  CompleteMultipartUploadCommandInput,
  CreateMultipartUploadCommand,
  CreateMultipartUploadCommandInput,
  GetObjectCommand,
  GetObjectCommandInput,
  ListPartsCommand,
  ListPartsCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
  S3ClientConfig,
  UploadPartCommand,
  UploadPartCommandInput,
} from "@aws-sdk/client-s3";
import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config"
import { uuidv7 } from "uuidv7";

export class S3 extends S3Client {
  private readonly Bucket: string;

  constructor(conf: S3ClientConfig & { Bucket: string }) {
    super(conf);
    this.Bucket = conf.Bucket;
  }

  async getFile(options: Omit<GetObjectCommandInput, "Bucket">) {
    return await this.send(
      new GetObjectCommand({
        Bucket: this.Bucket,
        ...options,
      }),
    );
  }
  async uploadFile(options: Omit<PutObjectCommandInput, "Bucket">) {
    return await this.send(
      new PutObjectCommand({
        Bucket: this.Bucket,
        ...options,
      }),
    );
  }

  async createUploadMultipart(options: Partial<CreateMultipartUploadCommandInput>) {
    return await this.send(
      new CreateMultipartUploadCommand({
        Bucket: this.Bucket,
        Key: options.Key || uuidv7(),
        ...options,
      }),
    );
  }

  async completeUploadMultipart(options: Omit<CompleteMultipartUploadCommandInput, "Bucket">) {
    const { Parts } = await this.listParts(options);
    return await this.send(
      new CompleteMultipartUploadCommand({
        ...options,
        Bucket: this.Bucket,
        Key: options.Key || uuidv7(),
        MultipartUpload: { Parts },
      }),
    );
  }

  async uploadPart(options: Omit<UploadPartCommandInput, "Bucket">) {
    return await this.send(
      new UploadPartCommand({
        ...options,
        Bucket: this.Bucket,
      }),
    );
  }
  async listParts(options: Omit<ListPartsCommandInput, "Bucket">) {
    return await this.send(
      new ListPartsCommand({
        ...options,
        Bucket: this.Bucket,
      }),
    );
  }
}

@Global()
@Module({
  imports: [
    ConfigModule
  ],
  providers: [
    {
      provide: S3,
      inject: [ConfigService],
      useFactory: async (env: ConfigService) => {
        return new S3({
          region: env.getOrThrow("S3_REGION"),
          endpoint: env.getOrThrow("S3_ENDPOINT"),
          credentials: {
            secretAccessKey: env.getOrThrow("S3_SECRET_KEY"),
            accessKeyId: env.getOrThrow("S3_ACCESS_KEY"),
          },
          Bucket: env.getOrThrow("S3_BUCKET"),
        });
      },
    },
  ],
  exports: [S3],
})
export class S3Module { }

