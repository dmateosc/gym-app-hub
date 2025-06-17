import { IsMongoId, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartWorkoutSessionDto {
  @ApiProperty({ description: 'Workout plan ID' })
  @IsMongoId()
  workoutPlanId: string;

  @ApiProperty({ description: 'User ID' })
  @IsMongoId()
  userId: string;

  @ApiProperty({ description: 'Session date' })
  @IsDateString()
  date: Date;

  @ApiProperty({ description: 'Start time' })
  @IsDateString()
  startTime: Date;
}
