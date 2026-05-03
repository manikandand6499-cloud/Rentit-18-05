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
 async getRecommended(userId: number, selectedCity?: string) {
  const pref = await this.get(userId);

  console.log('🔥 PREF:', pref);
  console.log('🔥 SELECTED CITY:', selectedCity);

  return this.prisma.property.findMany({
    where: {
      isDeleted: false,
      isDraft: false,

      // 🔥 PRIORITY 1: UI selected city
      ...(selectedCity && { city: selectedCity }),

      // 🔥 PRIORITY 2: fallback to preference (only if no selectedCity)
      ...(!selectedCity && pref?.city && { city: pref.city }),

      // ✅ PG FOR
      ...(pref?.pgFor && {
        preferredTenant: {
          array_contains: pref.pgFor,
        },
      }),

      // ✅ Preferred Guests
      ...(pref?.preferredTenant && {
        preferredGuests: {
          array_contains: pref.preferredTenant,
        },
      }),

      // ✅ FOOD
      ...(pref?.foodIncluded !== null &&
        pref?.foodIncluded !== undefined && {
          foodIncluded: pref.foodIncluded,
        }),

      // ✅ PARKING
      ...(pref?.parking === 'Yes' && {
        parking: {
          in: ['Car', 'Bike', 'Both'],
        },
      }),

      ...(pref?.parking === 'No' && {
        OR: [{ parking: null }, { parking: 'None' }],
      }),
    },

    orderBy: this.getSort(pref?.premiumSort ?? undefined),
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