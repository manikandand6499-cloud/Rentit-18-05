import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { NotificationService } from "./notification.service";

@Controller("notification")
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @Post("send")
  send(@Body() body: any) {
    return this.notificationService.send(body);
  }

  @Get("my")
  getMy(@Req() req: any) {
    return this.notificationService.getMy(
      req.user.userId,
    );
  }

  @Patch(":id/read")
  markRead(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.notificationService.markRead(id);
  }

  @Patch("read-all")
  markAllRead(@Req() req: any) {
    return this.notificationService.markAllRead(
      req.user.userId,
    );
  }

  @Delete(":id")
  delete(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.notificationService.delete(id);
  }
}