
// // property.service.ts

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

import { CreateBasicDto } from './dto/create-basic.dto';
import { CreateDetailsDto } from './dto/create-details.dto';
import { CreateAmenitiesDto } from './dto/create-amenities.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateLocationDto } from './dto/location.dto';

@Injectable()
export class PropertyService {
  constructor(private prisma: PrismaService) {}

  /*
  ============================
  STEP 1 — BASIC
  ============================
  */
async createBasic(userId: number, data: CreateBasicDto) {

if (data.propertyType === "Apartment") {
  return this.prisma.apartment.create({
    data: {
      userId,
      city: data.city ?? "Chennai",
      locality: data.locality ?? "Unknown", // ✅ FIX
      propertyType2: "Apartment",
    },
  });
}

  return this.prisma.pGDetails.create({
    data: {
      userId,
      city: data.city ?? "Chennai",
      locality: data.locality ?? "Unknown",
      propertyType: "PG",
      currentStep: 1,
    },
  });
}

  /*
  ============================
  STEP 2 — DETAILS
  ============================
  */
  async updateDetails(id: number, userId: number, data: CreateDetailsDto) {
  await this.checkPropertyOwner(id, userId);

  console.log("BODY:", data);

 return this.prisma.pGDetails.update({
  where: { id },
  data: {
    ...(data.city && { city: data.city }),
    ...(data.street && { street: data.street }),
    ...(data.locality && { locality: data.locality }),

    ...(data.landmark && data.landmark.trim() !== "" && {
      landmark: data.landmark.trim(),
    }),

    ...(data.latitude !== undefined && { latitude: data.latitude }),
    ...(data.longitude !== undefined && { longitude: data.longitude }),

    ...(data.propertyName && { propertyName: data.propertyName }),

    ...(data.preferredGuests && {
      preferredGuests: data.preferredGuests as any,
    }),

    ...(data.preferredTenant && {
      preferredTenant: data.preferredTenant as any,
    }),

    // ✅ JSON SAFE
    ...(Array.isArray(data.roomType) &&
      data.roomType.length > 0 && {
        roomType: data.roomType as any,
      }),

    ...(data.foodType && { foodType: data.foodType as any }),

    ...(data.pgAmenities && {
      pgAmenities: data.pgAmenities as any,
    }),

    ...(data.restrictions && {
      restrictions: data.restrictions as any,
    }),

    ...(data.availableFrom && {
      availableFrom: new Date(data.availableFrom),
    }),

    ...(data.foodIncluded !== undefined && {
      foodIncluded: data.foodIncluded,
    }),

    ...(data.parking && { parking: data.parking }),

    ...(data.noticePeriod !== undefined && {
      noticePeriod: data.noticePeriod,
    }),

    ...(data.gateClosingTime && {
      gateClosingTime: new Date(
        `1970-01-01T${data.gateClosingTime}:00`
      ),
    }),

    currentStep: 2,
  },
  
});

}
  /*
  ============================
  STEP 3 — AMENITIES
  ============================
  */
  async updateAmenities(id: number, userId: number, data: CreateAmenitiesDto) {
    await this.checkPropertyOwner(id, userId);

    return this.prisma.pGDetails.update({
      where: { id },
      data: {
        foodIncluded: data.foodIncluded ?? undefined,
        foodType: data.foodType ?? undefined,
        parking: data.parking ?? undefined,
        pgAmenities: data.pgAmenities ?? undefined,
        restrictions: data.restrictions ?? undefined,
        propertyDescription: data.propertyDescription ?? undefined,
        currentStep: 3,
      },
    });
  }

  /*
  ============================
  STEP 4 — LOCATION
  ============================
  */
  async updateLocation(id: number, userId: number, data: UpdateLocationDto) {
    await this.checkPropertyOwner(id, userId);

    return this.prisma.pGDetails.update({
      where: { id },
      data: {
        latitude: data.latitude,
        longitude: data.longitude,
        currentStep: 4,
      },
    });
  }

  /*
  ============================
  STEP 5 — MEDIA
  ============================
  */
 
  
  async saveImages(id: number, userId: number, images: string[]) {
    await this.checkPropertyOwner(id, userId);

    return this.prisma.pGDetails.update({
      where: { id },
      data: {
        images,
        currentStep: 5,
      },
    });
  }

  async saveVideo(id: number, userId: number, video: string) {
    await this.checkPropertyOwner(id, userId);

    return this.prisma.pGDetails.update({
      where: { id },
      data: { video },
    });
  }

  /*
  ============================
  STEP 6 — CONTACT
  ============================
  */
  async updateContact(id: number, userId: number, data: CreateContactDto) {
    await this.checkPropertyOwner(id, userId);

    return this.prisma.pGDetails.update({
      where: { id },
      data: {
        contactName: data.contactName ?? undefined,
        mobileNo: data.mobileNo ?? undefined,
        whatsapp: data.whatsapp ?? undefined,
        whatsappupdates: data.whatsappupdates ?? undefined,
        currentStep: 6,
        isDraft: false,
      },
    });
  }

  /*
  ============================
  STEP 7 — VERIFY
  ============================
  */
  async verifyProperty(id: number, userId: number) {
    await this.checkPropertyOwner(id, userId);

    return this.prisma.pGDetails.update({
      where: { id },
      data: {
        currentStep: 9,
        isDraft: false,
      },
    });
  }

  /*
  ============================
  GET METHODS
  ============================
  */
 async getAllProperties(userId: number, city?: string) {
  return this.prisma.pGDetails.findMany({
    where: {
      isDeleted: false,
      userId: { not: userId },
      // ✅ ADD CITY FILTER
      ...(city && {
        city: {
          equals: city,
          mode: 'insensitive',
        },
      }),
    },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { propertyViews: true },
      },
    },
  });
}

  async getMyTotalViews(userId: number) {
  return this.prisma.propertyView.count({
    where: {
      property: {
        userId: userId,
      },
    },
  });
}



async getPropertyStats(propertyId: number) {
  const views = await this.prisma.propertyView.count({
    where: { propertyId },
  });

  const enquiries = await this.prisma.message.count({
    where: {
      propertyId: propertyId, // ✅ ONLY if exists in schema
    },
  });

  return {
    views,
    enquiries,
  };
}

  async getMyProperties(userId: number) {
  return this.prisma.pGDetails.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          propertyViews: true,
          messages: true, // 👈 IMPORTANT
        },
      },
    },
  });
}

  async getProperty(id: number) {
    if (!id || isNaN(id)) {
      throw new NotFoundException('Invalid property ID');
    }

    const property = await this.prisma.pGDetails.findUnique({
      where: { id },
    });

    if (!property) throw new NotFoundException('Property not found');

    return property;
  }

  /*
  ============================
  DELETE
  ============================
  */
  async deleteProperty(id: number, userId: number) {
    await this.checkPropertyOwner(id, userId);

    return this.prisma.pGDetails.update({
      where: { id },
      data: { isDeleted: true },
    });
  }


  async getRecommended(userId: number, city?: string) {
  return this.prisma.pGDetails.findMany({
    where: {
      isDeleted: false,

      // 🔥 FILTER BY CITY
      ...(city && {
        city: {
          equals: city,
          mode: 'insensitive',
        },
      }),

      // optional filters (can improve later)
      propertyType: {
        contains: 'pg',
        mode: 'insensitive',
      },
    },

    orderBy: {
      createdAt: 'desc',
    },

    take: 10,
  });
}

  /*
  ============================
  VIEW SYSTEM
  ============================
  */
  async addView(propertyId: number, userId: number) {
    try {
      await this.prisma.propertyView.create({
        data: { propertyId, userId },
      });
    } catch {
      // ignore duplicate
    }

    return { success: true };
  }

  async getViewCount(propertyId: number) {
    return this.prisma.propertyView.count({
      where: { propertyId },
    });
  }

  async getRecentlyViewed(userId: number) {
    return this.prisma.propertyView.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        property: {
          include: {
            _count: {
              select: { propertyViews: true },
            },
          },
        },
      },
    });
  }


private async checkPropertyOwner(
  id: number,
  userId: number,
) {
  const property = await this.prisma.pGDetails.findUnique({
    where: { id },
  });

  if (!property) {
    throw new NotFoundException('Property not found');
  }

  if (property.userId !== userId) {
    throw new ForbiddenException('Unauthorized');
  }

  return property;
}
}