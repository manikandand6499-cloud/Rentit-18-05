// location.dto.ts
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserLocationDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  locality?: string;

  @IsOptional()
  @IsString()
  area?: string; 
}