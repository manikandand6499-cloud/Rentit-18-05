import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class FlatmateDto {

  // ── BASIC ────────────────────────────────────────────────

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  propertyType?: string;

  // ── PROPERTY DETAILS ─────────────────────────────────────

  @IsOptional()
  @IsString()
  apartmentType?: string;

  @IsOptional()
  @IsString()
  apartmentName?: string;

  @IsOptional()
  @IsString()
  bhkType?: string;

  @IsOptional()
  @IsString()
  floor?: string;

  @IsOptional()
  @IsString()
  totalFloor?: string;

  @IsOptional()
  @IsString()
  roomType?: string;

  @IsOptional()
  @IsString()
  tenantType?: string;

  @IsOptional()
  @IsString()
  propertyAge?: string;

  @IsOptional()
  @IsString()
  facing?: string;

  @IsOptional()
  @IsNumber()
  builtUpArea?: number;

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

  // ── RENT ─────────────────────────────────────────────────

  @IsOptional()
  @IsNumber()
  expectedRent?: number;

  @IsOptional()
  @IsNumber()
  expectedDeposit?: number;

  @IsOptional()
  @IsString()
  maintenanceType?: string;

  @IsOptional()
  @IsNumber()
  maintenanceAmount?: number;

  @IsOptional()
  availableFrom?: any;

  @IsOptional()
  @IsString()
  furnishing?: string;

  @IsOptional()
  @IsString()
  parking?: string;

  @IsOptional()
  @IsString()
  description?: string;

  // ── ROOM ─────────────────────────────────────────────────

  @IsOptional()
  @IsBoolean()
  attachedBathroom?: boolean;

  @IsOptional()
  @IsString()
  bathroomType?: string;

  @IsOptional()
  @IsBoolean()
  acRoom?: boolean;

  @IsOptional()
  @IsBoolean()
  balcony?: boolean;

  // ── PREFERENCES ──────────────────────────────────────────

  @IsOptional()
  @IsBoolean()
  nonVegAllowed?: boolean;

  @IsOptional()
  @IsBoolean()
  smokingAllowed?: boolean;

  @IsOptional()
  @IsBoolean()
  drinkingAllowed?: boolean;

  // ── AMENITIES & FEATURES ─────────────────────────────────

  @IsOptional()
  @IsBoolean()
  gym?: boolean;

  @IsOptional()
  @IsBoolean()
  gatedSecurity?: boolean;

  @IsOptional()
  @IsBoolean()
  liftSelected?: boolean;

  @IsOptional()
  @IsBoolean()
  swimmingPoolSelected?: boolean;

  @IsOptional()
  @IsBoolean()
  clubHouseSelected?: boolean;

  @IsOptional()
  @IsBoolean()
  powerBackupSelected?: boolean;

  @IsOptional()
  @IsBoolean()
  parkSelected?: boolean;

  @IsOptional()
  @IsNumber()
  viewscount?: number;

  // ── CONTACT ──────────────────────────────────────────────

  @IsOptional()
  @IsString()
  whoShowsProperty?: string;

  @IsOptional()
  @IsString()
  secondaryNumber?: string;

  // ── LOCATION EXTRAS ──────────────────────────────────────

  @IsOptional()
  @IsString()
  waterSupply?: string;

  @IsOptional()
  @IsString()
  directionsTip?: string;

  // ── AVAILABILITY ─────────────────────────────────────────

  @IsOptional()
  availabilityDay?: any;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsBoolean()
  availableAllDay?: boolean;
}