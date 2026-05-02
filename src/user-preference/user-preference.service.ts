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

    if (!pref) return [];

    console.log('🔥 PREF:', pref);

    return this.prisma.property.findMany({
      where: {
        // ✅ CITY
        ...(pref.city && { city: pref.city }),

        // ✅ PG FOR
        ...(pref.pgFor && {
          preferredTenant: {
            array_contains: pref.pgFor,
          },
        }),

        // ✅ Preferred Guests
        ...(pref.preferredTenant && {
          preferredGuests: {
            array_contains: pref.preferredTenant,
          },
        }),

        // ✅ FOOD
        ...(pref.foodIncluded !== null &&
          pref.foodIncluded !== undefined && {
            foodIncluded: pref.foodIncluded,
          }),

        // ✅ PARKING
        ...(pref.parking === 'Yes' && {
          parking: {
            in: ['Car', 'Bike', 'Both'],
          },
        }),

        ...(pref.parking === 'No' && {
          OR: [
            { parking: null },
            { parking: 'None' },
          ],
        }),

        // ✅ RENT FILTER
        ...(pref.rentMin || pref.rentMax
          ? {
              roomType: {
                path: ['rent'],
                gte: pref.rentMin ?? 0,
                ...(pref.rentMax && pref.rentMax !== 0
                  ? { lte: pref.rentMax }
                  : {}),
              },
            }
          : {}),
      },

   orderBy: this.getSort(pref.premiumSort ?? undefined),
      take: 20,
    });
  }

  // 🔥 SORT HANDLER
  private getSort(sort?: string) {
    if (sort === 'new') return { createdAt: 'desc' as const };
    if (sort === 'recent') return { updatedAt: 'desc' as const };
    return undefined;
  }
}