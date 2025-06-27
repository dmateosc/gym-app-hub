import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsNumber,
  IsArray,
  IsObject,
  IsDateString,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class WorkoutExerciseDto {
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
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiProperty({
    description: 'Duration in minutes',
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  duration?: number;

  @ApiProperty({ description: 'Rest time in seconds', minimum: 0 })
  @IsNumber()
  @Min(0)
  restTime: number;

  @ApiProperty({ description: 'Exercise notes', required: false })
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Exercise order', minimum: 1 })
  @IsNumber()
  @Min(1)
  order: number;
}

class WorkoutScheduleDto {
  @ApiProperty({ description: 'Days per week', minimum: 1, maximum: 7 })
  @IsNumber()
  @Min(1)
  @Max(7)
  daysPerWeek: number;

  @ApiProperty({
    description: 'Preferred days',
    enum: [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ],
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  preferredDays: string[];

  @ApiProperty({ description: 'Estimated duration in minutes', minimum: 15 })
  @IsNumber()
  @Min(15)
  estimatedDuration: number;
}

export class CreateWorkoutPlanDto {
  @ApiProperty({ description: 'Workout plan name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Workout plan description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'User ID' })
  @IsMongoId()
  userId: string;

  @ApiProperty({ description: 'Trainer ID' })
  @IsMongoId()
  trainerId: string;

  @ApiProperty({ description: 'Gym ID' })
  @IsMongoId()
  gymId: string;

  @ApiProperty({
    description: 'Workout goal',
    enum: [
      'weight_loss',
      'muscle_gain',
      'endurance',
      'strength',
      'general_fitness',
    ],
  })
  @IsString()
  goal: string;

  @ApiProperty({ description: 'Duration in weeks', minimum: 1 })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({
    description: 'Difficulty level',
    enum: ['beginner', 'intermediate', 'advanced'],
  })
  @IsString()
  difficulty: string;

  @ApiProperty({ description: 'Workout exercises', type: [WorkoutExerciseDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkoutExerciseDto)
  exercises: WorkoutExerciseDto[];

  @ApiProperty({ description: 'Workout schedule', type: WorkoutScheduleDto })
  @IsObject()
  @ValidateNested()
  @Type(() => WorkoutScheduleDto)
  schedule: WorkoutScheduleDto;

  @ApiProperty({ description: 'Start date' })
  @IsDateString()
  startDate: Date;

  @ApiProperty({ description: 'End date' })
  @IsDateString()
  endDate: Date;
}
