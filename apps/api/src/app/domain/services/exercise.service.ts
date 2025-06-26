import { Injectable, Inject } from '@nestjs/common';
import { Exercise, CreateExerciseParams } from '@entities/exercise.entity';
import { ExerciseRepository } from '@repositories/exercise.repository.interface';
import { DomainException } from '@shared/domain/domain.exception';

// Service DTOs for cleaner API
export interface CreateExerciseRequest {
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

  async createExercise(request: CreateExerciseRequest): Promise<Exercise> {
    // Validate business rules
    this.validateExerciseData(request);

    const params: CreateExerciseParams = {
      name: request.name,
      description: request.description,
      category: request.category,
      muscleGroups: request.muscleGroups,
      equipment: request.equipment,
      difficulty: request.difficulty,
      instructions: request.instructions,
      tips: request.tips,
      warnings: request.warnings,
      imageUrl: request.imageUrl,
      videoUrl: request.videoUrl,
      estimatedCaloriesPerMinute: request.estimatedCaloriesPerMinute,
      createdBy: request.createdBy,
    };

    const exercise = Exercise.create(params);
    return this.exerciseRepository.save(exercise);
  }

  async updateExercise(
    id: string,
    exerciseData: Partial<Exercise>,
  ): Promise<Exercise> {
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

  // Private validation helper methods
  private validateExerciseData(request: CreateExerciseRequest): void {
    if (!request.name.trim()) {
      throw new DomainException('Exercise name cannot be empty');
    }
    if (!request.description.trim()) {
      throw new DomainException('Exercise description cannot be empty');
    }
    if (!request.instructions || request.instructions.length === 0) {
      throw new DomainException('Exercise must have at least one instruction');
    }
    if (!request.muscleGroups || request.muscleGroups.length === 0) {
      throw new DomainException(
        'Exercise must target at least one muscle group',
      );
    }

    // Validate difficulty level
    const validDifficulties = ['beginner', 'intermediate', 'advanced'];
    if (!validDifficulties.includes(request.difficulty.toLowerCase())) {
      throw new DomainException(
        'Invalid difficulty level. Must be beginner, intermediate, or advanced',
      );
    }

    // Validate category
    const validCategories = ['cardio', 'strength', 'flexibility', 'sports'];
    if (!validCategories.includes(request.category.toLowerCase())) {
      throw new DomainException(
        'Invalid category. Must be cardio, strength, flexibility, or sports',
      );
    }
  }
}
