// user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserLocationDto } from 'src/user/dto/location.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // 👉 ✅ UPDATE LOCATION (FIXED)
async updateLocation(userId: number, dto: UpdateUserLocationDto) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new Error('User not found');
  }

  return this.prisma.user.update({
    where: { id: userId },
    data: {
      latitude: dto.latitude,
      longitude: dto.longitude,
      city: dto.city,
      locality: dto.locality,
      area: dto.area
    }
  });
}
  // 👉 Get current user
async getUser(userId: number) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      mobile: true,
      isProfileComplete: true,
      city: true,        // 🔥 MUST
      area: true,
      locality: true,
      latitude: true,
      longitude: true,
    },
  });

  console.log("🔥 USER FROM DB:", user); // debug

  return user;
}

  // 👉 Complete profile (name + email)
  async completeProfile(
    userId: number,
    data: { name: string; email: string },
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        isProfileComplete: true,
      },
    });
  }
}