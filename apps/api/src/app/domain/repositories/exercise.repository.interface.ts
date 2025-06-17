import { Exercise } from '@entities/exercise.entity';

export interface ExerciseRepository {
  findAll(): Promise<Exercise[]>;
  findById(id: string): Promise<Exercise | null>;
  findByCategory(category: string): Promise<Exercise[]>;
  findByMuscleGroup(muscleGroup: string): Promise<Exercise[]>;
  findByDifficulty(difficulty: string): Promise<Exercise[]>;
  findByEquipment(equipment: string): Promise<Exercise[]>;
  findBodyweightExercises(): Promise<Exercise[]>;
  searchByName(name: string): Promise<Exercise[]>;
  save(exercise: Exercise): Promise<Exercise>;
  update(id: string, exercise: Partial<Exercise>): Promise<Exercise>;
  delete(id: string): Promise<void>;
  findByCreator(creatorId: string): Promise<Exercise[]>;
  findActive(): Promise<Exercise[]>;
}
