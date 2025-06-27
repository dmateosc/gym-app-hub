import {
  IsString,
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class DayAvailabilityDto {
  @ApiProperty({ description: 'Is available on this day' })
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

class AvailabilityDto {
  @ApiProperty({ description: 'Monday availability', type: DayAvailabilityDto })
  @ValidateNested()
  @Type(() => DayAvailabilityDto)
  monday: DayAvailabilityDto;

  @ApiProperty({
    description: 'Tuesday availability',
    type: DayAvailabilityDto,
  })
  @ValidateNested()
  @Type(() => DayAvailabilityDto)
  tuesday: DayAvailabilityDto;

  @ApiProperty({
    description: 'Wednesday availability',
    type: DayAvailabilityDto,
  })
  @ValidateNested()
  @Type(() => DayAvailabilityDto)
  wednesday: DayAvailabilityDto;

  @ApiProperty({
    description: 'Thursday availability',
    type: DayAvailabilityDto,
  })
  @ValidateNested()
  @Type(() => DayAvailabilityDto)
  thursday: DayAvailabilityDto;

  @ApiProperty({ description: 'Friday availability', type: DayAvailabilityDto })
  @ValidateNested()
  @Type(() => DayAvailabilityDto)
  friday: DayAvailabilityDto;

  @ApiProperty({
    description: 'Saturday availability',
    type: DayAvailabilityDto,
  })
  @ValidateNested()
  @Type(() => DayAvailabilityDto)
  saturday: DayAvailabilityDto;

  @ApiProperty({ description: 'Sunday availability', type: DayAvailabilityDto })
  @ValidateNested()
  @Type(() => DayAvailabilityDto)
  sunday: DayAvailabilityDto;
}

export class UpdateTrainerDto {
  @ApiProperty({ description: 'First name', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'Last name', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: 'Phone number', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Specializations',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specializations?: string[];

  @ApiProperty({
    description: 'Years of experience',
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  experience?: number;

  @ApiProperty({ description: 'Hourly rate', minimum: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  hourlyRate?: number;

  @ApiProperty({
    description: 'Weekly availability',
    type: AvailabilityDto,
    required: false,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityDto)
  availability?: AvailabilityDto;

  @ApiProperty({ description: 'Bio/description', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ description: 'Profile picture URL', required: false })
  @IsOptional()
  @IsString()
  profilePicture?: string;
}
