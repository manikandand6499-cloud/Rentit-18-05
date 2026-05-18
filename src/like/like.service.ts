// like.service.ts
// Supports both PG and Flatmate likes

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}

  async toggleLike(
    userId: number,
    propertyId: number,
    type: 'pg' | 'flatmate' = 'pg',
  ) {
    console.log('USER ID:', userId);
    console.log('PROPERTY ID:', propertyId);
    console.log('TYPE:', type);

    // ─────────────────────────────────────────────
    // FLATMATE LIKE
    // ─────────────────────────────────────────────
    if (type === 'flatmate') {
      // Check flatmate exists
      const flatmate = await this.prisma.flatmate.findUnique({
        where: {
          id: propertyId,
        },
      });

      if (!flatmate) {
        throw new NotFoundException(
          `Flatmate property with ID ${propertyId} not found`,
        );
      }

      // Check existing like
      const existing = await this.prisma.like.findUnique({
        where: {
          userId_flatmateId: {
            userId,
            flatmateId: propertyId,
          },
        },
      });

      // Unlike
      if (existing) {
        await this.prisma.like.delete({
          where: {
            id: existing.id,
          },
        });

        return {
          success: true,
          liked: false,
          message: 'Like removed',
        };
      }

      // Create like
      await this.prisma.like.create({
        data: {
          userId,
          flatmateId: propertyId,
        },
      });

      return {
        success: true,
        liked: true,
        message: 'Flatmate liked',
      };
    }

    // ─────────────────────────────────────────────
    // PG LIKE
    // ─────────────────────────────────────────────
    const pg = await this.prisma.pGDetails.findUnique({
      where: {
        id: propertyId,
      },
    });

    if (!pg) {
      throw new NotFoundException(
        `PG property with ID ${propertyId} not found`,
      );
    }

    const existing = await this.prisma.like.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId,
        },
      },
    });

    // Unlike
    if (existing) {
      await this.prisma.like.delete({
        where: {
          id: existing.id,
        },
      });

      return {
        success: true,
        liked: false,
        message: 'Like removed',
      };
    }

    // Create like
    await this.prisma.like.create({
      data: {
        userId,
        propertyId,
      },
    });

    return {
      success: true,
      liked: true,
      message: 'PG property liked',
    };
  }

  // ─────────────────────────────────────────────
  // GET MY LIKES
  // ─────────────────────────────────────────────
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
        createdAt: 'desc',
      },
    });
  }
}