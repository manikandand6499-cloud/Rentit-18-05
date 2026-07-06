import { Module } from "@nestjs/common";
import { VisitController } from "./visit.controller";
import { VisitService } from "./visit.service";
import { PrismaService } from "../prisma/prisma.service";
import { NotificationModule } from "../notification/notification.module";

@Module({
  imports: [NotificationModule],
  controllers: [VisitController],
  providers: [VisitService, PrismaService],
  exports: [VisitService], // ← required so AiModule can inject it
})
export class VisitModule {}