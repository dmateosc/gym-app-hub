import { Injectable, Inject } from '@nestjs/common';
import {
  WorkoutPlan,
  WorkoutExercise,
  WorkoutSchedule,
  CreateWorkoutPlanParams,
  UpdateWorkoutPlanParams,
} from '@entities/workout-plan-simplified.entity';
import { WorkoutPlanRepository } from '@repositories/workout-plan.repository.interface';
import { WorkoutPlanNotFoundException } from '@exceptions/workout-plan-not-found.exception';
import { InvalidWorkoutPlanException } from '@exceptions/invalid-workout-plan.exception';

// Service DTOs for cleaner API
export interface CreateWorkoutPlanRequest {
  name: string;
  description: string;
  userId: string;
  trainerId: string;
  gymId: string;
  goal: string;
  duration: number;
  difficulty: string;
  exercises: WorkoutExercise[];
  schedule: WorkoutSchedule;
  startDate: Date;
  endDate?: Date;
}

export interface UpdateWorkoutPlanRequest {
  name?: string;
  description?: string;
  goal?: string;
  difficulty?: string;
  exercises?: WorkoutExercise[];
  schedule?: WorkoutSchedule;
  isActive?: boolean;
}

export interface AddExerciseRequest {
  exerciseId: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  restTime?: number;
  notes?: string;
}

@Injectable()
export class WorkoutPlanService {
  constructor(
    @Inject('WorkoutPlanRepository')
    private readonly workoutPlanRepository: WorkoutPlanRepository,
  ) {}

  async createWorkoutPlan(
    request: CreateWorkoutPlanRequest,
  ): Promise<WorkoutPlan> {
    // Validate business rules
    this.validateWorkoutPlanData(request);

    // Check for overlapping active plans for the same user
    const existingPlans = await this.workoutPlanRepository.findActiveByUserId(
      request.userId,
    );
    const calculatedEndDate = this.calculateEndDate(
      request.startDate,
      request.duration,
    );

    const hasOverlap = existingPlans.some(
      plan =>
        request.startDate <= plan.endDate &&
        calculatedEndDate >= plan.startDate,
    );

    if (hasOverlap) {
      throw new InvalidWorkoutPlanException(
        'User already has an active workout plan in this date range',
      );
    }

    const params: CreateWorkoutPlanParams = {
      name: request.name,
      description: request.description,
      userId: request.userId,
      trainerId: request.trainerId,
      gymId: request.gymId,
      goal: request.goal,
      duration: request.duration,
      difficulty: request.difficulty,
      exercises: request.exercises,
      schedule: request.schedule,
      startDate: request.startDate,
      endDate: request.endDate,
    };

    const workoutPlan = WorkoutPlan.create(params);
    return await this.workoutPlanRepository.save(workoutPlan);
  }

  async updateWorkoutPlan(
    id: string,
    request: UpdateWorkoutPlanRequest,
  ): Promise<WorkoutPlan> {
    const workoutPlan = await this.workoutPlanRepository.findById(id);
    if (!workoutPlan) {
      throw new WorkoutPlanNotFoundException(id);
    }

    // Validate updates if provided
    if (request.name !== undefined && !request.name.trim()) {
      throw new InvalidWorkoutPlanException(
        'Workout plan name cannot be empty',
      );
    }

    const updateParams: UpdateWorkoutPlanParams = {
      name: request.name,
      description: request.description,
      goal: request.goal,
      difficulty: request.difficulty,
      exercises: request.exercises,
      schedule: request.schedule,
      isActive: request.isActive,
    };

    const updatedWorkoutPlan = workoutPlan.update(updateParams);
    return await this.workoutPlanRepository.save(updatedWorkoutPlan);
  }

  async getWorkoutPlanById(id: string): Promise<WorkoutPlan> {
    const workoutPlan = await this.workoutPlanRepository.findById(id);
    if (!workoutPlan) {
      throw new WorkoutPlanNotFoundException(id);
    }
    return workoutPlan;
  }

  async getAllWorkoutPlans(): Promise<WorkoutPlan[]> {
    return await this.workoutPlanRepository.findAll();
  }

  async getWorkoutPlansByUserId(userId: string): Promise<WorkoutPlan[]> {
    return await this.workoutPlanRepository.findByUserId(userId);
  }

  async getWorkoutPlansByTrainerId(trainerId: string): Promise<WorkoutPlan[]> {
    return await this.workoutPlanRepository.findByTrainerId(trainerId);
  }

  async getWorkoutPlansByGymId(gymId: string): Promise<WorkoutPlan[]> {
    return await this.workoutPlanRepository.findByGymId(gymId);
  }

  async getActiveWorkoutPlansByUserId(userId: string): Promise<WorkoutPlan[]> {
    return await this.workoutPlanRepository.findActiveByUserId(userId);
  }

  async addExerciseToWorkoutPlan(
    id: string,
    request: AddExerciseRequest,
  ): Promise<WorkoutPlan> {
    const workoutPlan = await this.workoutPlanRepository.findById(id);
    if (!workoutPlan) {
      throw new WorkoutPlanNotFoundException(id);
    }

    const newExercise: WorkoutExercise = {
      exerciseId: request.exerciseId,
      sets: request.sets,
      reps: request.reps,
      weight: request.weight,
      duration: request.duration,
      restTime: request.restTime || 60,
      notes: request.notes,
      order: workoutPlan.exercises.length + 1,
    };

    const updatedWorkoutPlan = workoutPlan.addExercise(newExercise);
    return await this.workoutPlanRepository.save(updatedWorkoutPlan);
  }

  async removeExerciseFromWorkoutPlan(
    id: string,
    exerciseId: string,
  ): Promise<WorkoutPlan> {
    const workoutPlan = await this.workoutPlanRepository.findById(id);
    if (!workoutPlan) {
      throw new WorkoutPlanNotFoundException(id);
    }

    const updatedWorkoutPlan = workoutPlan.removeExercise(exerciseId);
    return await this.workoutPlanRepository.save(updatedWorkoutPlan);
  }

  async deactivateWorkoutPlan(id: string): Promise<WorkoutPlan> {
    const workoutPlan = await this.workoutPlanRepository.findById(id);
    if (!workoutPlan) {
      throw new WorkoutPlanNotFoundException(id);
    }

    const updatedWorkoutPlan = workoutPlan.update({ isActive: false });
    return await this.workoutPlanRepository.save(updatedWorkoutPlan);
  }

  async activateWorkoutPlan(id: string): Promise<WorkoutPlan> {
    const workoutPlan = await this.workoutPlanRepository.findById(id);
    if (!workoutPlan) {
      throw new WorkoutPlanNotFoundException(id);
    }

    // Check for overlapping active plans
    const existingPlans = await this.workoutPlanRepository.findActiveByUserId(
      workoutPlan.userId,
    );
    const hasOverlap = existingPlans.some(
      plan =>
        plan.id !== id &&
        workoutPlan.startDate <= plan.endDate &&
        workoutPlan.endDate >= plan.startDate,
    );

    if (hasOverlap) {
      throw new InvalidWorkoutPlanException(
        'User already has an active workout plan in this date range',
      );
    }

    const updatedWorkoutPlan = workoutPlan.update({ isActive: true });
    return await this.workoutPlanRepository.save(updatedWorkoutPlan);
  }

  async deleteWorkoutPlan(id: string): Promise<void> {
    const workoutPlan = await this.workoutPlanRepository.findById(id);
    if (!workoutPlan) {
      throw new WorkoutPlanNotFoundException(id);
    }

    await this.workoutPlanRepository.delete(id);
  }

  // Private helper methods for validation and calculation
  private validateWorkoutPlanData(request: CreateWorkoutPlanRequest): void {
    if (!request.name.trim()) {
      throw new InvalidWorkoutPlanException(
        'Workout plan name cannot be empty',
      );
    }
    if (!request.description.trim()) {
      throw new InvalidWorkoutPlanException(
        'Workout plan description cannot be empty',
      );
    }
    if (request.duration <= 0) {
      throw new InvalidWorkoutPlanException('Duration must be positive');
    }
    if (!request.exercises || request.exercises.length === 0) {
      throw new InvalidWorkoutPlanException(
        'Workout plan must have at least one exercise',
      );
    }

    // Validate difficulty level
    const validDifficulties = ['beginner', 'intermediate', 'advanced'];
    if (!validDifficulties.includes(request.difficulty.toLowerCase())) {
      throw new InvalidWorkoutPlanException(
        'Invalid difficulty level. Must be beginner, intermediate, or advanced',
      );
    }

    // Validate schedule
    if (request.schedule.daysPerWeek <= 0 || request.schedule.daysPerWeek > 7) {
      throw new InvalidWorkoutPlanException(
        'Days per week must be between 1 and 7',
      );
    }
  }

  private calculateEndDate(startDate: Date, duration: number): Date {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + duration * 7);
    return endDate;
  }
}
