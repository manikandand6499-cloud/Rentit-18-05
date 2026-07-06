import { Module } from "@nestjs/common";
import { AiService } from "./ai.service";
import { AiController } from "./ai.controller";        // adjust if your file differs
import { PrismaService } from "../prisma/prisma.service";
import { LikeModule } from "../like/like.module";       // adjust if your file differs
import { VisitModule } from "../visit/visit.module";    // ← add this import

@Module({
  imports: [
    LikeModule,    // provides LikeService
    VisitModule,   // provides VisitService ← fix for the error
  ],
  controllers: [AiController],
  providers: [
    AiService,
    PrismaService,
  ],
})
export class AiModule {}