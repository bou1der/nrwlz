import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { generateOpenApiSpecs } from './public/openapi';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpError } from '@nrwlz/shared';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 8000;

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

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

  await app.listen(port);
  Logger.log(`🚀 Application is running on port :${port}`);
}

bootstrap();
