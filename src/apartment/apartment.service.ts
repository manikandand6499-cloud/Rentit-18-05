// apartment.service.ts
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { ApartmentDto } from './dto/apartment.dto';

@Injectable()
export class ApartmentService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  async createApartment(data: ApartmentDto, userId: number) {
    const apartment = await this.prisma.apartment.create({
      data: {
        city: data.city || 'Chennai',
        locality: data.locality || '',
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
        maintenanceAmount: data.maintenanceAmount,
        maintenance: data.maintenance,
        rentNegotiable: data.rentNegotiable,
        availableFrom: data.availableFrom,
        preferredTenant: Array.isArray(data.preferredTenant) ? data.preferredTenant : (data.preferredTenant ? [data.preferredTenant] : []),
        otherFeatures: data.otherFeatures,
        furnishing: data.furnishing,
        parking: data.parking,
        description: data.description,
        bathroom: data.bathroom,
        noOfBalcony: data.noOfBalcony,
        waterSupply: data.waterSupply,
        petAllowed: data.petAllowed,
        gymAllowed: data.gymAllowed,
        nonVegAllowed: data.nonVegAllowed,
        gateSecurity: data.gateSecurity,
        shownBy: data.shownBy,
        propertyCondition: data.propertyCondition,
        secondaryNumber: data.secondaryNumber,
        unitsPropertiesAvailable: data.unitsPropertiesAvailable,
        directions: data.directions,
        amenities: Array.isArray(data.amenities) ? data.amenities : [],
        images: Array.isArray(data.images) ? data.images : [],
        video: data.video,
        availabilityDay: data.availabilityDay,
        startTime: data.startTime,
        endTime: data.endTime,
        availableAllDay: data.availableAllDay,
        userId,
      },
    });
    console.log("✅ CREATED APARTMENT =>", apartment);
    return apartment;
  }

  // GET ALL
  async getAllApartments() {
    return this.prisma.apartment.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // GET SINGLE
  async getApartment(id: number) {
    console.log("🔥 GET APARTMENT ID =>", id);

    const apartment = await this.prisma.apartment.findUnique({
      where: { id },
      include: { user: true },
    });

    console.log("🔥 APARTMENT FOUND =>", apartment);

    if (!apartment) {
      throw new NotFoundException("Apartment not found");
    }

    return apartment;
  }

  // UPDATE
  async updateApartment(id: number, data: ApartmentDto, userId: number) {
    const apartment = await this.prisma.apartment.findUnique({ where: { id } });

    if (!apartment) throw new NotFoundException('Apartment not found');
    if (apartment.userId !== userId) throw new ForbiddenException('Unauthorized');

    return this.prisma.apartment.update({
      where: { id },
      data: {
        ...(data.city !== undefined && { city: data.city }),
        ...(data.locality !== undefined && { locality: data.locality }),
        ...(data.street !== undefined && { street: data.street }),
        ...(data.landmark !== undefined && { landmark: data.landmark }),
        ...(data.latitude !== undefined && { latitude: data.latitude }),
        ...(data.longitude !== undefined && { longitude: data.longitude }),
        ...(data.propertyType2 !== undefined && { propertyType2: data.propertyType2 }),
        ...(data.apartmentType !== undefined && { apartmentType: data.apartmentType }),
        ...(data.buildingType !== undefined && { buildingType: data.buildingType }),
        ...(data.bhkType !== undefined && { bhkType: data.bhkType }),
        ...(data.floor !== undefined && { floor: data.floor }),
        ...(data.totalFloor !== undefined && { totalFloor: data.totalFloor }),
        ...(data.builtUpArea !== undefined && { builtUpArea: data.builtUpArea }),
        ...(data.propertyAge !== undefined && { propertyAge: data.propertyAge }),
        ...(data.facing !== undefined && { facing: data.facing }),
        ...(data.rentType !== undefined && { rentType: data.rentType }),
        ...(data.expectedRent !== undefined && { expectedRent: data.expectedRent }),
        ...(data.deposit !== undefined && { deposit: data.deposit }),
        ...(data.maintenanceAmount !== undefined && { maintenanceAmount: data.maintenanceAmount }),
        ...(data.maintenance !== undefined && { maintenance: data.maintenance }),
        ...(data.rentNegotiable !== undefined && { rentNegotiable: data.rentNegotiable }),
        ...(data.availableFrom !== undefined && { availableFrom: data.availableFrom }),
        ...(data.preferredTenant !== undefined && { preferredTenant: Array.isArray(data.preferredTenant) ? data.preferredTenant : [data.preferredTenant] }),
        ...(data.furnishing !== undefined && { furnishing: data.furnishing }),
        ...(data.parking !== undefined && { parking: data.parking }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.otherFeatures !== undefined && { otherFeatures: data.otherFeatures }),
        ...(data.bathroom !== undefined && { bathroom: data.bathroom }),
        ...(data.noOfBalcony !== undefined && { noOfBalcony: data.noOfBalcony }),
        ...(data.waterSupply !== undefined && { waterSupply: data.waterSupply }),
        ...(data.petAllowed !== undefined && { petAllowed: data.petAllowed }),
        ...(data.gymAllowed !== undefined && { gymAllowed: data.gymAllowed }),
        ...(data.nonVegAllowed !== undefined && { nonVegAllowed: data.nonVegAllowed }),
        ...(data.gateSecurity !== undefined && { gateSecurity: data.gateSecurity }),
        ...(data.shownBy !== undefined && { shownBy: data.shownBy }),
        ...(data.propertyCondition !== undefined && { propertyCondition: data.propertyCondition }),
        ...(data.secondaryNumber !== undefined && { secondaryNumber: data.secondaryNumber }),
        ...(data.unitsPropertiesAvailable !== undefined && { unitsPropertiesAvailable: data.unitsPropertiesAvailable }),
        ...(data.directions !== undefined && { directions: data.directions }),
        ...(data.amenities !== undefined && { amenities: Array.isArray(data.amenities) ? data.amenities : [] }),
        ...(data.images !== undefined && { images: Array.isArray(data.images) ? data.images : [] }),
        ...(data.video !== undefined && { video: data.video }),
        ...(data.availabilityDay !== undefined && { availabilityDay: data.availabilityDay }),
        ...(data.startTime !== undefined && { startTime: data.startTime }),
        ...(data.endTime !== undefined && { endTime: data.endTime }),
        ...(data.availableAllDay !== undefined && { availableAllDay: data.availableAllDay }),
      },
    });
  }

  // ADDITIONAL DETAILS
  async additionalDetails(id: number, data: ApartmentDto, userId: number) {
    const apartment = await this.prisma.apartment.findUnique({ where: { id } });

    if (!apartment) throw new NotFoundException('Apartment not found');
    if (apartment.userId !== userId) throw new ForbiddenException('Unauthorized');

    return this.prisma.apartment.update({
      where: { id },
      data: {
        ...(data.bathroom !== undefined && { bathroom: data.bathroom }),
        ...(data.noOfBalcony !== undefined && { noOfBalcony: data.noOfBalcony }),
        ...(data.waterSupply !== undefined && { waterSupply: data.waterSupply }),
        ...(data.petAllowed !== undefined && { petAllowed: data.petAllowed }),
        ...(data.gymAllowed !== undefined && { gymAllowed: data.gymAllowed }),
        ...(data.nonVegAllowed !== undefined && { nonVegAllowed: data.nonVegAllowed }),
        ...(data.gateSecurity !== undefined && { gateSecurity: data.gateSecurity }),
        ...(data.shownBy !== undefined && { shownBy: data.shownBy }),
        ...(data.propertyCondition !== undefined && { propertyCondition: data.propertyCondition }),
        ...(data.secondaryNumber !== undefined && { secondaryNumber: data.secondaryNumber }),
        ...(data.unitsPropertiesAvailable !== undefined && { unitsPropertiesAvailable: data.unitsPropertiesAvailable }),
        ...(data.directions !== undefined && { directions: data.directions }),
        ...(data.amenities !== undefined && { amenities: Array.isArray(data.amenities) ? data.amenities : [] }),
      },
    });
  }

  async getMyApartments(userId: number) {
    return this.prisma.apartment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async saveImages(id: number, userId: number, images: string[]) {
    await this.checkPropertyOwner(id, userId);
    return this.prisma.apartment.update({ where: { id }, data: { images } });
  }

  async saveVideo(id: number, userId: number, video: string) {
    await this.checkPropertyOwner(id, userId);
    return this.prisma.apartment.update({ where: { id }, data: { video } });
  }

  async addPhotos(id: number, photos: string[], userId: number) {
    const apartment = await this.prisma.apartment.findUnique({ where: { id } });
    if (!apartment) throw new NotFoundException('Apartment not found');
    if (apartment.userId !== userId) throw new ForbiddenException('Unauthorized');
    return this.prisma.apartment.update({ where: { id }, data: { images: photos } });
  }

  async saveAvailability(id: number, userId: number, dto: ApartmentDto) {
    await this.checkPropertyOwner(id, userId);
    return this.prisma.apartment.update({
      where: { id },
      data: {
        availabilityDay: dto.availabilityDay,
        startTime: dto.startTime,
        endTime: dto.endTime,
        availableAllDay: dto.availableAllDay,
      },
    });
  }

  async deleteApartment(id: number, userId: number) {
    const apartment = await this.prisma.apartment.findUnique({ where: { id } });
    if (!apartment) throw new NotFoundException('Apartment not found');
    if (apartment.userId !== userId) throw new ForbiddenException('Unauthorized');
    return this.prisma.apartment.delete({ where: { id } });
  }

  async recordUniqueView(propertyId: number, userId: number) {
    console.log('VIEW PROPERTY:', propertyId);
    console.log('VIEW USER:', userId);

    const existingView = await this.prisma.propertyView.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId,
        },
      },
    });

    console.log('EXISTING VIEW:', existingView);

    if (existingView) {
      console.log('ALREADY VIEWED');
      return { alreadyViewed: true };
    }

    console.log('NEW VIEW');

    await this.prisma.propertyView.create({
      data: {
        userId,
        propertyId,
      },
    });

    await this.prisma.apartment.update({
      where: { id: propertyId },
      data: {
        viewscount: {
          increment: 1,
        },
      },
    });

    return { alreadyViewed: false };
  }

  // PRIVATE HELPER
  private async checkPropertyOwner(id: number, userId: number) {
    const apartment = await this.prisma.apartment.findUnique({ where: { id } });
    if (!apartment) throw new NotFoundException('Apartment not found');
    if (apartment.userId !== userId) throw new ForbiddenException('Unauthorized');
    return apartment;
  }

  async markSoldOut(
    apartmentId: number,
    userId: number,
    reason: string,
  ) {
    const apartment =
      await this.prisma.apartment.findFirst({
        where: {
          id: apartmentId,
          userId,
        },
      });

    if (!apartment) {
      throw new BadRequestException(
        'Apartment not found',
      );
    }

    return this.prisma.apartment.update({
      where: {
        id: apartmentId,
      },
      data: {
        isSoldOut: true,
        soldOutReason: reason,
        soldOutAt: new Date(),
      },
    });
  }
}