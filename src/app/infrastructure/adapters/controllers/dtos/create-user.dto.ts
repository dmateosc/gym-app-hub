import { IsString, IsEmail, IsOptional, IsEnum, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User full name', example: 'Juan Pérez' })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ description: 'User email address', example: 'juan@email.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ description: 'User phone number', example: '+1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ 
    description: 'Membership type', 
    enum: ['basic', 'premium', 'vip'],
    example: 'basic'
  })
  @IsOptional()
  @IsEnum(['basic', 'premium', 'vip'])
  membershipType?: string;
}