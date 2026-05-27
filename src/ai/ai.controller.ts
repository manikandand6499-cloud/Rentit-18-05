// src/ai/ai.controller.ts

import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';

import { AiService } from './ai.service';

@Controller('ai')

export class AiController {

  constructor(
    private aiService: AiService,
  ) {}

  // =========================================
  // MAIN SEARCH
  // =========================================

  @Post('search')

  @HttpCode(200)

  async search(

    @Body('query')
    query: string,

    @Body('userId')
    userId: number,

    @Body('language')
    language: string,

  ) {

    try {

      console.log(
        '🌐 CONTROLLER LANGUAGE =>',
        language,
      );

      console.log(
        '📝 QUERY =>',
        query,
      );

      console.log(
        '👤 USER ID =>',
        userId,
      );

      const uid =
        Number(userId) || 0;

      const result =

        await this.aiService.processWithGemini(

          query,

          uid,

          language || 'en',

        );

      return {

        success: true,

        ...result,

      };

    } catch (error: any) {

      console.log(
        '🔥 AI CONTROLLER ERROR =>',
        error,
      );

      console.log(
        '🔥 AI CONTROLLER ERROR MESSAGE =>',
        error?.message,
      );

      console.log(
        '🔥 AI CONTROLLER ERROR RESPONSE =>',
        error?.response?.data,
      );

      return {

        success: false,

        reply:
          'Backend crashed',

        error:
          error?.message ||
          'Unknown error',

      };
    }
  }

  // =========================================
  // DB SEARCH
  // =========================================

  @Post('db-search')

  dbSearch(
    @Body('query')
    query: string,
  ) {

    return this.aiService.dbSearch(
      query,
    );
  }

  // =========================================
  // RECOMMENDATIONS
  // =========================================

  @Get('recommendations')

  recommendations(

    @Query('city')
    city: string,

    @Query('budget')
    budget?: string,

    @Query('gender')
    gender?: string,

  ) {

    return this.aiService.getRecommendations(

      city,

      budget
        ? parseInt(budget)
        : undefined,

      gender,

    );
  }

  // =========================================
  // TRENDING
  // =========================================

  @Get('trending')

  trending(
    @Query('city')
    city?: string,
  ) {

    return this.aiService.getTrending(
      city,
    );
  }

  // =========================================
  // SIMILAR
  // =========================================

  @Get('similar/:id')

  similar(
    @Param('id', ParseIntPipe)
    id: number,
  ) {

    return this.aiService.getSimilar(
      id,
    );
  }

  // =========================================
  // VIEW COUNT
  // =========================================

  @Post('view/:id')

  view(
    @Param('id', ParseIntPipe)
    id: number,
  ) {

    return this.aiService.incrementView(
      id,
    );
  }
}