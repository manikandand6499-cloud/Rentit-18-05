import { Module } from "@nestjs/common";

import { CommercialController } from "./commercial.controller";
import { CommercialService } from "./commercial.service";

import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [CommercialController],
  providers: [CommercialService, PrismaService],
})
export class CommercialModule {}