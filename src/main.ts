import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpMetaInterceptor } from './interceptors/http-meta-interceptor.service.interceptor';
import { globalPrefix, swaggerInfo, version } from './informations';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });
  const configService = app.get(ConfigService);
  const logSettings = configService.get<string>('APP_LOGGER');
  const parseArray: string[] = (logSettings ?? '["error"]').split(',');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  app.useLogger(parseArray as any);

  const port = configService.get<number>('PORT') || 3000;

  app.useGlobalInterceptors(new HttpMetaInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle(swaggerInfo.title)
    .setDescription(swaggerInfo.description)
    .setContact(
      swaggerInfo.author.name,
      swaggerInfo.author.url,
      swaggerInfo.author.email,
    )
    .setVersion(version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(swaggerInfo.docPath, app, document);

  await app.listen(port);

  Logger.log(`NEST application successfully started`, bootstrap.name);
  Logger.debug(
    `Server in version: ${swaggerInfo.docPath} ist jetzt erreichbar unter http://localhost:${port}/${globalPrefix}`,
    bootstrap.name,
  );
  Logger.debug(
    `Swagger ist jetzt erreichbar unter http://localhost:${port}/${swaggerInfo.docPath}`,
    bootstrap.name,
  );
}
bootstrap().catch((err) => console.error(err));
