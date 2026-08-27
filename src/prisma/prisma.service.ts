import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit {
  property: any;

  async onModuleInit() {
    await this.$connect();
    try {
      await this.$executeRawUnsafe(
        `ALTER TABLE "Visit" DROP CONSTRAINT IF EXISTS "Visit_propertyId_fkey";`
      );
    } catch (_) {}
    try {
      await this.$executeRawUnsafe(`
        ALTER TABLE "Like" ADD COLUMN IF NOT EXISTS "apartmentId" INTEGER;
        ALTER TABLE "Like" ADD COLUMN IF NOT EXISTS "commercialId" INTEGER;
        ALTER TABLE "Like" ADD COLUMN IF NOT EXISTS "flatmateId" INTEGER;
        ALTER TABLE "Like" DROP CONSTRAINT IF EXISTS "Like_propertyId_fkey";
        ALTER TABLE "Like" DROP CONSTRAINT IF EXISTS "Like_apartmentId_fkey";
        ALTER TABLE "Like" DROP CONSTRAINT IF EXISTS "Like_commercialId_fkey";
        ALTER TABLE "Like" DROP CONSTRAINT IF EXISTS "Like_flatmateId_fkey";
      `);
    } catch (_) {}
  }

  async enableShutdownHooks(
    app: INestApplication,
  ) {
    process.on(
      'beforeExit',
      async () => {
        await app.close();
      },
    );
  }
}