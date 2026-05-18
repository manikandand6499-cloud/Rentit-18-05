import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateCommercialDto } from "./dto/create-commercial.dto";
import { UpdateCommercialDto } from "./dto/update-commercial.dto";

@Injectable()
export class CommercialService {
  constructor(private readonly prisma: PrismaService) {}

  // ──────────────────────────────────────────────
  // CREATE
  // ──────────────────────────────────────────────

  async create(userId: number, dto: CreateCommercialDto) {
    return this.prisma.commercial.create({
      data: {
        userId,
        city: dto.city ?? "",
        locality: dto.locality,
        street: dto.street,
        landmark: dto.landmark,
        latitude: dto.latitude,
        longitude: dto.longitude,
        commercialPropertyType: dto.commercialPropertyType,
        propertyType: dto.propertyType,
        buildingType: dto.buildingType,
        propertyAge: dto.propertyAge,
        floor: dto.floor,
        totalFloor: dto.totalFloor,
        builtUpArea: dto.builtUpArea,
        furnishing: dto.furnishing,
        slots: dto.slots,
        otherFeatures: dto.otherFeatures,
        commercialOtherFeatures: dto.commercialOtherFeatures,
        rentType: dto.rentType,
        expectedRent: dto.expectedRent,
        deposit: dto.deposit,
        maintenanceAmount: dto.maintenanceAmount,
        maintenance: dto.maintenance,
        rentNegotiable: dto.rentNegotiable,
        depositNegotiable: dto.depositNegotiable,
        maintenanceExtra: dto.maintenanceExtra,
        leaseDuration: dto.leaseDuration,
        lockinPeriod: dto.lockinPeriod,
        availableFrom: dto.availableFrom,
        idealFor: dto.idealFor,
        addOthertags: dto.addOthertags,
        contactName: dto.contactName,
        mobileNo: dto.mobileNo,
        whatsapp: dto.whatsapp,
        images: dto.images ?? [],
        video: dto.video,
        description: dto.description,
        currentStep: dto.currentStep ?? 1,
        isDraft: dto.isDraft ?? true,
      },
    });
  }

  // ──────────────────────────────────────────────
  // FIND ALL
  // ──────────────────────────────────────────────

  async findAll() {
    return this.prisma.commercial.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  // ──────────────────────────────────────────────
  // FIND ONE
  // ──────────────────────────────────────────────

  async findOne(id: number) {
    const property = await this.prisma.commercial.findUnique({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException(`Commercial property #${id} not found`);
    }

    return property;
  }

  // ──────────────────────────────────────────────
  // CHECK OWNER
  // ──────────────────────────────────────────────

  async checkOwner(id: number, userId: number) {
    const property = await this.prisma.commercial.findFirst({
      where: { id, userId },
    });

    if (!property) {
      throw new NotFoundException(`Commercial property #${id} not found`);
    }

    return property;
  }

  // ──────────────────────────────────────────────
  // UPDATE
  // ──────────────────────────────────────────────

  async update(id: number, dto: UpdateCommercialDto) {
    await this.findOne(id);

    return this.prisma.commercial.update({
      where: { id },
      data: {
        // Location
        city: dto.city,
        locality: dto.locality,
        street: dto.street,
        landmark: dto.landmark,
        latitude: dto.latitude,
        longitude: dto.longitude,

        // Property Details
        commercialPropertyType: dto.commercialPropertyType,
        propertyType: dto.propertyType,
        buildingType: dto.buildingType,
        propertyAge: dto.propertyAge,
        floor: dto.floor,
        totalFloor: dto.totalFloor,
        builtUpArea: dto.builtUpArea,
        furnishing: dto.furnishing,
        slots: dto.slots,
        otherFeatures: dto.otherFeatures,
        commercialOtherFeatures: dto.commercialOtherFeatures,

        // Rent Details
        rentType: dto.rentType,
        expectedRent: dto.expectedRent,
        deposit: dto.deposit,
        maintenanceAmount: dto.maintenanceAmount,
        maintenance: dto.maintenance,
        rentNegotiable: dto.rentNegotiable,
        depositNegotiable: dto.depositNegotiable,
        maintenanceExtra: dto.maintenanceExtra,
        leaseDuration: dto.leaseDuration,
        lockinPeriod: dto.lockinPeriod,

        // Availability
        availableFrom: dto.availableFrom,
        availabilityDay: dto.availabilityDay,
        startTime: dto.startTime,
        endTime: dto.endTime,
        availableAllDay: dto.availableAllDay,

        // Other Details
        idealFor: dto.idealFor,
        addOthertags: dto.addOthertags,
        description: dto.description,

        // Contact
        contactName: dto.contactName,
        mobileNo: dto.mobileNo,
        whatsapp: dto.whatsapp,

        // Media
        images: dto.images,
        video: dto.video,

        // Meta
        currentStep: dto.currentStep,
        isDraft: dto.isDraft,
      },
    });
  }

  // ──────────────────────────────────────────────
  // SAVE IMAGES
  // ──────────────────────────────────────────────

 async saveImages(id: number, userId: number, images: string[]) {
  await this.checkOwner(id, userId);

  return this.prisma.commercial.update({
    where: { id },
    data: {
      images,
      currentStep: 5,
    },
  });
}

  // ──────────────────────────────────────────────
  // SAVE VIDEO
  // ──────────────────────────────────────────────

  async saveVideo(id: number, userId: number, video: string) {
    await this.checkOwner(id, userId);

    return this.prisma.commercial.update({
      where: { id },
      data: { video },
    });
  }

  // ──────────────────────────────────────────────
  // SAVE CONTACT
  // ──────────────────────────────────────────────

  async saveContact(id: number, userId: number, dto: UpdateCommercialDto) {
    await this.checkOwner(id, userId);

    return this.prisma.commercial.update({
      where: { id },
      data: {
        contactName: dto.contactName,
        mobileNo: dto.mobileNo,
        whatsapp: dto.whatsapp,
        currentStep: 6,
        isDraft: false,
      },
    });
  }

  // ──────────────────────────────────────────────
  // SAVE AVAILABILITY
  // ──────────────────────────────────────────────

  async saveAvailability(id: number, userId: number, dto: UpdateCommercialDto) {
    await this.checkOwner(id, userId);

    return this.prisma.commercial.update({
      where: { id },
      data: {
        availabilityDay: dto.availabilityDay,
        startTime: dto.startTime,
        endTime: dto.endTime,
        availableAllDay: dto.availableAllDay,
        currentStep: 7,
        isDraft: false,
      },
    });
  }

  // ──────────────────────────────────────────────
  // DELETE
  // ──────────────────────────────────────────────

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.commercial.delete({
      where: { id },
    });
  }
}