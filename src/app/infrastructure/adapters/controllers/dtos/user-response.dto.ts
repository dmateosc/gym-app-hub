import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'User ID', example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ description: 'User full name', example: 'Juan Pérez' })
  name: string;

  @ApiProperty({ description: 'User email address', example: 'juan@email.com' })
  email: string;

  @ApiPropertyOptional({ description: 'User phone number', example: '+1234567890' })
  phone?: string;

  @ApiProperty({ 
    description: 'Membership type', 
    enum: ['basic', 'premium', 'vip'],
    example: 'basic'
  })
  membershipType: string;

  @ApiProperty({ description: 'Join date', example: '2025-06-12T08:00:58.000Z' })
  joinDate: Date;

  @ApiProperty({ description: 'User status', example: true })
  isActive: boolean;
}