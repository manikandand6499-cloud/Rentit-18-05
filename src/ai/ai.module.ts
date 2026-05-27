import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { LikeModule } from '../like/like.module';
import { VisitModule } from '../visit/visit.module';

@Module({
  imports: [
    LikeModule,
    VisitModule,
  ],
  controllers: [AiController],
  providers: [AiService, PrismaService],
  exports: [AiService],
})
export class AiModule {}