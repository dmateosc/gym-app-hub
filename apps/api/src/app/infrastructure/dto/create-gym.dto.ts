import {
  IsString,
  IsNotEmpty,
  IsObject,
  IsArray,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class AddressDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country: string;
}

class OperatingHoursSlotDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  open: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  close: string;

  @ApiProperty({ default: false })
  @IsOptional()
  isClosed?: boolean;
}

class OperatingHoursDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => OperatingHoursSlotDto)
  monday: OperatingHoursSlotDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => OperatingHoursSlotDto)
  tuesday: OperatingHoursSlotDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => OperatingHoursSlotDto)
  wednesday: OperatingHoursSlotDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => OperatingHoursSlotDto)
  thursday: OperatingHoursSlotDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => OperatingHoursSlotDto)
  friday: OperatingHoursSlotDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => OperatingHoursSlotDto)
  saturday: OperatingHoursSlotDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => OperatingHoursSlotDto)
  sunday: OperatingHoursSlotDto;
}

export class CreateGymDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => OperatingHoursDto)
  operatingHours: OperatingHoursDto;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  facilities: string[];

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  maxCapacity: number;
}
