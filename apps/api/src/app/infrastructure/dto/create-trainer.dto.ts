import { IsString, IsNotEmpty, IsEmail, IsMongoId, IsArray, IsNumber, IsObject, IsOptional, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CertificationDto {
  @ApiProperty({ description: 'Certification name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Certification issuer' })
  @IsString()
  @IsNotEmpty()
  issuer: string;

  @ApiProperty({ description: 'Date obtained' })
  @IsString()
  dateObtained: Date;

  @ApiProperty({ description: 'Expiry date', required: false })
  @IsOptional()
  @IsString()
  expiryDate?: Date;

  @ApiProperty({ description: 'Is certification active' })
  isActive: boolean;
}

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

  @ApiProperty({ description: 'Tuesday availability', type: DayAvailabilityDto })
  @ValidateNested()
  @Type(() => DayAvailabilityDto)
  tuesday: DayAvailabilityDto;

  @ApiProperty({ description: 'Wednesday availability', type: DayAvailabilityDto })
  @ValidateNested()
  @Type(() => DayAvailabilityDto)
  wednesday: DayAvailabilityDto;

  @ApiProperty({ description: 'Thursday availability', type: DayAvailabilityDto })
  @ValidateNested()
  @Type(() => DayAvailabilityDto)
  thursday: DayAvailabilityDto;

  @ApiProperty({ description: 'Friday availability', type: DayAvailabilityDto })
  @ValidateNested()
  @Type(() => DayAvailabilityDto)
  friday: DayAvailabilityDto;

  @ApiProperty({ description: 'Saturday availability', type: DayAvailabilityDto })
  @ValidateNested()
  @Type(() => DayAvailabilityDto)
  saturday: DayAvailabilityDto;

  @ApiProperty({ description: 'Sunday availability', type: DayAvailabilityDto })
  @ValidateNested()
  @Type(() => DayAvailabilityDto)
  sunday: DayAvailabilityDto;
}

export class CreateTrainerDto {
  @ApiProperty({ description: 'First name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Phone number' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Gym ID' })
  @IsMongoId()
  gymId: string;

  @ApiProperty({ description: 'Specializations', type: [String] })
  @IsArray()
  @IsString({ each: true })
  specializations: string[];

  @ApiProperty({ description: 'Certifications', type: [CertificationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CertificationDto)
  certifications: CertificationDto[];

  @ApiProperty({ description: 'Years of experience', minimum: 0 })
  @IsNumber()
  @Min(0)
  experience: number;

  @ApiProperty({ description: 'Hourly rate', minimum: 0 })
  @IsNumber()
  @Min(0)
  hourlyRate: number;

  @ApiProperty({ description: 'Weekly availability', type: AvailabilityDto })
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityDto)
  availability: AvailabilityDto;

  @ApiProperty({ description: 'Bio/description', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ description: 'Profile picture URL', required: false })
  @IsOptional()
  @IsString()
  profilePicture?: string;
}
