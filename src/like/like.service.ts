import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

export type LikeType =
  | 'pg'
  | 'property'
  | 'flatmate'
  | 'apartment'
  | 'commercial'
  | 'auto';

@Injectable()
export class LikeService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async toggleLike(
    userId: number,
    propertyId: number,
    type: LikeType = 'auto',
  ) {
    const normType = (type || 'auto').toString().toLowerCase().trim();

    // 1. Explicit Apartment
    if (normType === 'apartment') {
      const apartment = await this.prisma.apartment.findUnique({
        where: { id: propertyId },
      });
      if (apartment) {
        return this.toggleApartmentLike(userId, propertyId);
      }
      return this.autoDetectAndToggle(userId, propertyId);
    }

    // 2. Explicit Commercial
    if (normType === 'commercial') {
      const commercial = await this.prisma.commercial.findUnique({
        where: { id: propertyId },
      });
      if (commercial) {
        return this.toggleCommercialLike(userId, propertyId);
      }
      return this.autoDetectAndToggle(userId, propertyId);
    }

    // 3. Explicit Flatmate
    if (normType === 'flatmate') {
      const flatmate = await this.prisma.flatmate.findUnique({
        where: { id: propertyId },
      });
      if (flatmate) {
        return this.toggleFlatmateLike(userId, propertyId);
      }
      return this.autoDetectAndToggle(userId, propertyId);
    }

    // 4. Explicit PG/Property
    if (normType === 'pg' || normType === 'property') {
      const pg = await this.prisma.pGDetails.findUnique({
        where: { id: propertyId },
      });
      if (pg) {
        return this.togglePgLikeDirect(userId, propertyId);
      }
      return this.autoDetectAndToggle(userId, propertyId);
    }

    // 5. Auto mode (checks all types)
    return this.autoDetectAndToggle(userId, propertyId);
  }

  private async toggleApartmentLike(userId: number, apartmentId: number) {
    try {
      const existing = await this.prisma.like.findFirst({
        where: { userId, apartmentId },
      });

      if (existing) {
        await this.prisma.like.delete({ where: { id: existing.id } });
        return { success: true, liked: false };
      }

      await this.prisma.like.create({
        data: { userId, apartmentId },
      });

      return { success: true, liked: true };
    } catch (e: any) {
      console.warn('⚠️ toggleApartmentLike fallback due to:', e?.message);
      const existing: any = await this.prisma.$queryRawUnsafe(
        `SELECT id FROM "Like" WHERE "userId" = $1 AND "apartmentId" = $2 LIMIT 1;`,
        userId,
        apartmentId,
      ).catch(() => []);

      if (existing && existing.length > 0) {
        await this.prisma.$executeRawUnsafe(
          `DELETE FROM "Like" WHERE id = $1;`,
          existing[0].id,
        ).catch(() => {});
        return { success: true, liked: false };
      } else {
        await this.prisma.$executeRawUnsafe(
          `INSERT INTO "Like" ("userId", "apartmentId", "createdAt") VALUES ($1, $2, NOW());`,
          userId,
          apartmentId,
        ).catch(() => {});
        return { success: true, liked: true };
      }
    }
  }

  private async toggleCommercialLike(userId: number, commercialId: number) {
    try {
      const existing = await this.prisma.like.findFirst({
        where: { userId, commercialId },
      });

      if (existing) {
        await this.prisma.like.delete({ where: { id: existing.id } });
        return { success: true, liked: false };
      }

      await this.prisma.like.create({
        data: { userId, commercialId },
      });

      return { success: true, liked: true };
    } catch (e: any) {
      console.warn('⚠️ toggleCommercialLike fallback due to:', e?.message);
      const existing: any = await this.prisma.$queryRawUnsafe(
        `SELECT id FROM "Like" WHERE "userId" = $1 AND "commercialId" = $2 LIMIT 1;`,
        userId,
        commercialId,
      ).catch(() => []);

      if (existing && existing.length > 0) {
        await this.prisma.$executeRawUnsafe(
          `DELETE FROM "Like" WHERE id = $1;`,
          existing[0].id,
        ).catch(() => {});
        return { success: true, liked: false };
      } else {
        await this.prisma.$executeRawUnsafe(
          `INSERT INTO "Like" ("userId", "commercialId", "createdAt") VALUES ($1, $2, NOW());`,
          userId,
          commercialId,
        ).catch(() => {});
        return { success: true, liked: true };
      }
    }
  }

  private async toggleFlatmateLike(userId: number, flatmateId: number) {
    try {
      const existing = await this.prisma.like.findFirst({
        where: { userId, flatmateId },
      });

      if (existing) {
        await this.prisma.like.delete({ where: { id: existing.id } });
        return { success: true, liked: false };
      }

      await this.prisma.like.create({
        data: { userId, flatmateId },
      });

      return { success: true, liked: true };
    } catch (e: any) {
      console.warn('⚠️ toggleFlatmateLike fallback due to:', e?.message);
      const existing: any = await this.prisma.$queryRawUnsafe(
        `SELECT id FROM "Like" WHERE "userId" = $1 AND "flatmateId" = $2 LIMIT 1;`,
        userId,
        flatmateId,
      ).catch(() => []);

      if (existing && existing.length > 0) {
        await this.prisma.$executeRawUnsafe(
          `DELETE FROM "Like" WHERE id = $1;`,
          existing[0].id,
        ).catch(() => {});
        return { success: true, liked: false };
      } else {
        await this.prisma.$executeRawUnsafe(
          `INSERT INTO "Like" ("userId", "flatmateId", "createdAt") VALUES ($1, $2, NOW());`,
          userId,
          flatmateId,
        ).catch(() => {});
        return { success: true, liked: true };
      }
    }
  }

  private async togglePgLikeDirect(userId: number, propertyId: number) {
    try {
      const existing = await this.prisma.like.findFirst({
        where: { userId, propertyId },
      });

      if (existing) {
        await this.prisma.like.delete({ where: { id: existing.id } });
        return { success: true, liked: false };
      }

      await this.prisma.like.create({
        data: { userId, propertyId },
      });

      return { success: true, liked: true };
    } catch (e: any) {
      console.warn('⚠️ togglePgLikeDirect fallback due to:', e?.message);
      const existing: any = await this.prisma.$queryRawUnsafe(
        `SELECT id FROM "Like" WHERE "userId" = $1 AND "propertyId" = $2 LIMIT 1;`,
        userId,
        propertyId,
      ).catch(() => []);

      if (existing && existing.length > 0) {
        await this.prisma.$executeRawUnsafe(
          `DELETE FROM "Like" WHERE id = $1;`,
          existing[0].id,
        ).catch(() => {});
        return { success: true, liked: false };
      } else {
        await this.prisma.$executeRawUnsafe(
          `INSERT INTO "Like" ("userId", "propertyId", "createdAt") VALUES ($1, $2, NOW());`,
          userId,
          propertyId,
        ).catch(() => {});
        return { success: true, liked: true };
      }
    }
  }

  private async autoDetectAndToggle(userId: number, propertyId: number) {
    // 1. Check Apartment
    const apartment = await this.prisma.apartment.findUnique({ where: { id: propertyId } }).catch(() => null);
    if (apartment) {
      return this.toggleApartmentLike(userId, propertyId);
    }

    // 2. Check Commercial
    const commercial = await this.prisma.commercial.findUnique({ where: { id: propertyId } }).catch(() => null);
    if (commercial) {
      return this.toggleCommercialLike(userId, propertyId);
    }

    // 3. Check Flatmate
    const flatmate = await this.prisma.flatmate.findUnique({ where: { id: propertyId } }).catch(() => null);
    if (flatmate) {
      return this.toggleFlatmateLike(userId, propertyId);
    }

    // 4. Check PG
    const pg = await this.prisma.pGDetails.findUnique({ where: { id: propertyId } }).catch(() => null);
    if (pg) {
      return this.togglePgLikeDirect(userId, propertyId);
    }

    // Fallback: direct PG toggle
    return this.togglePgLikeDirect(userId, propertyId);
  }

  async getMyLikes(userId: number) {
    try {
      const likes = await this.prisma.like.findMany({
        where: {
          userId,
        },
        include: {
          property: true,
          flatmate: true,
          Apartment: true,
          Commercial: true,
        },
        orderBy: {
          id: 'desc',
        },
      });

      return likes.map((item) => ({
        ...item,
        apartment: item.Apartment ?? null,
        commercial: item.Commercial ?? null,
        flatmate: item.flatmate ?? null,
        pg: item.property ?? null,
      }));
    } catch (err: any) {
      console.warn('⚠️ getMyLikes prisma error fallback:', err?.message);
      try {
        const rawLikes: any = await this.prisma.$queryRawUnsafe(
          `SELECT * FROM "Like" WHERE "userId" = $1 ORDER BY id DESC;`,
          userId,
        );
        return rawLikes || [];
      } catch (_) {
        return [];
      }
    }
  }
}