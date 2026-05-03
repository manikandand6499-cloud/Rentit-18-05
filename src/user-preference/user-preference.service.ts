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

    // 🔥 1. CREATE NEW ENTRY
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

    // 🔥 2. GET ALL USER PREFS (latest first)
    const all = await tx.userPreference.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // 🔥 3. DELETE OLD IF > 10
    if (all.length > 10) {
      const toDelete = all.slice(10); // keep latest 10

      await tx.userPreference.deleteMany({
        where: {
          id: {
            in: toDelete.map(p => p.id),
          },
        },
      });
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

  // 🔥 STEP 1: BASE QUERY (LIGHT FILTER ONLY)
  const baseList = await this.prisma.property.findMany({
    where: {
      isDeleted: false,
      isDraft: false,

      ...(pref?.city && { city: pref.city }),

      ...(pref?.pgFor && {
        preferredTenant: {
          array_contains: pref.pgFor,
        },
      }),
    },
    take: 50, // 🔥 fetch more for scoring
  });

  // 🔥 STEP 2: FALLBACK IF EMPTY
  if (!baseList.length) {
    return this.prisma.property.findMany({
      where: {
        isDeleted: false,
        isDraft: false,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  // 🔥 STEP 3: SCORING SYSTEM
  const scored = baseList.map((p) => {
    let score = 0;

    // ✅ CITY MATCH
    if (pref?.city && p.city === pref.city) score += 5;

    // ✅ LOCALITY MATCH
    if (pref?.locality && p.locality === pref.locality) score += 4;

    // ✅ PG FOR
    if (
      pref?.pgFor &&
      Array.isArray(p.preferredTenant) &&
      p.preferredTenant.includes(pref.pgFor)
    ) {
      score += 3;
    }

    // ✅ FOOD
    if (
      pref?.foodIncluded !== null &&
      pref?.foodIncluded === p.foodIncluded
    ) {
      score += 2;
    }

    // ✅ PARKING
    if (pref?.parking === 'Yes' && p.parking) score += 1;

    // 🔥 RENT (FIXED HERE)
    let rent = 0;

    if (Array.isArray(p.roomType)) {
      const room = p.roomType[0] as any;
      rent = room?.rent ?? 0;
    }

    if (
      pref?.rentMin &&
      pref?.rentMax &&
      rent >= pref.rentMin &&
      rent <= pref.rentMax
    ) {
      score += 3;
    }

    // 🔥 RECENCY BOOST
    const daysOld =
      (Date.now() - new Date(p.createdAt).getTime()) /
      (1000 * 60 * 60 * 24);

    if (daysOld < 7) score += 2;

    return { ...p, score };
  });

  // 🔥 STEP 4: SORT + LIMIT
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