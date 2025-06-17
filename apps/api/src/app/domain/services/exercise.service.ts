import { Injectable, Inject } from '@nestjs/common';
import { Exercise } from '@entities/exercise.entity';
import { ExerciseRepository } from '@repositories/exercise.repository.interface';

@Injectable()
export class ExerciseService {
  constructor(
    @Inject('ExerciseRepository')
    private readonly exerciseRepository: ExerciseRepository,
  ) {}

  async getAllExercises(): Promise<Exercise[]> {
    return this.exerciseRepository.findAll();
  }

  async getExerciseById(id: string): Promise<Exercise | null> {
    return this.exerciseRepository.findById(id);
  }

  async getExercisesByCategory(category: string): Promise<Exercise[]> {
    return this.exerciseRepository.findByCategory(category);
  }

  async getExercisesByMuscleGroup(muscleGroup: string): Promise<Exercise[]> {
    return this.exerciseRepository.findByMuscleGroup(muscleGroup);
  }

  async getExercisesByDifficulty(difficulty: string): Promise<Exercise[]> {
    return this.exerciseRepository.findByDifficulty(difficulty);
  }

  async getExercisesByEquipment(equipment: string): Promise<Exercise[]> {
    return this.exerciseRepository.findByEquipment(equipment);
  }

  async getBodyweightExercises(): Promise<Exercise[]> {
    return this.exerciseRepository.findBodyweightExercises();
  }

  async searchExercisesByName(name: string): Promise<Exercise[]> {
    return this.exerciseRepository.searchByName(name);
  }

  async createExercise(exerciseData: {
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
  }): Promise<Exercise> {
    const exercise = Exercise.create(
      exerciseData.name,
      exerciseData.description,
      exerciseData.category,
      exerciseData.muscleGroups,
      exerciseData.equipment,
      exerciseData.difficulty,
      exerciseData.instructions,
      exerciseData.tips || [],
      exerciseData.warnings || [],
      exerciseData.imageUrl,
      exerciseData.videoUrl,
      exerciseData.estimatedCaloriesPerMinute,
      exerciseData.createdBy,
    );
    
    return this.exerciseRepository.save(exercise);
  }

  async updateExercise(id: string, exerciseData: Partial<Exercise>): Promise<Exercise> {
    return this.exerciseRepository.update(id, exerciseData);
  }

  async deleteExercise(id: string): Promise<void> {
    return this.exerciseRepository.delete(id);
  }

  async getActiveExercises(): Promise<Exercise[]> {
    return this.exerciseRepository.findActive();
  }

  async getExercisesByCreator(creatorId: string): Promise<Exercise[]> {
    return this.exerciseRepository.findByCreator(creatorId);
  }
}
