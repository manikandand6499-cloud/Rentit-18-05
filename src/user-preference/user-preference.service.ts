import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SavePreferenceDto } from './dto/save-preference.dto';

@Injectable()
export class UserPreferenceService {
  constructor(private prisma: PrismaService) {}

  // 🔥 SAVE / REPLACE (NO MERGE, ALWAYS FRESH)
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
    // ✅ 1. CREATE NEW ENTRY
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

    // ✅ 2. COUNT TOTAL
    const count = await tx.userPreference.count({
      where: { userId },
    });

    // ✅ 3. DELETE ONLY OLDEST IF > 10
    if (count > 10) {
      const oldest = await tx.userPreference.findFirst({
        where: { userId },
        orderBy: { createdAt: 'asc' }, // 🔥 oldest first
      });

      if (oldest) {
        await tx.userPreference.delete({
          where: { id: oldest.id },
        });
      }
    }

    return newPref;
  });
}

  // 🔥 GET USER PREF
async get(userId: number) {
  return this.prisma.userPreference.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' }, // 🔥 latest
  });
}

  // 🔥 RECOMMENDED PROPERTIES (CLEAN + SAFE)
async getRecommended(userId: number) {
  const pref = await this.get(userId);

  if (!pref) {
    // fallback → show popular
    return this.prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  const properties = await this.prisma.property.findMany({
    where: {
      isDeleted: false,
      isDraft: false,
    },
    include: {
      likes: true,
      propertyViews: true,
    },
  });

  // 🔥 SCORING SYSTEM
  const scored = properties.map((p) => {
    let score = 0;

    // ✅ CITY MATCH (strong)
    if (pref.city && p.city === pref.city) score += 5;

    // ✅ TENANT MATCH
    if (
      pref.pgFor &&
      Array.isArray(p.preferredTenant) &&
      p.preferredTenant.includes(pref.pgFor)
    ) {
      score += 3;
    }

    // ✅ FOOD MATCH
    if (pref.foodIncluded === p.foodIncluded) score += 2;

    // ✅ RENT MATCH
    const rent =
      Array.isArray(p.roomType) && p.roomType.length > 0
        ? p.roomType[0]?.rent ?? 0
        : 0;

    if (
      pref.rentMin &&
      pref.rentMax &&
      rent >= pref.rentMin &&
      rent <= pref.rentMax
    ) {
      score += 3;
    }

    // ✅ POPULARITY
    score += (p.likes?.length ?? 0) * 0.5;
    score += (p.propertyViews?.length ?? 0) * 0.2;

    return { ...p, score };
  });

  // 🔥 SORT BY SCORE
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
}
  // 🔥 SORT HANDLER
  private getSort(sort?: string) {
    if (sort === 'new') return { createdAt: 'desc' as const };
    if (sort === 'recent') return { updatedAt: 'desc' as const };
    return undefined;
  }
}