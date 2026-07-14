// property.service.ts

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CreateBasicDto } from './dto/create-basic.dto';
import { CreateDetailsDto } from './dto/create-details.dto';
import { CreateAmenitiesDto } from './dto/create-amenities.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateLocationDto } from './dto/location.dto';
import { CreateScheduleDto } from './dto/availability.dto';

@Injectable()
export class PropertyService {
  constructor(private prisma: PrismaService) {}

  // ============================================================
  // STEP 1 — BASIC
  // ============================================================
  async createBasic(userId: number, data: CreateBasicDto) {
    if (data.propertyType === 'Apartment') {
      return this.prisma.apartment.create({
        data: {
          userId,
          city: data.city ?? 'Chennai',
          locality: data.locality ?? 'Unknown',
          propertyType2: 'Apartment',
        },
      });
    }

    return this.prisma.pGDetails.create({
      data: {
        userId,
        city: data.city ?? 'Chennai',
        locality: data.locality ?? 'Unknown',
        propertyType: 'PG',
        currentStep: 1,
      },
    });
  }

  // ============================================================
  // STEP 2 — DETAILS
  // ============================================================
  async updateDetails(id: number, userId: number, data: CreateDetailsDto) {
    await this.checkPropertyOwner(id, userId);

    return this.prisma.pGDetails.update({
      where: { id },
      data: {
        ...(data.city && { city: data.city }),
        ...(data.street && { street: data.street }),
        ...(data.locality && { locality: data.locality }),
        ...(data.landmark &&
          data.landmark.trim() !== '' && { landmark: data.landmark.trim() }),
        ...(data.latitude !== undefined && { latitude: data.latitude }),
        ...(data.longitude !== undefined && { longitude: data.longitude }),
        ...(data.propertyName && { propertyName: data.propertyName }),
        ...(data.preferredGuests && {
          preferredGuests: data.preferredGuests as any,
        }),
        ...(data.preferredTenant && {
          preferredTenant: data.preferredTenant as any,
        }),
        ...(Array.isArray(data.roomType) &&
          data.roomType.length > 0 && { roomType: data.roomType as any }),
        ...(data.foodType && { foodType: data.foodType as any }),
        ...(data.pgAmenities && { pgAmenities: data.pgAmenities as any }),
        ...(data.restrictions && { restrictions: data.restrictions as any }),
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
          gateClosingTime: new Date(`1970-01-01T${data.gateClosingTime}:00`),
        }),
        currentStep: 2,
      },
    });
  }

  // ============================================================
  // STEP 3 — AMENITIES
  // ============================================================
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

  // ============================================================
  // STEP 4 — LOCATION
  // ============================================================
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

  // ============================================================
  // STEP 5 — MEDIA
  // ============================================================
  async saveImages(id: number, userId: number, images: string[]) {
    await this.checkPropertyOwner(id, userId);

    return this.prisma.pGDetails.update({
      where: { id },
      data: { images, currentStep: 5 },
    });
  }

  async saveVideo(id: number, userId: number, video: string) {
    await this.checkPropertyOwner(id, userId);

    return this.prisma.pGDetails.update({
      where: { id },
      data: { video },
    });
  }

  // ============================================================
  // STEP 6 — CONTACT
  // ============================================================
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

  // ============================================================
  // STEP 7 — VERIFY
  // ============================================================
  async verifyProperty(id: number, userId: number) {
    await this.checkPropertyOwner(id, userId);

    return this.prisma.pGDetails.update({
      where: { id },
      data: { currentStep: 9, isDraft: false },
    });
  }


  // ============================================================
  // GET ALL PROPERTIES
  // Returns _count.propertyViews so the card can show the badge
  // ============================================================
async getAllProperties(userId: number, city?: string) {
  return this.prisma.pGDetails.findMany({
    where: {
      isDeleted: false,
      isSoldOut: false,   // 🔥 ADD THIS
      userId: { not: userId },

      ...(city && {
        city: {
          equals: city,
          mode: 'insensitive',
        },
      }),
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

  // ============================================================
  // MY TOTAL VIEWS (owner dashboard)
  // ============================================================
async getMyTotalViews(userId: number) {
  const result = await this.prisma.pGDetails.aggregate({
    where: {
      userId,
      isDeleted: false,
    },
    _sum: {
      viewscount: true,
    },
  });

  return result._sum.viewscount ?? 0;
}

  // ============================================================
  // PROPERTY STATS (single property — views + enquiries)
  // ============================================================
async getPropertyStats(propertyId: number) {
  const property = await this.prisma.pGDetails.findUnique({
    where: { id: propertyId },
    select: {
      viewscount: true,
    },
  });

  if (!property) {
    throw new NotFoundException('Property not found');
  }

  const enquiries = await this.prisma.message.count({
    where: { propertyId },
  });

  return {
    views: property.viewscount,
    enquiries,
  };
}

  // ============================================================
  // MY PROPERTIES (owner list)
  // ============================================================
async getMyProperties(userId: number) {
  return this.prisma.pGDetails.findMany({
    where: {
      userId,
      isDeleted: false,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });
}

  // ============================================================
  // SINGLE PROPERTY (detail page)
  // ============================================================
async getProperty(id: number) {
  if (!id || isNaN(id)) {
    throw new NotFoundException('Invalid property ID');
  }

  const property = await this.prisma.pGDetails.findUnique({
    where: { id },
  });

  if (!property) {
    throw new NotFoundException('Property not found');
  }

  return property;
}

  // ============================================================
  // DELETE (soft)
  // ============================================================
  async deleteProperty(id: number, userId: number) {
    await this.checkPropertyOwner(id, userId);

    return this.prisma.pGDetails.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  // ============================================================
  // RECOMMENDED
  // ============================================================
async getRecommended(userId: number, city?: string) {
  return this.prisma.pGDetails.findMany({
    where: {
      isDeleted: false,
      ...(city && {
        city: {
          equals: city,
          mode: 'insensitive',
        },
      }),
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

  // ============================================================
  // PRIVATE — ownership guard
  // ============================================================
  private async checkPropertyOwner(id: number, userId: number) {
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

  // ============================================================
// RECORD VIEW COUNT
// ============================================================
async recordView(propertyId: number, userId: number) {
  const property = await this.prisma.pGDetails.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new NotFoundException('Property not found');
  }

  // Don't count owner's own view
  if (property.userId === userId) {
    return {
      success: true,
      message: 'Owner view ignored',
      viewscount: property.viewscount,
    };
  }

  const updated = await this.prisma.pGDetails.update({
    where: { id: propertyId },
    data: {
      viewscount: {
        increment: 1,
      },
    },
    select: {
      id: true,
      viewscount: true,
    },
  });

  return {
    success: true,
    viewscount: updated.viewscount,
  };
}

async updateSchedule(
  id: number,
  userId: number,
  data: CreateScheduleDto,
) {
  await this.checkPropertyOwner(id, userId);

  return this.prisma.pGDetails.update({
    where: { id },
    data: {
      availabilityDay:
        data.availabilityDay !== undefined
          ? (data.availabilityDay as any)
          : undefined,
      startTime:
        data.availableAllDay === true
          ? null
          : (data.startTime ?? undefined),
      endTime:
        data.availableAllDay === true
          ? null
          : (data.endTime ?? undefined),
      availableAllDay:
        data.availableAllDay ?? undefined,
      currentStep: 7,
    },
  });
}


async markSoldOut(
  propertyId: number,
  userId: number,
  reason: string,
) {
  console.log('propertyId =>', propertyId);
  console.log('userId =>', userId);
  console.log('reason =>', reason);

  const property = await this.prisma.pGDetails.findFirst({
    where: {
      id: propertyId,
      userId,
    },
  });

  console.log('property =>', property);

  if (!property) {
    throw new BadRequestException(
      'Property not found',
    );
  }

  return this.prisma.pGDetails.update({
    where: {
      id: propertyId,
    },
    data: {
      isSoldOut: true,
      soldOutReason: reason,
      soldOutAt: new Date(),
    },
  });
}
}