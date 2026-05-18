import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';

import { ApartmentService } from './apartment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { AdditionalDetailsDto } from './dto/additional-details.dto';
import { ApartmentDto } from './dto/apartment.dto';

import { uploadToR2 } from 'src/common/s3.upload';

@Controller('apartment')
export class ApartmentController {
  constructor(
    private readonly apartmentService: ApartmentService,
  ) {}

  // =========================================================
  // CREATE APARTMENT
  // =========================================================
@UseGuards(JwtAuthGuard)
@Post()
create(
  @Body() dto: CreateApartmentDto,
  @Req() req,
) {
  console.log('REQ USER =>', req.user);

  if (!req.user) {
    throw new BadRequestException('User not found in request');
  }

  return this.apartmentService.createApartment(
    dto,
    req.user.id,
  );
}

@UseGuards(JwtAuthGuard)
@Get('my')
getMyApartments(@Req() req) {
  return this.apartmentService.getMyApartments(req.user.id);
}

  // =========================================================
  // GET ALL APARTMENTS
  // =========================================================
  @Get()
  findAll() {
    return this.apartmentService.getAllApartments();
  }

  // =========================================================
  // GET SINGLE APARTMENT
  // =========================================================
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.apartmentService.getApartment(id);
  }

  // =========================================================
  // UPDATE APARTMENT
  // =========================================================
@UseGuards(JwtAuthGuard)
@Put(':id')
update(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: UpdateApartmentDto,
  @Req() req,
) {
  // 🔍 Check what req.user actually contains
  console.log('REQ USER =>', req.user);
  console.log('REQ USER ID =>', req.user?.id);   // must be 1, not undefined
  console.log('APARTMENT ID =>', id);             // must be 4

  return this.apartmentService.updateApartment(id, dto, req.user.id);
}

  // =========================================================
  // ADDITIONAL DETAILS
  // =========================================================
  @UseGuards(JwtAuthGuard)
  @Put(':id/additional-details')
  additionalDetails(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: AdditionalDetailsDto,

    @Req() req,
  ) {
    return this.apartmentService.additionalDetails(
      id,
      dto,
      req.user.id,
    );
  }

  // =========================================================
  // UPLOAD IMAGES
  // =========================================================
  @UseGuards(JwtAuthGuard)
  @Post(':id/upload-images')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadImages(
    @Param('id', ParseIntPipe)
    id: number,

    @UploadedFiles()
    files: Express.Multer.File[],

    @Body('existingImages')
    existingImages: string,

    @Req() req,
  ) {
    const oldImages: string[] = existingImages
      ? JSON.parse(existingImages)
      : [];

    const newUrls: string[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const url = await uploadToR2(file);
        newUrls.push(url);
      }
    }

    return this.apartmentService.saveImages(
      id,
      req.user.id,
      [...oldImages, ...newUrls],
    );
  }

  // =========================================================
  // UPLOAD VIDEO
  // =========================================================
  @UseGuards(JwtAuthGuard)
  @Post(':id/upload-video')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
      },
    }),
  )
  async uploadVideo(
    @Param('id', ParseIntPipe)
    id: number,

    @UploadedFile()
    file: Express.Multer.File,

    @Req() req,
  ) {
    if (!file) {
      throw new BadRequestException(
        'No video file uploaded',
      );
    }

    const url = await uploadToR2(file);

    return this.apartmentService.saveVideo(
      id,
      req.user.id,
      url,
    );
  }

  // =========================================================
  // SAVE AVAILABILITY
  // =========================================================
  @UseGuards(JwtAuthGuard)
  @Put(':id/availability')
  saveAvailability(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: ApartmentDto,

    @Req() req,
  ) {
    return this.apartmentService.saveAvailability(
      id,
      req.user.id,
      dto,
    );
  }
}