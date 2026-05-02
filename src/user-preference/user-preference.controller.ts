import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserPreferenceService } from './user-preference.service';
import { SavePreferenceDto } from './dto/save-preference.dto';

@Controller('preferences')
export class UserPreferenceController {
  constructor(private service: UserPreferenceService) {}

  @Post()
  save(@Body() dto: SavePreferenceDto) {
    return this.service.save(dto);
  }

  @Get(':userId')
  get(@Param('userId') userId: string) {
    return this.service.get(Number(userId));
  }

  @Get('recommend/:userId')
  recommended(@Param('userId') userId: string) {
    return this.service.getRecommended(Number(userId));
  }
}