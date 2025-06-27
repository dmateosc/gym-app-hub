import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCertificationDto {
  @ApiProperty({ description: 'Certification name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Certification issuer' })
  @IsString()
  @IsNotEmpty()
  issuer: string;

  @ApiProperty({ description: 'Date obtained' })
  @IsDateString()
  dateObtained: Date;

  @ApiProperty({ description: 'Expiry date', required: false })
  @IsOptional()
  @IsDateString()
  expiryDate?: Date;
}
