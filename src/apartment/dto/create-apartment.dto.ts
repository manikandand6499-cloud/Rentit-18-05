// import {
//   IsString,
//   IsOptional,
//   IsNumber,
//   IsBoolean,
//   IsArray,
// } from 'class-validator';

// export class CreateApartmentDto {
//   @IsString()
//   city: string;

//   @IsString()
//   locality: string;

//   @IsOptional()
//   @IsString()
//   street?: string;

//   @IsOptional()
//   @IsString()
//   landmark?: string;

//   @IsOptional()
//   @IsNumber()
//   latitude?: number;

//   @IsOptional()
//   @IsNumber()
//   longitude?: number;

//   @IsOptional()
//   @IsString()
//   apartmentType?: string;

//   @IsOptional()
//   @IsString()
//   bhkType?: string;

//   @IsOptional()
//   @IsNumber()
//   expectedRent?: number;

//   @IsOptional()
//   @IsNumber()
//   deposit?: number;

//   @IsOptional()
//   @IsBoolean()
//   rentNegotiable?: boolean;

//   @IsOptional()
//   @IsArray()
//   preferredTenant?: string[];

//   @IsOptional()
//   otherFeatures?: any;
// }



import { PartialType } from '@nestjs/mapped-types';
import { ApartmentDto } from './apartment.dto';

export class CreateApartmentDto extends PartialType(
  ApartmentDto,
) {}