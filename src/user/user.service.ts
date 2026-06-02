// user.service.ts

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserLocationDto } from './dto/location.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // ─────────────────────────────────────────
  // GET CURRENT USER
  // ─────────────────────────────────────────
  async getUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        isProfileComplete: true,
        city: true,
        area: true,
        locality: true,
        latitude: true,
        longitude: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    console.log('🔥 USER FROM DB:', user);

    return user;
  }

  // ─────────────────────────────────────────
  // COMPLETE PROFILE
  // ─────────────────────────────────────────
  async completeProfile(
    userId: number,
    data: {
      name: string;
      email: string;
    },
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        isProfileComplete: true,
      },
    });
  }

  // ─────────────────────────────────────────
  // UPDATE LOCATION
  // ─────────────────────────────────────────
  async updateLocation(
    userId: number,
    dto: UpdateUserLocationDto,
  ) {
    console.log('🔥 LOCATION DTO:', dto);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser =
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          latitude: dto.latitude,
          longitude: dto.longitude,
          city: dto.city ?? null,
          locality: dto.locality ?? null,
          area: dto.area ?? null,
        },
      });

    console.log(
      '✅ LOCATION SAVED:',
      updatedUser,
    );

    return {
      success: true,
      message: 'Location updated successfully',
      data: updatedUser,
    };
  }
}