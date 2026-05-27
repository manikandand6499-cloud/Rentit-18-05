// like.controller.ts

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
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LikeService } from './like.service';

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
    @Param('propertyId', ParseIntPipe) propertyId: number,
    @Query('type') type: 'pg' | 'flatmate' = 'pg',
    @GetUser() user: any,
  ) {
    const userId = user?.userId ?? user?.id;
    return this.likeService.toggleLike(userId, propertyId, type);
  }

  @Get('my')
  async getMyLikes(@Req() req: any) {
    const userId = req.user?.userId ?? req.user?.id;

    if (!userId) {
      throw new Error('User ID not found in JWT token');
    }

    return this.likeService.getMyLikes(userId);
  }
  @Get(":userId")
getUserLikes(
  @Param("userId", ParseIntPipe) userId: number,
) {
  return this.likeService.getMyLikes(userId);
}
}