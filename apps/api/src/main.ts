import { Logger } from "@lrp/logger"
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { generateOpenApiSpecs } from './public/openapi';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpError } from "@lrp/shared/types/error";
import cors from 'cors';
import { ConfigService } from '@nestjs/config';
import cookieParser from "cookie-parser";


async function bootstrap() {
  const env = new ConfigService()
  const port = process.env.PORT || 8000;

  const logger = new Logger(new ConfigService())
  try {
    const app = await NestFactory.create(AppModule, {
      logger,
    });


    app.use(cors({
      origin: JSON.parse(env.get("TRUSTED_ORIGINS") || "[]"),
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Content-Disposition",
        "Content-Length",
        "Authorization",
        "crypto-pay-api-signature",
        "X-Init-Data"
      ],
      credentials: true
    }))


    app.use(cookieParser())
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

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
    logger.log(`🚀 Application is running on port :${port}`);

  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.message, e.stack, e.name)
    } else {
      logger.error(e as string)
    }

  }

}

bootstrap();
