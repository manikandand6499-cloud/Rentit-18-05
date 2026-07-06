import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

export type LikeType =
  | 'pg'
  | 'flatmate';

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
    return this.prisma.like.findMany({
      where: {
        userId,
      },

      include: {
        property: true,
        flatmate: true,
      },

     orderBy: {
  id: 'desc',
},
    });
  }
}