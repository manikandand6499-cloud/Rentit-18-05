// apartment.service.ts
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { ApartmentDto } from './dto/apartment.dto';

@Injectable()
export class ApartmentService {
 
  constructor(private prisma: PrismaService) {}

  // CREATE
  async createApartment(
    data: ApartmentDto,
    userId: number,
  ) {
    return this.prisma.apartment.create({
      data: {
  city: data.city!,
  locality: data.locality!,

  street: data.street,
  landmark: data.landmark,

  latitude: data.latitude,
  longitude: data.longitude,

  propertyType2: data.propertyType2,
  apartmentType: data.apartmentType,
  buildingType: data.buildingType,
  bhkType: data.bhkType,

  floor: data.floor,
  totalFloor: data.totalFloor,
  builtUpArea: data.builtUpArea,

  propertyAge: data.propertyAge,
  facing: data.facing,

  rentType: data.rentType,
  expectedRent: data.expectedRent,
  deposit: data.deposit,

  maintenanceAmount:
    data.maintenanceAmount,

  maintenance: data.maintenance,

  rentNegotiable:
    data.rentNegotiable,

  availableFrom:
    data.availableFrom,

  preferredTenant:
    data.preferredTenant,

  otherFeatures:
    data.otherFeatures,

  furnishing: data.furnishing,
  parking: data.parking,
  description: data.description,

  bathroom: data.bathroom,
  noOfBalcony: data.noOfBalcony,

  waterSupply: data.waterSupply,

  petAllowed: data.petAllowed,
  gymAllowed: data.gymAllowed,
  nonVegAllowed:
    data.nonVegAllowed,

  gateSecurity:
    data.gateSecurity,

  shownBy: data.shownBy,

  propertyCondition:
    data.propertyCondition,

  secondaryNumber:
    data.secondaryNumber,

  unitsPropertiesAvailable:
    data.unitsPropertiesAvailable,

  directions: data.directions,

  amenities: data.amenities,

  images: data.images,

  userId,
},
    });
  }

  // GET ALL
  async getAllApartments() {
    return this.prisma.apartment.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // GET ONE
  async getApartment(id: number) {
    const apartment =
      await this.prisma.apartment.findUnique({
        where: { id },
      });

    if (!apartment) {
      throw new NotFoundException(
        'Apartment not found',
      );
    }

    return apartment;
  }

  // UPDATE
  async updateApartment(
    id: number,
    data: ApartmentDto,
    userId: number,
  ) {
    const apartment =
      await this.prisma.apartment.findUnique({
        where: { id },
      });

    if (!apartment) {
      throw new NotFoundException(
        'Apartment not found',
      );
    }

    if (apartment.userId !== userId) {
      throw new ForbiddenException(
        'Unauthorized',
      );
    }

    return this.prisma.apartment.update({
      where: { id },

      data: {
        city: data.city,
        locality: data.locality,
        street: data.street,
        landmark: data.landmark,

        latitude: data.latitude,
        longitude: data.longitude,

        propertyType2: data.propertyType2,

        apartmentType: data.apartmentType,
        buildingType: data.buildingType,
        bhkType: data.bhkType,

        floor: data.floor,
        totalFloor: data.totalFloor,
        builtUpArea: data.builtUpArea,

        propertyAge: data.propertyAge,
        facing: data.facing,

        rentType: data.rentType,

        expectedRent: data.expectedRent,
        deposit: data.deposit,

        maintenanceAmount:
          data.maintenanceAmount,

        maintenance: data.maintenance,

        rentNegotiable:
          data.rentNegotiable,

        availableFrom:
          data.availableFrom,

        preferredTenant:
          data.preferredTenant,

        furnishing: data.furnishing,
        parking: data.parking,
        description: data.description,

        otherFeatures:
          data.otherFeatures,
      },
    });
  }

  // ADDITIONAL DETAILS
  async additionalDetails(
    id: number,
    data: ApartmentDto,
    userId: number,
  ) {
    const apartment =
      await this.prisma.apartment.findUnique({
        where: { id },
      });

    if (!apartment) {
      throw new NotFoundException(
        'Apartment not found',
      );
    }

    if (apartment.userId !== userId) {
      throw new ForbiddenException(
        'Unauthorized',
      );
    }

    return this.prisma.apartment.update({
      where: { id },

      data: {
        bathroom: data.bathroom,

        noOfBalcony:
          data.noOfBalcony,

        waterSupply:
          data.waterSupply,

        petAllowed:
          data.petAllowed,

        gymAllowed:
          data.gymAllowed,

        nonVegAllowed:
          data.nonVegAllowed,

        gateSecurity:
          data.gateSecurity,

        shownBy:
          data.shownBy,

        propertyCondition:
          data.propertyCondition,

        secondaryNumber:
          data.secondaryNumber,

        unitsPropertiesAvailable:
          data.unitsPropertiesAvailable,

        directions:
          data.directions,

        amenities:
          data.amenities,
      },
    });
  }
async getMyApartments(userId: number) {
  return this.prisma.apartment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

 async saveImages(
  id: number,
  userId: number,
  images: string[],
) {
  await this.checkPropertyOwner(
    id,
    userId,
  );

  return this.prisma.apartment.update({
    where: { id },

    data: {
      images,
    },
  });
}

async saveVideo(
  id: number,
  userId: number,
  video: string,
) {
  await this.checkPropertyOwner(
    id,
    userId,
  );

  return this.prisma.apartment.update({
    where: { id },

    data: {
      video,
    },
  });
}


  // ADD PHOTOS
// ADD PHOTOS
async addPhotos(
  id: number,
  photos: string[],
  userId: number,
) {
  const apartment =
    await this.prisma.apartment.findUnique({
      where: { id },
    });

  if (!apartment) {
    throw new NotFoundException(
      'Apartment not found',
    );
  }

  if (apartment.userId !== userId) {
    throw new ForbiddenException(
      'Unauthorized',
    );
  }

  return this.prisma.apartment.update({
    where: { id },

    data: {
      images: photos,
    },
  });
}

  // ✅ ADD HERE
  private async checkPropertyOwner(
    id: number,
    userId: number,
  ) {
    const apartment =
      await this.prisma.apartment.findUnique({
        where: { id },
      });

    if (!apartment) {
      throw new NotFoundException(
        'Apartment not found',
      );
    }

    if (apartment.userId !== userId) {
      throw new ForbiddenException(
        'Unauthorized',
      );
    }

    return apartment;
  }
  // DELETE
  async deleteApartment(
    id: number,
    userId: number,
  ) {
    const apartment =
      await this.prisma.apartment.findUnique({
        where: { id },
      });

    if (!apartment) {
      throw new NotFoundException(
        'Apartment not found',
      );
    }

    if (apartment.userId !== userId) {
      throw new ForbiddenException(
        'Unauthorized',
      );
    }

    return this.prisma.apartment.delete({
      where: { id },
    });
  }
// SAVE AVAILABILITY

async saveAvailability(
  id: number,
  userId: number,
  dto: ApartmentDto,
) {
  await this.checkPropertyOwner(
    id,
    userId,
  );

  return this.prisma.apartment.update({
    where: { id },

    data: {
      availabilityDay:
        dto.availabilityDay,

      startTime:
        dto.startTime,

      endTime:
        dto.endTime,

      availableAllDay:
        dto.availableAllDay,
    },
  });
}
  
}
