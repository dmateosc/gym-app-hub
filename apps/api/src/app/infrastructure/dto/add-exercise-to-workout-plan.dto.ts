import { IsMongoId, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddExerciseToWorkoutPlanDto {
  @ApiProperty({ description: 'Exercise ID' })
  @IsMongoId()
  exerciseId: string;

  @ApiProperty({ description: 'Number of sets', minimum: 1 })
  @IsNumber()
  @Min(1)
  sets: number;

  @ApiProperty({ description: 'Number of reps', minimum: 1 })
  @IsNumber()
  @Min(1)
  reps: number;

  @ApiProperty({ description: 'Weight in kg', minimum: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiProperty({ description: 'Duration in minutes', minimum: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  duration?: number;

  @ApiProperty({ description: 'Rest time in seconds', minimum: 0 })
  @IsNumber()
  @Min(0)
  restTime: number;

  @ApiProperty({ description: 'Exercise notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
