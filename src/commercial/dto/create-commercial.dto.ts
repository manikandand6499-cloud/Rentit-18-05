import { IsOptional } from "class-validator";

export class CreateCommercialDto {
  @IsOptional()
  city?: string;

  @IsOptional()
  locality?: string;

  @IsOptional()
  street?: string;

  @IsOptional()
  landmark?: string;

  @IsOptional()
  latitude?: number;

  @IsOptional()
  longitude?: number;

  @IsOptional()
  commercialPropertyType?: string;

  @IsOptional()
  propertyType?: string;

  @IsOptional()
  buildingType?: string;

  @IsOptional()
  propertyAge?: string;

  @IsOptional()
  floor?: number;

  @IsOptional()
  totalFloor?: number;

  @IsOptional()
  builtUpArea?: number;

  @IsOptional()
  furnishing?: Record<string, any>;

  @IsOptional()
  slots?: string;

  @IsOptional()
  otherFeatures?: Record<string, any>;

  @IsOptional()
  commercialOtherFeatures?: string[];

  @IsOptional()
  rentType?: string;

  @IsOptional()
  expectedRent?: number;

  @IsOptional()
  deposit?: number;

  @IsOptional()
  maintenanceAmount?: number;

  @IsOptional()
  maintenance?: string;

  @IsOptional()
  rentNegotiable?: boolean;

  @IsOptional()
  depositNegotiable?: boolean;

  @IsOptional()
  maintenanceExtra?: boolean;

  @IsOptional()
  leaseDuration?: string;

  @IsOptional()
  lockinPeriod?: string;

@IsOptional()
viewscount?: number;

  @IsOptional()
  availableFrom?: string;

  @IsOptional()
  idealFor?: Record<string, any>;

  @IsOptional()
  addOthertags?: string;

  @IsOptional()
  contactName?: string;

  @IsOptional()
  mobileNo?: string;

  @IsOptional()
  whatsapp?: boolean;

  @IsOptional()
  images?: string[];

  @IsOptional()
  video?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  availabilityDay?: Record<string, any>;

  @IsOptional()
  startTime?: string;

  @IsOptional()
  endTime?: string;

  @IsOptional()
  availableAllDay?: boolean;

  @IsOptional()
  currentStep?: number;

  @IsOptional()
  isDraft?: boolean;
}