import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCommercialDto } from "./dto/create-commercial.dto";
import { UpdateCommercialDto } from "./dto/update-commercial.dto";

@Injectable()
export class CommercialService {
  constructor(private readonly prisma: PrismaService) {}

  // ──────────────────────────────────────────────
  // PRIVATE HELPERS
  // ──────────────────────────────────────────────

  /** Throws NotFoundException if the record doesn't exist. */
  private async assertExists(id: number) {
    const property = await this.prisma.commercial.findUnique({ where: { id } });
    if (!property) {
      throw new NotFoundException(`Commercial property #${id} not found`);
    }
    return property;
  }

  /** Throws ForbiddenException if the user doesn't own the record. */
  private async assertOwner(id: number, userId: number) {
    const property = await this.prisma.commercial.findFirst({
      where: { id, userId },
    });
    if (!property) {
      throw new ForbiddenException(
        `You do not have permission to modify commercial property #${id}`
      );
    }
    return property;
  }

  // ──────────────────────────────────────────────
  // CREATE
  // ──────────────────────────────────────────────

  async create(userId: number, dto: CreateCommercialDto) {
    return this.prisma.commercial.create({
      data: {
        userId,
        viewscount: 0,

        // Location
        city: dto.city ?? "",
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
        idealFor: dto.idealFor,
        addOthertags: dto.addOthertags,

        // Contact
        contactName: dto.contactName,
        mobileNo: dto.mobileNo,
        whatsapp: dto.whatsapp,

        // Media
        images: dto.images ?? [],
        video: dto.video,

        // Description
        description: dto.description,

        // Meta
        currentStep: dto.currentStep ?? 1,
        isDraft: dto.isDraft ?? true,
      },
    });
  }

  // ──────────────────────────────────────────────
  // FIND ALL  (published listings only)
  // ──────────────────────────────────────────────
async findAll() {
  const data = await this.prisma.commercial.findMany({
    where: {
      isDraft: false,
      OR: [
        { isSoldOut: false },
        { isSoldOut: null },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
    },
  });

  console.log(
    "COMMERCIAL LIST =>",
    data.map(x => ({
      id: x.id,
      isSoldOut: x.isSoldOut,
    })),
  );

  return data;
}

  // ──────────────────────────────────────────────
  // FIND ONE
  // ──────────────────────────────────────────────

  async findOne(id: number) {
    const property = await this.prisma.commercial.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!property) {
      throw new NotFoundException(`Commercial property #${id} not found`);
    }

    return property;
  }

  // ──────────────────────────────────────────────
  // UPDATE  (admin / internal use — no ownership check)
  // ──────────────────────────────────────────────

  async update(id: number, dto: UpdateCommercialDto) {
    await this.assertExists(id);

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

        // Other
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
    await this.assertOwner(id, userId);

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
    await this.assertOwner(id, userId);

    return this.prisma.commercial.update({
      where: { id },
      data: { video },
    });
  }

  // ──────────────────────────────────────────────
  // SAVE CONTACT
  // ──────────────────────────────────────────────

  async saveContact(id: number, userId: number, dto: UpdateCommercialDto) {
    await this.assertOwner(id, userId);

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
    await this.assertOwner(id, userId);

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
  // INCREMENT VIEWS
  // ──────────────────────────────────────────────

  async incrementViews(id: number) {
    await this.assertExists(id);

    return this.prisma.commercial.update({
      where: { id },
      data: {
        viewscount: { increment: 1 },
      },
      select: {
        id: true,
        viewscount: true,
      },
    });
  }

  // ──────────────────────────────────────────────
  // DELETE
  // ──────────────────────────────────────────────

  async remove(id: number) {
    await this.assertExists(id);

    return this.prisma.commercial.delete({
      where: { id },
    });
  }

async markSoldOut(
  commercialId: number,
  userId: number,
  reason: string,
) {
  console.log("COMMERCIAL ID =>", commercialId);
  console.log("USER ID =>", userId);

  const property =
    await this.prisma.commercial.findFirst({
      where: {
        id: commercialId,
        userId,
      },
    });

console.log("DB PROPERTY =>", property);
console.log("REQUEST USER =>", userId);

  if (!property) {
    throw new BadRequestException(
      "Commercial property not found",
    );
  }

  return this.prisma.commercial.update({
    where: {
      id: commercialId,
    },
    data: {
      isSoldOut: true,
      soldOutReason: reason,
      soldOutAt: new Date(),
    },
  });
}
}