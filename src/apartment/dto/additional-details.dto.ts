// import {
//   IsOptional,
//   IsBoolean,
//   IsNumber,
//   IsString,
//   IsArray,
// } from 'class-validator';

// export class AdditionalDetailsDto {

//   @IsOptional()
//   @IsNumber()
//   bathroom?: number;

//   @IsOptional()
//   @IsNumber()
//   noOfBalcony?: number;

//   @IsOptional()
//   waterSupply?: any;

//   @IsOptional()
//   @IsBoolean()
//   petAllowed?: boolean;

//   @IsOptional()
//   @IsBoolean()
//   gymAllowed?: boolean;

//   @IsOptional()
//   @IsBoolean()
//   nonVegAllowed?: boolean;

//   @IsOptional()
//   @IsBoolean()
//   gateSecurity?: boolean;

//   @IsOptional()
//   @IsString()
//   shownBy?: string;

//   @IsOptional()
//   propertyCondition?: any;

//   @IsOptional()
//   @IsString()
//   secondaryNumber?: string;

//   @IsOptional()
//   @IsBoolean()
//   unitsPropertiesAvailable?: boolean;

//   @IsOptional()
//   @IsString()
//   directions?: string;

//   @IsOptional()
//   @IsArray()
//   amenities?: string[];
// }


import { PartialType } from '@nestjs/mapped-types';
import { ApartmentDto } from './apartment.dto';

export class AdditionalDetailsDto extends PartialType(
  ApartmentDto,
) {}