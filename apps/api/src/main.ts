import { Logger, Module, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { generateOpenApiSpecs } from './public/openapi';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpError } from "@lrp/shared/types/error";
import cors from 'cors';
import { ConfigModule, ConfigService } from '@nestjs/config';
import cookieParser from "cookie-parser";

@Module({
  imports: [ConfigModule],
})
class Bootstrap { }

async function bootstrap() {
  const ctx = await NestFactory.create(Bootstrap);
  const env = ctx.get(ConfigService)
  await ctx.close()

  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 8000;


  app.use(cors({
    origin: "https://mini.booulder.xyz",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  }))
  app.use(cookieParser())
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  if (env.get("NODE_ENV") !== "production") {
    const swagger = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .addGlobalResponse({
          type: HttpError,
          status: 500,
          description: "Internal server error",
        })
        .addGlobalResponse({
          type: HttpError,
          status: 400,
          description: "Invalid request",
        })
        .setTitle("Nestjs 🐢 api")
        .setDescription("Example api")
        .setVersion("1.0")
        .build(),
    );
    SwaggerModule.setup("/openapi", app, swagger, {
      jsonDocumentUrl: "openapi/json",
      yamlDocumentUrl: "openapi/yaml",
    });
    void generateOpenApiSpecs([{ document: swagger }]);
  }

  await app.listen(port);
  Logger.log(`🚀 Application is running on port :${port}`);
}

bootstrap();
