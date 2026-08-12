import { IsOptional, IsString, IsNumber, IsBoolean, IsArray } from 'class-validator';

export class UpdatePropertyDto {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  locality?: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  landmark?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  propertyName?: string;

  @IsOptional()
  @IsString()
  propertyType?: string;

  @IsOptional()
  roomType?: any;

  @IsOptional()
  @IsBoolean()
  foodIncluded?: boolean;

  @IsOptional()
  foodType?: any;

  @IsOptional()
  pgAmenities?: any;

  @IsOptional()
  @IsString()
  parking?: string;

  @IsOptional()
  availableFrom?: any;

  @IsOptional()
  @IsNumber()
  noticePeriod?: number;

  @IsOptional()
  gateClosingTime?: any;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  video?: string;

  @IsOptional()
  @IsString()
  contactName?: string;

  @IsOptional()
  @IsString()
  mobileNo?: string;

  @IsOptional()
  @IsBoolean()
  whatsapp?: boolean;

  @IsOptional()
  @IsBoolean()
  whatsappupdates?: boolean;

  @IsOptional()
  preferredTenant?: any;

  @IsOptional()
  preferredGuests?: any;

  @IsOptional()
  restrictions?: any;

  @IsOptional()
  @IsString()
  propertyDescription?: string;

  @IsOptional()
  @IsNumber()
  currentStep?: number;

  @IsOptional()
  @IsBoolean()
  isDraft?: boolean;

  @IsOptional()
  @IsString()
  propertyType2?: string;

  @IsOptional()
  availabilityDay?: any;

  @IsOptional()
  @IsBoolean()
  availableAllDay?: boolean;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;
}
