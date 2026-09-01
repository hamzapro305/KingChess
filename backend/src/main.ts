import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);

  const serverPort = configService.get<number>('PORT', 4000);
  const serverHost = configService.get<string>('HOST', '127.0.0.1');

  await app.listen(serverPort, serverHost);
}

void bootstrap();
