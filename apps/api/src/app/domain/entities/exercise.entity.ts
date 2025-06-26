import { BaseEntity } from '@shared/domain/base.entity';

// Parameter objects for clean code
export interface CreateExerciseParams {
  name: string;
  description: string;
  category: string;
  muscleGroups: string[];
  equipment: string[];
  difficulty: string;
  instructions: string[];
  tips?: string[];
  warnings?: string[];
  imageUrl?: string;
  videoUrl?: string;
  estimatedCaloriesPerMinute?: number;
  createdBy?: string;
}

export class Exercise extends BaseEntity {
  constructor(
    id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly category: string, // 'cardio', 'strength', 'flexibility', 'sports'
    public readonly muscleGroups: string[], // ['chest', 'back', 'legs', 'shoulders', 'arms', 'core']
    public readonly equipment: string[], // ['barbell', 'dumbbell', 'machine', 'bodyweight']
    public readonly difficulty: string, // 'beginner', 'intermediate', 'advanced'
    public readonly instructions: string[],
    public readonly tips: string[],
    public readonly warnings: string[],
    public readonly imageUrl?: string,
    public readonly videoUrl?: string,
    public readonly estimatedCaloriesPerMinute?: number,
    public readonly createdBy?: string, // Trainer ID
    public readonly isActive: boolean = true,
  ) {
    super(id);
  }

  public static create(params: CreateExerciseParams): Exercise {
    const id = this.generateId();
    return new Exercise(
      id,
      params.name,
      params.description,
      params.category,
      params.muscleGroups,
      params.equipment,
      params.difficulty,
      params.instructions,
      params.tips || [],
      params.warnings || [],
      params.imageUrl,
      params.videoUrl,
      params.estimatedCaloriesPerMinute,
      params.createdBy,
    );
  }

  public isForMuscleGroup(muscleGroup: string): boolean {
    return this.muscleGroups.includes(muscleGroup.toLowerCase());
  }

  public requiresEquipment(equipmentType: string): boolean {
    return this.equipment.includes(equipmentType.toLowerCase());
  }

  public isBodyweightExercise(): boolean {
    return this.equipment.includes('bodyweight') || this.equipment.length === 0;
  }

  public getDifficultyLevel(): number {
    const levels: { [key: string]: number } = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
    };
    return levels[this.difficulty.toLowerCase()] || 1;
  }
}
