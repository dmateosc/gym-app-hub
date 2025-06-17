import { IsString, IsNotEmpty, IsArray, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExerciseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: ['cardio', 'strength', 'flexibility', 'sports'] })
  @IsEnum(['cardio', 'strength', 'flexibility', 'sports'])
  @IsNotEmpty()
  category: string;

  @ApiProperty({ 
    type: [String], 
    enum: ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'full_body'],
    example: ['chest', 'shoulders']
  })
  @IsArray()
  @IsString({ each: true })
  muscleGroups: string[];

  @ApiProperty({ 
    type: [String], 
    enum: ['barbell', 'dumbbell', 'machine', 'bodyweight', 'resistance_band', 'kettlebell', 'cable'],
    example: ['dumbbell']
  })
  @IsArray()
  @IsString({ each: true })
  equipment: string[];

  @ApiProperty({ enum: ['beginner', 'intermediate', 'advanced'] })
  @IsEnum(['beginner', 'intermediate', 'advanced'])
  @IsNotEmpty()
  difficulty: string;

  @ApiProperty({ type: [String], example: ['Stand with feet shoulder-width apart', 'Lower down into squat position'] })
  @IsArray()
  @IsString({ each: true })
  instructions: string[];

  @ApiProperty({ type: [String], required: false, example: ['Keep your back straight', 'Breathe consistently'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tips?: string[];

  @ApiProperty({ type: [String], required: false, example: ['Avoid if you have knee problems'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  warnings?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiProperty({ required: false, minimum: 0 })
  @IsOptional()
  @IsNumber()
  estimatedCaloriesPerMinute?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  createdBy?: string;
}
