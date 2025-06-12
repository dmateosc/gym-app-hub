import { IsString, IsOptional, IsEnum, Length } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'User full name', example: 'Juan Pérez Updated' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @ApiPropertyOptional({ description: 'User phone number', example: '+1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ 
    description: 'Membership type', 
    enum: ['basic', 'premium', 'vip'],
    example: 'premium'
  })
  @IsOptional()
  @IsEnum(['basic', 'premium', 'vip'])
  membershipType?: string;
}