import { Module } from '@nestjs/common';

import { FlatmateController } from './flatmate.controller';
import { FlatmateService } from './flatmate.service';

import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [FlatmateController],

  providers: [
    FlatmateService,
    PrismaService,
  ],
})
export class FlatmateModule {}