import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from "@nestjs/common";
import { IsNotEmpty, IsString } from "class-validator";
import { VisitService } from "./visit.service";
import { CreateVisitDto } from "./dto/create-visit.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

class RescheduleVisitDto {
  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsString()
  time: string;
}

@Controller("visit")
@UseGuards(JwtAuthGuard)
export class VisitController {
  constructor(private readonly visitService: VisitService) {}

  // ─────────────────────────────────────────────────────────────────
  // POST /visit  →  Create new visit booking
  // ─────────────────────────────────────────────────────────────────
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Req() req: any, @Body() dto: CreateVisitDto) {
    const userId: number = req.user?.userId ?? req.user?.id;

    if (!userId) {
      throw new BadRequestException("User not authenticated");
    }

    return this.visitService.createVisit(userId, dto);
  }

  // ─────────────────────────────────────────────────────────────────
  // GET /visit/my  →  Get all visits for current user
  // ─────────────────────────────────────────────────────────────────
  @Get("my")
  @HttpCode(HttpStatus.OK)
  getMyVisits(@Req() req: any) {
    const userId: number = req.user?.userId ?? req.user?.id;

    if (!userId) {
      throw new BadRequestException("User not authenticated");
    }

    return this.visitService.getMyVisits(userId);
  }

  // ─────────────────────────────────────────────────────────────────
  // PATCH /visit/:id/reschedule  →  Reschedule an existing visit
  // ─────────────────────────────────────────────────────────────────
  @Patch(":id/reschedule")
  @HttpCode(HttpStatus.OK)
  rescheduleVisit(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: any,
    @Body() body: RescheduleVisitDto
  ) {
    const userId: number = req.user?.userId ?? req.user?.id;

    if (!userId) {
      throw new BadRequestException("User not authenticated");
    }

    if (!body?.date || !body?.time) {
      throw new BadRequestException(
        "date and time are required in request body"
      );
    }

    return this.visitService.rescheduleVisit(id, userId, body.date, body.time);
  }

  // ─────────────────────────────────────────────────────────────────
  // PATCH /visit/:id/cancel  →  Cancel a visit
  // ─────────────────────────────────────────────────────────────────
  @Patch(":id/cancel")
  @HttpCode(HttpStatus.OK)
  cancelVisit(@Param("id", ParseIntPipe) id: number) {
    return this.visitService.cancelVisit(id);
  }



  @Get('owner')
@HttpCode(HttpStatus.OK)
getOwnerVisits(@Req() req: any) {
  const userId: number = req.user?.userId ?? req.user?.id;
  if (!userId) throw new BadRequestException('User not authenticated');
  return this.visitService.getVisitsForOwner(userId);
}

}