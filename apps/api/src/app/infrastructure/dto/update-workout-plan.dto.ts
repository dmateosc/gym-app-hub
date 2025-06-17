import { IsString, IsArray, IsObject, IsBoolean, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class WorkoutExerciseDto {
  @ApiProperty({ description: 'Exercise ID' })
  @IsString()
  exerciseId: string;

  @ApiProperty({ description: 'Number of sets' })
  sets: number;

  @ApiProperty({ description: 'Number of reps' })
  reps: number;

  @ApiProperty({ description: 'Weight in kg', required: false })
  weight?: number;

  @ApiProperty({ description: 'Duration in minutes', required: false })
  duration?: number;

  @ApiProperty({ description: 'Rest time in seconds' })
  restTime: number;

  @ApiProperty({ description: 'Exercise notes', required: false })
  notes?: string;

  @ApiProperty({ description: 'Exercise order' })
  order: number;
}

class WorkoutScheduleDto {
  @ApiProperty({ description: 'Days per week' })
  daysPerWeek: number;

  @ApiProperty({ description: 'Preferred days' })
  preferredDays: string[];

  @ApiProperty({ description: 'Estimated duration in minutes' })
  estimatedDuration: number;
}

export class UpdateWorkoutPlanDto {
  @ApiProperty({ description: 'Workout plan name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Workout plan description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Workout goal', required: false })
  @IsOptional()
  @IsString()
  goal?: string;

  @ApiProperty({ description: 'Difficulty level', required: false })
  @IsOptional()
  @IsString()
  difficulty?: string;

  @ApiProperty({ description: 'Workout exercises', type: [WorkoutExerciseDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkoutExerciseDto)
  exercises?: WorkoutExerciseDto[];

  @ApiProperty({ description: 'Workout schedule', type: WorkoutScheduleDto, required: false })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => WorkoutScheduleDto)
  schedule?: WorkoutScheduleDto;

  @ApiProperty({ description: 'Is active', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
