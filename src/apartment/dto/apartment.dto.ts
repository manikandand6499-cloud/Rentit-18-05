import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ApartmentDto {
  // LOCATION

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

  // PROPERTY

  @IsOptional()
  @IsString()
  propertyType2?: string;

  @IsOptional()
  @IsString()
  apartmentType?: string;

  @IsOptional()
  @IsString()
  buildingType?: string;

  @IsOptional()
  @IsString()
  bhkType?: string;

  @IsOptional()
  @IsNumber()
  floor?: number;

  @IsOptional()
  @IsNumber()
  totalFloor?: number;

  @IsOptional()
  @IsNumber()
  builtUpArea?: number;

  @IsOptional()
  @IsString()
  propertyAge?: string;

  @IsOptional()
  @IsString()
  facing?: string;

  // RENT

  @IsOptional()
  @IsString()
  rentType?: string;

  @IsOptional()
  @IsNumber()
  expectedRent?: number;

  @IsOptional()
  @IsNumber()
  deposit?: number;

  @IsOptional()
  @IsNumber()
  maintenanceAmount?: number;

  @IsOptional()
  @IsString()
  maintenance?: string;

  @IsOptional()
  @IsBoolean()
  rentNegotiable?: boolean;

  @IsOptional()
  @IsString()
  availableFrom?: string;

  @IsOptional()
  @IsArray()
  preferredTenant?: string[];

  @IsOptional()
  otherFeatures?: any;

  // EXTRA

  @IsOptional()
  @IsString()
  furnishing?: string;

  @IsOptional()
  @IsString()
  parking?: string;

  @IsOptional()
  @IsString()
  description?: string;

  // ADDITIONAL

  @IsOptional()
  @IsNumber()
  bathroom?: number;

  @IsOptional()
  @IsNumber()
  noOfBalcony?: number;

  @IsOptional()
  waterSupply?: any;

  @IsOptional()
  @IsBoolean()
  petAllowed?: boolean;

  @IsOptional()
  @IsBoolean()
  gymAllowed?: boolean;

  @IsOptional()
  @IsBoolean()
  nonVegAllowed?: boolean;

  @IsOptional()
  @IsBoolean()
  gateSecurity?: boolean;

  @IsOptional()
  @IsString()
  shownBy?: string;

  @IsOptional()
  propertyCondition?: any;

  @IsOptional()
  @IsString()
  secondaryNumber?: string;

  @IsOptional()
  @IsBoolean()
  unitsPropertiesAvailable?: boolean;

  @IsOptional()
  @IsString()
  directions?: string;

  @IsOptional()
  @IsArray()
  amenities?: string[];

  @IsOptional()
  images?: string[];

  @IsOptional()
  video?: string;


    @IsOptional()
  availabilityDay?: any;

  @IsOptional()
  startTime?: string;

  @IsOptional()
  endTime?: string;

  @IsOptional()
  availableAllDay?: boolean;
}