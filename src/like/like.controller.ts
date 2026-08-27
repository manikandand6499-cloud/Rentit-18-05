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

import { OptionalJwtAuthGuard } from '../auth/jwt-auth.guard';
import { LikeService } from './like.service';
import type { LikeType } from './like.service';

const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

@Controller(['like', 'likes'])
@UseGuards(OptionalJwtAuthGuard)
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':propertyId')
  toggleLike(
    @Param('propertyId', ParseIntPipe)
    propertyId: number,

    @Query('type')
    type: LikeType = 'auto',

    @Query('userId')
    queryUserId: string,

    @GetUser()
    user: any,

    @Req()
    req: any,
  ) {
    const userId =
      user?.userId ??
      user?.id ??
      (req.headers['x-user-id'] ? Number(req.headers['x-user-id']) : null) ??
      (queryUserId ? Number(queryUserId) : null);

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
  getMyLikes(
    @Req() req: any,
    @GetUser() user: any,
    @Query('userId') queryUserId: string,
  ) {
    const userId =
      user?.userId ??
      user?.id ??
      (req.headers['x-user-id'] ? Number(req.headers['x-user-id']) : null) ??
      (queryUserId ? Number(queryUserId) : null);

    if (!userId) {
      return [];
    }

    return this.likeService.getMyLikes(
      userId,
    );
  }

  @Get('user/:userId')
  getUserLikesByRoute(
    @Param('userId', ParseIntPipe)
    userId: number,
  ) {
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