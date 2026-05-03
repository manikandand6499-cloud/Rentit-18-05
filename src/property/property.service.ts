
// // property.service.ts

import {
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
    return this.prisma.property.create({
      data: {
        userId,
        city: data.city ?? 'Chennai',
        locality: data.locality ?? 'Unknown',
        propertyType: data.propertyType || 'PG',
        propertyName: data.propertyName ?? undefined,
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

  return this.prisma.property.update({
    where: { id },
    data: {
      city: data.city ?? undefined,
      street: data.street ?? undefined,
      locality: data.locality ?? undefined,

      // ✅ CLEAN STRING FIX
      landmark:
        data.landmark && data.landmark.trim() !== ""
          ? data.landmark.trim()
          : undefined,

      latitude: data.latitude ?? undefined,
      longitude: data.longitude ?? undefined,

      propertyName: data.propertyName ?? undefined,

      preferredGuests: data.preferredGuests ?? undefined,
      preferredTenant: data.preferredTenant ?? undefined,

      // 🔥 FIXED JSON FIELDS
      roomType:
        Array.isArray(data.roomType) && data.roomType.length > 0
          ? (data.roomType as any)
          : undefined,

      foodType: data.foodType ? (data.foodType as any) : undefined,

      pgAmenities: data.pgAmenities
        ? (data.pgAmenities as any)
        : undefined,

      restrictions: data.restrictions
        ? (data.restrictions as any)
        : undefined,

      availableFrom: data.availableFrom
        ? new Date(data.availableFrom)
        : undefined,

      foodIncluded: data.foodIncluded ?? undefined,
      parking: data.parking ?? undefined,
      noticePeriod: data.noticePeriod ?? undefined,

      gateClosingTime: data.gateClosingTime
        ? new Date(`1970-01-01T${data.gateClosingTime}:00`)
        : undefined,

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

    return this.prisma.property.update({
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

    return this.prisma.property.update({
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

    return this.prisma.property.update({
      where: { id },
      data: {
        images,
        currentStep: 5,
      },
    });
  }

  async saveVideo(id: number, userId: number, video: string) {
    await this.checkPropertyOwner(id, userId);

    return this.prisma.property.update({
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

    return this.prisma.property.update({
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

    return this.prisma.property.update({
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
  async getAllProperties(userId: number) {
    return this.prisma.property.findMany({
      where: {
        isDeleted: false,
        userId: { not: userId },
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
    where: { propertyId },
  });

  return {
    views,
    enquiries,
  };
}

  async getMyProperties(userId: number) {
  return this.prisma.property.findMany({
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

    const property = await this.prisma.property.findUnique({
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

    return this.prisma.property.update({
      where: { id },
      data: { isDeleted: true },
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

  /*
  ============================
  OWNER CHECK
  ============================
  */
  private async checkPropertyOwner(id: number, userId: number) {
    const property = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!property) throw new NotFoundException('Property not found');

    if (property.userId !== userId) {
      throw new UnauthorizedException('Not allowed');
    }
  }
}