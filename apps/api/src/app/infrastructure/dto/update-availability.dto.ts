import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAvailabilityDto {
  @ApiProperty({ description: 'Day of the week' })
  @IsString()
  day: string;

  @ApiProperty({ description: 'Is available on this day' })
  @IsBoolean()
  isAvailable: boolean;

  @ApiProperty({ description: 'Start time (HH:MM)', required: false })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiProperty({ description: 'End time (HH:MM)', required: false })
  @IsOptional()
  @IsString()
  endTime?: string;
}
