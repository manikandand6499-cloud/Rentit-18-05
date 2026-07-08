import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

export type LikeType =
  | 'pg'
  | 'flatmate'
  | 'apartment'
  | 'commercial';

@Injectable()
export class LikeService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async toggleLike(
    userId: number,
    propertyId: number,
    type: LikeType = 'pg',
  ) {
    if (type === 'flatmate') {
      const flatmate =
        await this.prisma.flatmate.findUnique({
          where: {
            id: propertyId,
          },
        });

      if (!flatmate) {
        throw new NotFoundException(
          `Flatmate ${propertyId} not found`,
        );
      }

      const existing =
        await this.prisma.like.findUnique({
          where: {
            userId_flatmateId: {
              userId,
              flatmateId: propertyId,
            },
          },
        });

      if (existing) {
        await this.prisma.like.delete({
          where: {
            id: existing.id,
          },
        });

        return {
          success: true,
          liked: false,
        };
      }

      await this.prisma.like.create({
        data: {
          userId,
          flatmateId: propertyId,
        },
      });

      return {
        success: true,
        liked: true,
      };
    }

    if (type === 'apartment') {
      const apartment =
        await this.prisma.apartment.findUnique({
          where: {
            id: propertyId,
          },
        });

      if (!apartment) {
        throw new NotFoundException(
          `Apartment ${propertyId} not found`,
        );
      }

      const existing =
        await this.prisma.like.findFirst({
          where: {
            userId,
            apartmentId: propertyId,
          },
        });

      if (existing) {
        await this.prisma.like.delete({
          where: {
            id: existing.id,
          },
        });

        return {
          success: true,
          liked: false,
        };
      }

      await this.prisma.like.create({
        data: {
          userId,
          apartmentId: propertyId,
        },
      });

      return {
        success: true,
        liked: true,
      };
    }

    if (type === 'commercial') {
      const commercial =
        await this.prisma.commercial.findUnique({
          where: {
            id: propertyId,
          },
        });

      if (!commercial) {
        throw new NotFoundException(
          `Commercial ${propertyId} not found`,
        );
      }

      const existing =
        await this.prisma.like.findFirst({
          where: {
            userId,
            commercialId: propertyId,
          },
        });

      if (existing) {
        await this.prisma.like.delete({
          where: {
            id: existing.id,
          },
        });

        return {
          success: true,
          liked: false,
        };
      }

      await this.prisma.like.create({
        data: {
          userId,
          commercialId: propertyId,
        },
      });

      return {
        success: true,
        liked: true,
      };
    }

    // Default to PG ('pg')
    const property =
      await this.prisma.pGDetails.findUnique({
        where: {
          id: propertyId,
        },
      });

    if (!property) {
      throw new NotFoundException(
        `Property ${propertyId} not found`,
      );
    }

    const existing =
      await this.prisma.like.findUnique({
        where: {
          userId_propertyId: {
            userId,
            propertyId,
          },
        },
      });

    if (existing) {
      await this.prisma.like.delete({
        where: {
          id: existing.id,
        },
      });

      return {
        success: true,
        liked: false,
      };
    }

    await this.prisma.like.create({
      data: {
        userId,
        propertyId,
      },
    });

    return {
      success: true,
      liked: true,
    };
  }

  async getMyLikes(userId: number) {
    const likes = await this.prisma.like.findMany({
      where: {
        userId,
      },

      include: {
        property: true,
        flatmate: true,
        Apartment: true,
        Commercial: true,
      },

      orderBy: {
        id: 'desc',
      },
    });

    return likes.map((like: any) => {
      return {
        ...like,
        apartment: like.Apartment || null,
        commercial: like.Commercial || null,
      };
    });
  }
}