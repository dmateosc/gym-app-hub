import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateExerciseProgressDto {
  @ApiProperty({ description: 'Exercise ID' })
  @IsString()
  exerciseId: string;

  @ApiProperty({ description: 'Sets completed', minimum: 0 })
  @IsNumber()
  @Min(0)
  setsCompleted: number;

  @ApiProperty({ description: 'Reps completed', minimum: 0 })
  @IsNumber()
  @Min(0)
  repsCompleted: number;

  @ApiProperty({ description: 'Weight used', minimum: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weightUsed?: number;

  @ApiProperty({ description: 'Duration completed', minimum: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  durationCompleted?: number;

  @ApiProperty({ description: 'Rest time taken', minimum: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  restTimeTaken?: number;

  @ApiProperty({ description: 'Exercise notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Exercise completed', required: false })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
