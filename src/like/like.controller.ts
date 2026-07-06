import {
  Controller,
  Post,
  Get,
  Param,
  Req,
  UseGuards,
  ParseIntPipe,
  Query,
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LikeService } from './like.service';
import type { LikeType } from './like.service';

const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

@Controller('like')
@UseGuards(JwtAuthGuard)
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':propertyId')
  toggleLike(
    @Param('propertyId', ParseIntPipe)
    propertyId: number,

    @Query('type')
    type: LikeType = 'pg',

    @GetUser()
    user: any,
  ) {
    const userId = user?.userId ?? user?.id;

    if (!userId) {
      throw new BadRequestException(
        'User ID not found',
      );
    }

    return this.likeService.toggleLike(
      userId,
      propertyId,
      type,
    );
  }

  @Get('my')
  getMyLikes(@Req() req: any) {
    const userId =
      req.user?.userId ??
      req.user?.id;

    return this.likeService.getMyLikes(
      userId,
    );
  }

  @Get(':userId')
  getUserLikes(
    @Param('userId', ParseIntPipe)
    userId: number,
  ) {
    return this.likeService.getMyLikes(
      userId,
    );
  }
}