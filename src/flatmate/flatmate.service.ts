// flatmate.service.ts

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { FlatmateDto } from '../flatmate/dto/create-flatmate.dto';

@Injectable()
export class FlatmateService {
  constructor(private readonly prisma: PrismaService) {}

  // ──────────────────────────────────────────────────────────
  // PRIVATE HELPER — ownership check
  // ──────────────────────────────────────────────────────────

  private async checkOwner(id: number, userId: number) {
    const flatmate = await this.prisma.flatmate.findUnique({ where: { id } });

    if (!flatmate) {
      throw new NotFoundException('Flatmate listing not found');
    }

    if (flatmate.userId !== userId) {
      throw new ForbiddenException('Unauthorized');
    }

    return flatmate;
  }

  // ──────────────────────────────────────────────────────────
  // CREATE
  // ──────────────────────────────────────────────────────────

  async createFlatmate(dto: FlatmateDto, userId: number) {
    return this.prisma.flatmate.create({
      data: {
        // ── Relation (Prisma connect pattern) ──────────────
        user: {
          connect: { id: userId },
        },

        // ── Basic ──────────────────────────────────────────
        city:         dto.city         ?? '',
        propertyType: dto.propertyType ?? '',

        // ── Property details ───────────────────────────────
        ...(dto.apartmentType !== undefined && { apartmentType: dto.apartmentType }),
        ...(dto.apartmentName !== undefined && { apartmentName: dto.apartmentName }),
        ...(dto.bhkType       !== undefined && { bhkType:       dto.bhkType }),
        ...(dto.floor         !== undefined && { floor:         dto.floor }),
        ...(dto.totalFloor    !== undefined && { totalFloor:    dto.totalFloor }),
        ...(dto.roomType      !== undefined && { roomType:      dto.roomType }),
        ...(dto.tenantType    !== undefined && { tenantType:    dto.tenantType }),
        ...(dto.propertyAge   !== undefined && { propertyAge:   dto.propertyAge }),
        ...(dto.facing        !== undefined && { facing:        dto.facing }),

        ...(dto.builtUpArea != null && { builtUpArea: Number(dto.builtUpArea) }),

        // ── Location ───────────────────────────────────────
        ...(dto.locality !== undefined && { locality: dto.locality }),
        ...(dto.street   !== undefined && { street:   dto.street }),
        ...(dto.landmark !== undefined && { landmark: dto.landmark }),

        ...(dto.latitude  != null && { latitude:  Number(dto.latitude) }),
        ...(dto.longitude != null && { longitude: Number(dto.longitude) }),

        // ── Rent ───────────────────────────────────────────
        ...(dto.expectedRent    != null && { expectedRent:    Number(dto.expectedRent) }),
        ...(dto.expectedDeposit != null && { expectedDeposit: Number(dto.expectedDeposit) }),

        ...(dto.maintenanceType   !== undefined && { maintenanceType:   dto.maintenanceType }),
        ...(dto.maintenanceAmount != null       && { maintenanceAmount: Number(dto.maintenanceAmount) }),

        ...(dto.availableFrom && { availableFrom: new Date(dto.availableFrom) }),

        ...(dto.furnishing  !== undefined && { furnishing:  dto.furnishing }),
        ...(dto.parking     !== undefined && { parking:     dto.parking }),
        ...(dto.description !== undefined && { description: dto.description }),

        // ── Room ───────────────────────────────────────────
        ...(dto.attachedBathroom !== undefined && { attachedBathroom: dto.attachedBathroom }),
        ...(dto.bathroomType     !== undefined && { bathroomType:     dto.bathroomType }),
        ...(dto.acRoom           !== undefined && { acRoom:           dto.acRoom }),
        ...(dto.balcony          !== undefined && { balcony:          dto.balcony }),

        // ── Preferences ────────────────────────────────────
        ...(dto.nonVegAllowed   !== undefined && { nonVegAllowed:   dto.nonVegAllowed }),
        ...(dto.smokingAllowed  !== undefined && { smokingAllowed:  dto.smokingAllowed }),
        ...(dto.drinkingAllowed !== undefined && { drinkingAllowed: dto.drinkingAllowed }),

        // ── Amenities ──────────────────────────────────────
        ...(dto.gym           !== undefined && { gym:           dto.gym }),
        ...(dto.gatedSecurity !== undefined && { gatedSecurity: dto.gatedSecurity }),

        ...(dto.liftSelected         !== undefined && { liftSelected:         dto.liftSelected }),
        ...(dto.swimmingPoolSelected !== undefined && { swimmingPoolSelected: dto.swimmingPoolSelected }),
        ...(dto.clubHouseSelected    !== undefined && { clubHouseSelected:    dto.clubHouseSelected }),
        ...(dto.powerBackupSelected  !== undefined && { powerBackupSelected:  dto.powerBackupSelected }),
        ...(dto.parkSelected         !== undefined && { parkSelected:         dto.parkSelected }),

        // ── Contact ────────────────────────────────────────
        ...(dto.whoShowsProperty !== undefined && { whoShowsProperty: dto.whoShowsProperty }),
        ...(dto.secondaryNumber  !== undefined && { secondaryNumber:  dto.secondaryNumber }),
        ...(dto.waterSupply      !== undefined && { waterSupply:      dto.waterSupply }),
        ...(dto.directionsTip    !== undefined && { directionsTip:    dto.directionsTip }),
      },
    });
  }

  // ──────────────────────────────────────────────────────────
  // GET ALL
  // ──────────────────────────────────────────────────────────

  async getAllFlatmates() {
    return this.prisma.flatmate.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // ──────────────────────────────────────────────────────────
  // GET ONE
  // ──────────────────────────────────────────────────────────

  async getFlatmate(id: number) {
    const flatmate = await this.prisma.flatmate.findUnique({ where: { id } });

    if (!flatmate) {
      throw new NotFoundException('Flatmate listing not found');
    }

    return flatmate;
  }

  // ──────────────────────────────────────────────────────────
  // UPDATE
  // ──────────────────────────────────────────────────────────

 async updateFlatmate(id: number, dto: FlatmateDto, userId: number) {
  await this.checkOwner(id, userId);

  return this.prisma.flatmate.update({
    where: { id },
    data: {
      // ── Basic ─────────────────────────────
      ...(dto.city !== undefined && { city: dto.city }),
      ...(dto.propertyType !== undefined && {
        propertyType: dto.propertyType,
      }),

      // ── Property Details ─────────────────
      ...(dto.apartmentType !== undefined && {
        apartmentType: dto.apartmentType,
      }),
      ...(dto.apartmentName !== undefined && {
        apartmentName: dto.apartmentName,
      }),
      ...(dto.bhkType !== undefined && { bhkType: dto.bhkType }),
      ...(dto.floor !== undefined && { floor: dto.floor }),
      ...(dto.totalFloor !== undefined && {
        totalFloor: dto.totalFloor,
      }),
      ...(dto.roomType !== undefined && {
        roomType: dto.roomType,
      }),
      ...(dto.tenantType !== undefined && {
        tenantType: dto.tenantType,
      }),
      ...(dto.propertyAge !== undefined && {
        propertyAge: dto.propertyAge,
      }),
      ...(dto.facing !== undefined && {
        facing: dto.facing,
      }),

      ...(dto.builtUpArea != null && {
        builtUpArea: Number(dto.builtUpArea),
      }),

      // ── Location ─────────────────────────
      ...(dto.locality !== undefined && {
        locality: dto.locality,
      }),
      ...(dto.street !== undefined && {
        street: dto.street,
      }),
      ...(dto.landmark !== undefined && {
        landmark: dto.landmark,
      }),

      ...(dto.latitude != null && {
        latitude: Number(dto.latitude),
      }),
      ...(dto.longitude != null && {
        longitude: Number(dto.longitude),
      }),

      // ── Rent ─────────────────────────────
      ...(dto.expectedRent != null && {
        expectedRent: Number(dto.expectedRent),
      }),
      ...(dto.expectedDeposit != null && {
        expectedDeposit: Number(dto.expectedDeposit),
      }),

      ...(dto.maintenanceType !== undefined && {
        maintenanceType: dto.maintenanceType,
      }),
      ...(dto.maintenanceAmount != null && {
        maintenanceAmount: Number(dto.maintenanceAmount),
      }),

      ...(dto.availableFrom && {
        availableFrom: new Date(dto.availableFrom),
      }),

      ...(dto.furnishing !== undefined && {
        furnishing: dto.furnishing,
      }),
      ...(dto.parking !== undefined && {
        parking: dto.parking,
      }),
      ...(dto.description !== undefined && {
        description: dto.description,
      }),

      // ── Room Details ─────────────────────
      ...(dto.attachedBathroom !== undefined && {
        attachedBathroom: dto.attachedBathroom,
      }),
      ...(dto.bathroomType !== undefined && {
        bathroomType: dto.bathroomType,
      }),
      ...(dto.acRoom !== undefined && {
        acRoom: dto.acRoom,
      }),
      ...(dto.balcony !== undefined && {
        balcony: dto.balcony,
      }),

      // ── Preferences ──────────────────────
      ...(dto.nonVegAllowed !== undefined && {
        nonVegAllowed: dto.nonVegAllowed,
      }),
      ...(dto.smokingAllowed !== undefined && {
        smokingAllowed: dto.smokingAllowed,
      }),
      ...(dto.drinkingAllowed !== undefined && {
        drinkingAllowed: dto.drinkingAllowed,
      }),

      // ── Amenities ────────────────────────
      ...(dto.gym !== undefined && {
        gym: dto.gym,
      }),
      ...(dto.gatedSecurity !== undefined && {
        gatedSecurity: dto.gatedSecurity,
      }),
      ...(dto.liftSelected !== undefined && {
        liftSelected: dto.liftSelected,
      }),
      ...(dto.swimmingPoolSelected !== undefined && {
        swimmingPoolSelected: dto.swimmingPoolSelected,
      }),
      ...(dto.clubHouseSelected !== undefined && {
        clubHouseSelected: dto.clubHouseSelected,
      }),
      ...(dto.powerBackupSelected !== undefined && {
        powerBackupSelected: dto.powerBackupSelected,
      }),
      ...(dto.parkSelected !== undefined && {
        parkSelected: dto.parkSelected,
      }),

      // ── Contact ──────────────────────────
      ...(dto.whoShowsProperty !== undefined && {
        whoShowsProperty: dto.whoShowsProperty,
      }),
      ...(dto.secondaryNumber !== undefined && {
        secondaryNumber: dto.secondaryNumber,
      }),
      ...(dto.waterSupply !== undefined && {
        waterSupply: dto.waterSupply,
      }),
      ...(dto.directionsTip !== undefined && {
        directionsTip: dto.directionsTip,
      }),

      // ── Availability ─────────────────────
   ...(dto.availabilityDay !== undefined && {
  availabilityDay: dto.availabilityDay,
}),
...(dto.startTime !== undefined && {
  startTime: dto.startTime,
}),
...(dto.endTime !== undefined && {
  endTime: dto.endTime,
}),
...(dto.availableAllDay !== undefined && {
  availableAllDay: dto.availableAllDay,
}),
    },
  });
}

  // ──────────────────────────────────────────────────────────
  // ADDITIONAL DETAILS
  // ──────────────────────────────────────────────────────────

  async additionalDetails(id: number, dto: FlatmateDto, userId: number) {
    await this.checkOwner(id, userId);

    return this.prisma.flatmate.update({
      where: { id },
      data: {
        ...(dto.attachedBathroom !== undefined && { attachedBathroom: dto.attachedBathroom }),
        ...(dto.bathroomType     !== undefined && { bathroomType:     dto.bathroomType }),
        ...(dto.acRoom           !== undefined && { acRoom:           dto.acRoom }),
        ...(dto.balcony          !== undefined && { balcony:          dto.balcony }),

        ...(dto.nonVegAllowed   !== undefined && { nonVegAllowed:   dto.nonVegAllowed }),
        ...(dto.smokingAllowed  !== undefined && { smokingAllowed:  dto.smokingAllowed }),
        ...(dto.drinkingAllowed !== undefined && { drinkingAllowed: dto.drinkingAllowed }),

        ...(dto.gym           !== undefined && { gym:           dto.gym }),
        ...(dto.gatedSecurity !== undefined && { gatedSecurity: dto.gatedSecurity }),

        ...(dto.whoShowsProperty !== undefined && { whoShowsProperty: dto.whoShowsProperty }),
        ...(dto.secondaryNumber  !== undefined && { secondaryNumber:  dto.secondaryNumber }),
        ...(dto.waterSupply      !== undefined && { waterSupply:      dto.waterSupply }),
        ...(dto.directionsTip    !== undefined && { directionsTip:    dto.directionsTip }),

        ...(dto.liftSelected         !== undefined && { liftSelected:         dto.liftSelected }),
        ...(dto.swimmingPoolSelected !== undefined && { swimmingPoolSelected: dto.swimmingPoolSelected }),
        ...(dto.clubHouseSelected    !== undefined && { clubHouseSelected:    dto.clubHouseSelected }),
        ...(dto.powerBackupSelected  !== undefined && { powerBackupSelected:  dto.powerBackupSelected }),
        ...(dto.parkSelected         !== undefined && { parkSelected:         dto.parkSelected }),
      },
    });
  }

  // ──────────────────────────────────────────────────────────
  // SAVE IMAGES
  // ──────────────────────────────────────────────────────────

  async saveImages(id: number, userId: number, images: string[]) {
    await this.checkOwner(id, userId);

    return this.prisma.flatmate.update({
      where: { id },
      data: { images },
    });
  }

  // ──────────────────────────────────────────────────────────
  // SAVE VIDEO
  // ──────────────────────────────────────────────────────────

  async saveVideo(id: number, userId: number, video: string) {
    await this.checkOwner(id, userId);

    return this.prisma.flatmate.update({
      where: { id },
      data: { video },
    });
  }

  // ──────────────────────────────────────────────────────────
  // SAVE AVAILABILITY
  // ──────────────────────────────────────────────────────────

  async saveAvailability(id: number, userId: number, dto: FlatmateDto) {
    await this.checkOwner(id, userId);

    return this.prisma.flatmate.update({
      where: { id },
      data: {
        ...(dto.availabilityDay !== undefined && { availabilityDay: dto.availabilityDay }),
        ...(dto.startTime       !== undefined && { startTime:       dto.startTime }),
        ...(dto.endTime         !== undefined && { endTime:         dto.endTime }),
        ...(dto.availableAllDay !== undefined && { availableAllDay: dto.availableAllDay }),
      },
    });
  }

  // ──────────────────────────────────────────────────────────
  // DELETE
  // ──────────────────────────────────────────────────────────

  async deleteFlatmate(id: number, userId: number) {
    await this.checkOwner(id, userId);

    return this.prisma.flatmate.delete({ where: { id } });
  }

  // Increment only
async incrementViewCount(id: number) {
  const flatmate = await this.prisma.flatmate.findUnique({
    where: { id },
  });

  if (!flatmate) {
    throw new NotFoundException('Flatmate listing not found');
  }

  return this.prisma.flatmate.update({
    where: { id },
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
}

// Get details + increment
async getFlatmateAndIncrementView(id: number) {
  const flatmate = await this.prisma.flatmate.findUnique({
    where: { id },
  });

  if (!flatmate) {
    throw new NotFoundException('Flatmate listing not found');
  }

  return this.prisma.flatmate.update({
    where: { id },
    data: {
      viewscount: {
        increment: 1,
      },
    },
  });
}
}