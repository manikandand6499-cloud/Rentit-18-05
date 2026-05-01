// property.controller.ts
import {
  Controller,
  Post,
  Put,
  Get,
  Param,
  Body,
  Req,
  UseGuards,
  UploadedFiles,
  UploadedFile,
  UseInterceptors,
  Query,
  BadRequestException,
} from '@nestjs/common';

import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';

import { PropertyService } from './property.service';
import { CreateBasicDto } from './dto/create-basic.dto';
import { CreateDetailsDto } from './dto/create-details.dto';
import { CreateAmenitiesDto } from './dto/create-amenities.dto';
import { CreateContactDto } from './dto/create-contact.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateLocationDto } from './dto/location.dto';

import { uploadToR2 } from 'src/common/s3.upload';

@Controller('property')
@UseGuards(JwtAuthGuard)
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  /*
  ==============================
  CREATE BASIC
  ==============================
  */
  @Post('basic')
  createBasic(@Req() req, @Body() dto: CreateBasicDto) {
    return this.propertyService.createBasic(req.user.userId, dto);
  }

  /*
  ==============================
  LOCATION
  ==============================
  */
  @Put('location/:id')
  updateLocation(@Param('id') id: string, @Req() req, @Body() dto: UpdateLocationDto) {
    return this.propertyService.updateLocation(Number(id), req.user.userId, dto);
  }

  /*
  ==============================
  DETAILS
  ==============================
  */
  @Put(':id/details')
  updateDetails(@Param('id') id: string, @Req() req, @Body() dto: CreateDetailsDto) {
    return this.propertyService.updateDetails(Number(id), req.user.userId, dto);
  }

  /*
  ==============================
  AMENITIES
  ==============================
  */
  @Put(':id/amenities')
  updateAmenities(@Param('id') id: string, @Req() req, @Body() dto: CreateAmenitiesDto) {
    return this.propertyService.updateAmenities(Number(id), req.user.userId, dto);
  }

  /*
  ==============================
  UPLOAD IMAGES
  ==============================
  */
  @Post(':id/upload-images')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('existingImages') existingImages: string,
    @Req() req,
  ) {
    const oldImages = existingImages ? JSON.parse(existingImages) : [];
    const newUrls: string[] = [];

    for (const file of files) {
      const url = await uploadToR2(file);
      newUrls.push(url);
    }

    return this.propertyService.saveImages(
      Number(id),
      req.user.userId,
      [...oldImages, ...newUrls],
    );
  }

  /*
  ==============================
  UPLOAD VIDEO
  ==============================
  */
  @Post(':id/upload-video')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 100 * 1024 * 1024 } }))
  async uploadVideo(@Param('id') id: string, @Req() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("No video file");

    const url = await uploadToR2(file);

    return this.propertyService.saveVideo(Number(id), req.user.userId, url);
  }

  /*
  ==============================
  CONTACT
  ==============================
  */
  @Put(':id/contact')
  updateContact(@Param('id') id: string, @Req() req, @Body() dto: CreateContactDto) {
    return this.propertyService.updateContact(Number(id), req.user.userId, dto);
  }

  /*
  ==============================
  VERIFY
  ==============================
  */
  @Put(':id/verify')
  verifyProperty(@Param('id') id: string, @Req() req) {
    return this.propertyService.verifyProperty(Number(id), req.user.userId);
  }

  /*
  ==============================
  GET ALL
  ==============================
  */
  @Get('all')
  getAllProperties(@Req() req) {
    return this.propertyService.getAllProperties(req.user.userId);
  }

  /*
  ==============================
  MY PROPERTIES
  ==============================
  */
  @Get('my')
  getMyProperties(@Req() req) {
    return this.propertyService.getMyProperties(req.user.userId);
  }

  /*
  ==============================
  🔥 IMPORTANT FIX
  STATIC ROUTE FIRST
  ==============================
  */
  @Get('recently-viewed')
  getRecentlyViewed(@Req() req) {
    return this.propertyService.getRecentlyViewed(req.user.userId);
  }

  /*
  ==============================
  SINGLE PROPERTY
  ==============================
  */
  @Get(':id') // 🔥 ONLY NUMBER ALLOWED
  getProperty(@Param('id') id: string) {
    const numId = Number(id);

    if (!numId || isNaN(numId)) {
      throw new BadRequestException("Invalid property ID");
    }

    return this.propertyService.getProperty(numId);
  }

  /*
  ==============================
  DELETE
  ==============================
  */
  @Put(':id/delete')
  deleteProperty(@Param('id') id: string, @Req() req) {
    return this.propertyService.deleteProperty(Number(id), req.user.userId);
  }

  /*
  ==============================
  VIEW COUNT
  ==============================
  */
  @Post(':id/view')
  addView(@Param('id') id: string, @Req() req) {
    const numId = Number(id);

    if (!numId || isNaN(numId)) {
      throw new BadRequestException("Invalid property ID");
    }

    return this.propertyService.addView(numId, req.user.userId);
  }

  @Get('views/count')
getMyViews(@Req() req) {
  return this.propertyService.getMyTotalViews(req.user.id);
}

}