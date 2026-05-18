// src/main.ts

import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
import * as path from 'path';

import { AppModule } from './app.module';

// Load .env file from project root
dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

async function bootstrap() {
  const app =
      await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Static uploads folder
  app.useStaticAssets(
    path.join(__dirname, '..', 'uploads'),
    {
      prefix: '/uploads/',
    },
  );

  const port = Number(process.env.PORT) || 5000;

  // Listen on all network interfaces
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server running on the http://localhost:${port}`);
  console.log(`🌐 Network URL: http://0.0.0.0:${port}`);
}

bootstrap();