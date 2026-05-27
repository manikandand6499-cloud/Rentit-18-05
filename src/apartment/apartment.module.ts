import { Module } from '@nestjs/common';

import { ApartmentController } from './apartment.controller';
import { ApartmentService } from './apartment.service';

import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ApartmentController],
  providers: [
    ApartmentService,
    PrismaService,
  ],
})
export class ApartmentModule {}