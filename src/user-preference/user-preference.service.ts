import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SavePreferenceDto } from './dto/save-preference.dto';

@Injectable()
export class UserPreferenceService {
  constructor(private prisma: PrismaService) {}

  // 🔥 SAVE (KEEP LAST 10)
  async save(dto: SavePreferenceDto) {
    if (!dto.userId) {
      throw new BadRequestException('userId is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const { userId, ...data } = dto;

    return this.prisma.$transaction(async (tx) => {
      const newPref = await tx.userPreference.create({
        data: {
          userId,
          city: data.city ?? null,
          locality: data.locality ?? null,
          search: data.search ?? null,
          pgFor: data.pgFor ?? null,
          sharingTypes: data.sharingTypes ?? null,
          preferredTenant: data.preferredTenant ?? null,
          availability: data.availability ?? null,
          parking: data.parking ?? null,
          foodIncluded: data.foodIncluded ?? null,
          rentMin: data.rentMin ?? null,
          rentMax: data.rentMax ?? null,
          amenities: data.amenities ?? null,
          nearby: data.nearby ?? null,
          restrictions: data.restrictions ?? null,
          premiumSort: data.premiumSort ?? null,
        },
      });

      const count = await tx.userPreference.count({ where: { userId } });

      if (count > 10) {
        const oldest = await tx.userPreference.findFirst({
          where: { userId },
          orderBy: { createdAt: 'asc' },
        });

        if (oldest) {
          await tx.userPreference.delete({ where: { id: oldest.id } });
        }
      }

      return newPref;
    });
  }

  // 🔥 GET LATEST PREF
  async get(userId: number) {
    return this.prisma.userPreference.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 🔥 RECOMMENDATION ENGINE
  async getRecommended(userId: number) {
    const pref = await this.get(userId);

    // ✅ NO PREF → fallback
    if (!pref) {
      return this.getFallback();
    }

    // ✅ FILTER FIRST (DB LEVEL)
    const filtered = await this.prisma.property.findMany({
      where: {
        isDeleted: false,
        isDraft: false,
        ...(pref.city && { city: pref.city }),
        ...(pref.pgFor && {
          preferredTenant: {
            array_contains: pref.pgFor,
          },
        }),
      },
      include: {
        likes: true,
        propertyViews: true,
      },
      take: 50,
    });

    // ✅ RELAX IF EMPTY
    const baseList =
      filtered.length > 0
        ? filtered
        : await this.prisma.property.findMany({
            where: {
              isDeleted: false,
              isDraft: false,
            },
            include: {
              likes: true,
              propertyViews: true,
            },
            take: 50,
          });

    // 🔥 SCORING
    const scored = baseList.map((p) => {
      let score = 0;

      // ⭐ CITY
      if (pref.city && p.city === pref.city) score += 5;

      // ⭐ LOCALITY
      if (pref.locality && p.locality === pref.locality) score += 4;

      // ⭐ TENANT
      if (
        pref.pgFor &&
        Array.isArray(p.preferredTenant) &&
        p.preferredTenant.includes(pref.pgFor)
      ) {
        score += 3;
      }

      // ⭐ FOOD
      if (
        pref.foodIncluded !== null &&
        pref.foodIncluded === p.foodIncluded
      ) {
        score += 2;
      }

      // ⭐ RENT (✅ FIXED SAFE JSON)
      let rent = 0;
      if (Array.isArray(p.roomType) && p.roomType.length > 0) {
        const room = p.roomType[0] as any;
        rent = typeof room?.rent === 'number' ? room.rent : 0;
      }

      if (
        pref.rentMin &&
        pref.rentMax &&
        rent >= pref.rentMin &&
        rent <= pref.rentMax
      ) {
        score += 3;
      }

      // ⭐ POPULARITY
      score += (p.likes?.length ?? 0) * 0.5;
      score += (p.propertyViews?.length ?? 0) * 0.2;

      // ⭐ RECENCY
      const daysOld =
        (Date.now() - new Date(p.createdAt).getTime()) /
        (1000 * 60 * 60 * 24);

      if (daysOld < 7) score += 2;

      return { ...p, score };
    });

    return scored.sort((a, b) => b.score - a.score).slice(0, 20);
  }

  // 🔥 FALLBACK
  private async getFallback() {
    return this.prisma.property.findMany({
      where: {
        isDeleted: false,
        isDraft: false,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }
}