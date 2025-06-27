import {
  IsDateString,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CompletedExerciseDto {
  @ApiProperty({ description: 'Exercise ID' })
  @IsString()
  exerciseId: string;

  @ApiProperty({ description: 'Sets completed' })
  @IsNumber()
  @Min(0)
  setsCompleted: number;

  @ApiProperty({ description: 'Reps completed' })
  @IsNumber()
  @Min(0)
  repsCompleted: number;

  @ApiProperty({ description: 'Weight used', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weightUsed?: number;

  @ApiProperty({ description: 'Duration completed', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  durationCompleted?: number;

  @ApiProperty({ description: 'Rest time taken', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  restTimeTaken?: number;

  @ApiProperty({ description: 'Exercise notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Exercise completed' })
  completed: boolean;
}

export class CompleteWorkoutSessionDto {
  @ApiProperty({ description: 'End time' })
  @IsDateString()
  endTime: Date;

  @ApiProperty({
    description: 'Completed exercises',
    type: [CompletedExerciseDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompletedExerciseDto)
  exercises: CompletedExerciseDto[];

  @ApiProperty({
    description: 'Total calories burned',
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalCaloriesBurned?: number;

  @ApiProperty({
    description: 'Average heart rate',
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  averageHeartRate?: number;

  @ApiProperty({
    description: 'Maximum heart rate',
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxHeartRate?: number;

  @ApiProperty({ description: 'Session notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Session rating',
    minimum: 1,
    maximum: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;
}
