import { Injectable, Inject } from '@nestjs/common';
import { WorkoutPlan, WorkoutExercise, WorkoutSchedule } from '@entities/workout-plan.entity';
import { WorkoutPlanRepository } from '@repositories/workout-plan.repository.interface';
import { WorkoutPlanNotFoundException } from '@exceptions/workout-plan-not-found.exception';
import { InvalidWorkoutPlanException } from '@exceptions/invalid-workout-plan.exception';

@Injectable()
export class WorkoutPlanService {
  constructor(
    @Inject('WorkoutPlanRepository')
    private readonly workoutPlanRepository: WorkoutPlanRepository,
  ) {}

  async createWorkoutPlan(params: {
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
  }): Promise<WorkoutPlan> {
    // Validate date range
    const endDate = new Date(params.startDate);
    endDate.setDate(params.startDate.getDate() + params.duration * 7);

    if (params.startDate >= endDate) {
      throw new InvalidWorkoutPlanException('End date must be after start date');
    }

    // Validate duration
    if (params.duration <= 0) {
      throw new InvalidWorkoutPlanException('Duration must be positive');
    }

    // Check for overlapping active plans for the same user
    const existingPlans = await this.workoutPlanRepository.findActiveByUserId(params.userId);
    const hasOverlap = existingPlans.some(plan => 
      (params.startDate <= plan.endDate && endDate >= plan.startDate)
    );

    if (hasOverlap) {
      throw new InvalidWorkoutPlanException('User already has an active workout plan in this date range');
    }

    const workoutPlan = WorkoutPlan.create(params);

    return await this.workoutPlanRepository.save(workoutPlan);
  }

  async updateWorkoutPlan(
    id: string,
    updates: {
      name?: string;
      description?: string;
      goal?: string;
      difficulty?: string;
      exercises?: WorkoutExercise[];
      schedule?: WorkoutSchedule;
      isActive?: boolean;
    }
  ): Promise<WorkoutPlan> {
    const workoutPlan = await this.workoutPlanRepository.findById(id);
    if (!workoutPlan) {
      throw new WorkoutPlanNotFoundException(id);
    }

    if (updates.name) workoutPlan.updateName(updates.name);
    if (updates.description) workoutPlan.updateDescription(updates.description);
    if (updates.goal) workoutPlan.updateGoal(updates.goal);
    if (updates.difficulty) workoutPlan.updateDifficulty(updates.difficulty);
    if (updates.exercises) workoutPlan.updateExercises(updates.exercises);
    if (updates.schedule) workoutPlan.updateSchedule(updates.schedule);
    if (updates.isActive !== undefined) workoutPlan.setActive(updates.isActive);

    return await this.workoutPlanRepository.save(workoutPlan);
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

  async addExerciseToWorkoutPlan(params: {
    id: string;
    exerciseId: string;
    sets: number;
    reps: number;
    weight?: number;
    duration?: number;
    restTime?: number;
    notes?: string;
  }): Promise<WorkoutPlan> {
    const workoutPlan = await this.workoutPlanRepository.findById(params.id);
    if (!workoutPlan) {
      throw new WorkoutPlanNotFoundException(params.id);
    }

    const newExercise: WorkoutExercise = {
      exerciseId: params.exerciseId,
      sets: params.sets,
      reps: params.reps,
      weight: params.weight,
      duration: params.duration,
      restTime: params.restTime || 60,
      notes: params.notes,
      order: workoutPlan.exercises.length + 1,
    };

    workoutPlan.addExercise(newExercise);
    return await this.workoutPlanRepository.save(workoutPlan);
  }

  async removeExerciseFromWorkoutPlan(
    id: string, 
    exerciseId: string
  ): Promise<WorkoutPlan> {
    const workoutPlan = await this.workoutPlanRepository.findById(id);
    if (!workoutPlan) {
      throw new WorkoutPlanNotFoundException(id);
    }

    workoutPlan.removeExercise(exerciseId);
    return await this.workoutPlanRepository.save(workoutPlan);
  }

  async deactivateWorkoutPlan(id: string): Promise<WorkoutPlan> {
    const workoutPlan = await this.workoutPlanRepository.findById(id);
    if (!workoutPlan) {
      throw new WorkoutPlanNotFoundException(id);
    }

    workoutPlan.deactivate();
    return await this.workoutPlanRepository.save(workoutPlan);
  }

  async activateWorkoutPlan(id: string): Promise<WorkoutPlan> {
    const workoutPlan = await this.workoutPlanRepository.findById(id);
    if (!workoutPlan) {
      throw new WorkoutPlanNotFoundException(id);
    }

    // Check for overlapping active plans
    const existingPlans = await this.workoutPlanRepository.findActiveByUserId(workoutPlan.userId);
    const hasOverlap = existingPlans.some(plan => 
      plan.id !== id && 
      (workoutPlan.startDate <= plan.endDate && workoutPlan.endDate >= plan.startDate)
    );

    if (hasOverlap) {
      throw new InvalidWorkoutPlanException('User already has an active workout plan in this date range');
    }

    workoutPlan.activate();
    return await this.workoutPlanRepository.save(workoutPlan);
  }

  async deleteWorkoutPlan(id: string): Promise<void> {
    const workoutPlan = await this.workoutPlanRepository.findById(id);
    if (!workoutPlan) {
      throw new WorkoutPlanNotFoundException(id);
    }

    await this.workoutPlanRepository.delete(id);
  }
}
