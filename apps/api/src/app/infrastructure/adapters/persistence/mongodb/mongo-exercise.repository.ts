import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exercise } from '@entities/exercise.entity';
import { ExerciseRepository } from '@repositories/exercise.repository.interface';
import { ExerciseSchema } from './exercise.schema';

@Injectable()
export class MongoExerciseRepository implements ExerciseRepository {
  constructor(
    @InjectModel(ExerciseSchema.name)
    private readonly exerciseModel: Model<ExerciseSchema>,
  ) {}

  async findAll(): Promise<Exercise[]> {
    const exercises = await this.exerciseModel.find().exec();
    return exercises.map(this.toDomain);
  }

  async findById(id: string): Promise<Exercise | null> {
    const exercise = await this.exerciseModel.findById(id).exec();
    return exercise ? this.toDomain(exercise) : null;
  }

  async findByCategory(category: string): Promise<Exercise[]> {
    const exercises = await this.exerciseModel.find({ category }).exec();
    return exercises.map(this.toDomain);
  }

  async findByMuscleGroup(muscleGroup: string): Promise<Exercise[]> {
    const exercises = await this.exerciseModel
      .find({ muscleGroups: { $in: [muscleGroup] } })
      .exec();
    return exercises.map(this.toDomain);
  }

  async findByDifficulty(difficulty: string): Promise<Exercise[]> {
    const exercises = await this.exerciseModel.find({ difficulty }).exec();
    return exercises.map(this.toDomain);
  }

  async findByEquipment(equipment: string): Promise<Exercise[]> {
    const exercises = await this.exerciseModel
      .find({ equipment: { $in: [equipment] } })
      .exec();
    return exercises.map(this.toDomain);
  }

  async findBodyweightExercises(): Promise<Exercise[]> {
    const exercises = await this.exerciseModel
      .find({ 
        $or: [
          { equipment: { $in: ['bodyweight'] } },
          { equipment: { $size: 0 } }
        ]
      })
      .exec();
    return exercises.map(this.toDomain);
  }

  async searchByName(name: string): Promise<Exercise[]> {
    const exercises = await this.exerciseModel
      .find({ 
        $text: { $search: name }
      })
      .exec();
    return exercises.map(this.toDomain);
  }

  async save(exercise: Exercise): Promise<Exercise> {
    const exerciseDoc = new this.exerciseModel({
      _id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      category: exercise.category,
      muscleGroups: exercise.muscleGroups,
      equipment: exercise.equipment,
      difficulty: exercise.difficulty,
      instructions: exercise.instructions,
      tips: exercise.tips,
      warnings: exercise.warnings,
      imageUrl: exercise.imageUrl,
      videoUrl: exercise.videoUrl,
      estimatedCaloriesPerMinute: exercise.estimatedCaloriesPerMinute,
      createdBy: exercise.createdBy,
      isActive: exercise.isActive,
    });
    
    const savedExercise = await exerciseDoc.save();
    return this.toDomain(savedExercise);
  }

  async update(id: string, exerciseData: Partial<Exercise>): Promise<Exercise> {
    const updatedExercise = await this.exerciseModel
      .findByIdAndUpdate(id, exerciseData, { new: true })
      .exec();
    
    if (!updatedExercise) {
      throw new Error(`Exercise with id ${id} not found`);
    }
    
    return this.toDomain(updatedExercise);
  }

  async delete(id: string): Promise<void> {
    await this.exerciseModel.findByIdAndDelete(id).exec();
  }

  async findByCreator(creatorId: string): Promise<Exercise[]> {
    const exercises = await this.exerciseModel.find({ createdBy: creatorId }).exec();
    return exercises.map(this.toDomain);
  }

  async findActive(): Promise<Exercise[]> {
    const exercises = await this.exerciseModel.find({ isActive: true }).exec();
    return exercises.map(this.toDomain);
  }

  private toDomain(exerciseSchema: ExerciseSchema): Exercise {
    return new Exercise(
      exerciseSchema._id.toString(),
      exerciseSchema.name,
      exerciseSchema.description,
      exerciseSchema.category,
      exerciseSchema.muscleGroups,
      exerciseSchema.equipment,
      exerciseSchema.difficulty,
      exerciseSchema.instructions,
      exerciseSchema.tips,
      exerciseSchema.warnings,
      exerciseSchema.imageUrl,
      exerciseSchema.videoUrl,
      exerciseSchema.estimatedCaloriesPerMinute,
      exerciseSchema.createdBy?.toString(),
      exerciseSchema.isActive,
    );
  }
}
