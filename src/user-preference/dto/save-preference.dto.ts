import { IsOptional } from 'class-validator';

export class SavePreferenceDto {
  @IsOptional() userId: number;
  @IsOptional() city: string;
  @IsOptional() locality: string;
  @IsOptional() search: string;
  @IsOptional() pgFor: string;
  @IsOptional() sharingTypes: any;
  @IsOptional() preferredTenant: string;
  @IsOptional() availability: string;
  @IsOptional() parking: string;
  @IsOptional() foodIncluded: boolean;
  @IsOptional() rentMin: number;
  @IsOptional() rentMax: number;

  @IsOptional() amenities: any;
  @IsOptional() nearby: any;
  @IsOptional() restrictions: any;
  @IsOptional() premiumSort: string;
}