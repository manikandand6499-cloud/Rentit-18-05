import * as crypto from 'crypto';

// 🔥 FIX: required for @nestjs/schedule on Node 18
(global as any).crypto = crypto;

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  /// ✅ CORS (production-safe)
  app.enableCors({
    origin: true,
    credentials: true,
  });

  /// ✅ GLOBAL VALIDATION
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  /// ✅ STATIC FILES
  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  /// ✅ PORT
  const port = process.env.PORT || 5000;
  await app.listen(port);

  console.log(`🚀 Server running on port ${port}`);
}

bootstrap();