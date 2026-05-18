import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import 'reflect-metadata';
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const port = process.env.PORT || 5000;

  // 🔥 IMPORTANT CHANGE HERE
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
}

bootstrap();