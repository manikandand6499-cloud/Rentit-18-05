import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateScheduleDto {
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