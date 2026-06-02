import {
  Controller,
  Get,
  Put,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserLocationDto } from './dto/location.dto';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get('me')
  getMe(@Req() req) {
    return this.userService.getUser(
      req.user.userId,
    );
  }

  @Put('complete-profile')
  completeProfile(
    @Req() req,
    @Body() body,
  ) {
    return this.userService.completeProfile(
      req.user.userId,
      body,
    );
  }

  @Put('location')
  updateLocation(
    @Req() req,
    @Body() dto: UpdateUserLocationDto,
  ) {
    return this.userService.updateLocation(
      req.user.userId,
      dto,
    );
  }
}