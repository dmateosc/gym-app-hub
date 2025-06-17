import { Injectable, Inject } from '@nestjs/common';
import { WorkoutPlanRepositoryInterface } from '../repositories/workout-plan.repository.interface';
import { WorkoutPlan } from '../entities/workout-plan.entity';
import { DomainException } from '../../../shared/domain/domain.exception';

@Injectable()
export class WorkoutPlanService {
  constructor(
    @Inject('WorkoutPlanRepositoryInterface')
    private readonly workoutPlanRepository: WorkoutPlanRepositoryInterface,
  ) {}

  async createWorkoutPlan(
    name: string,
    description: string,
    userId: string,
    trainerId: string,
    gymId: string,
    goal: string,
    duration: number,
    difficulty: string,
    exercises: any[],
    schedule: any,
    startDate: Date,
    endDate: Date,
  ): Promise<WorkoutPlan> {
    // Validate date range
    if (startDate >= endDate) {
      throw new DomainException('End date must be after start date');
    }

    // Validate duration
    if (duration <= 0) {
      throw new DomainException('Duration must be positive');
    }

    // Check for overlapping active plans for the same user
    const existingPlans = await this.workoutPlanRepository.findActiveByUserId(userId);
    const hasOverlap = existingPlans.some(plan => 
      (startDate <= plan.endDate && endDate >= plan.startDate)
    );

    if (hasOverlap) {
      throw new DomainException('User already has an active workout plan in this date range');
    }

    const workoutPlan = WorkoutPlan.create(
      name,
      description,
      userId,
      trainerId,
      gymId,
      goal,
      duration,
      difficulty,
      exercises,
      schedule,
      startDate,
      endDate,
    );

    return await this.workoutPlanRepository.save(workoutPlan);
  }

  async updateWorkoutPlan(
    id: string,
    name?: string,
    description?: string,
    goal?: string,
    difficulty?: string,
    exercises?: any[],
    schedule?: any,
    isActive?: boolean,
  ): Promise<WorkoutPlan> {
    const workoutPlan = await this.workoutPlanRepository.findById(id);
    if (!workoutPlan) {
      throw new DomainException('Workout plan not found');
    }

    if (name) workoutPlan.updateName(name);
    if (description) workoutPlan.updateDescription(description);
    if (goal) workoutPlan.updateGoal(goal);
    if (difficulty) workoutPlan.updateDifficulty(difficulty);
    if (exercises) workoutPlan.updateExercises(exercises);
    if (schedule) workoutPlan.updateSchedule(schedule);
    if (isActive !== undefined) workoutPlan.setActive(isActive);

    return await this.workoutPlanRepository.save(workoutPlan);
  }

  async getWorkoutPlanById(id: string): Promise<WorkoutPlan> {
    const workoutPlan = await this.workoutPlanRepository.findById(id);
    if (!workoutPlan) {
      throw new DomainException('Workout plan not found');
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
    exerciseId: string,
    sets: number,
    reps: number,
    weight?: number,
    duration?: number,
    restTime: number = 60,
    notes?: string,
  ): Promise<WorkoutPlan> {
    const workoutPlan = await this.workoutPlanRepository.findById(id);
    if (!workoutPlan) {
      throw new DomainException('Workout plan not found');
    }

    const newExercise = {
      exerciseId,
      sets,
      reps,
      weight,
      duration,
      restTime,
      notes,
      order: workoutPlan.exercises.length + 1,
    };

    workoutPlan.addExercise(newExercise);
    return await this.workoutPlanRepository.save(workoutPlan);
  }

  async removeExerciseFromWorkoutPlan(id: string, exerciseId: string): Promise<WorkoutPlan> {
    const workoutPlan = await this.workoutPlanRepository.findById(id);
    if (!workoutPlan) {
      throw new DomainException('Workout plan not found');
    }

    workoutPlan.removeExercise(exerciseId);
    return await this.workoutPlanRepository.save(workoutPlan);
  }

  async deactivateWorkoutPlan(id: string): Promise<WorkoutPlan> {
    const workoutPlan = await this.workoutPlanRepository.findById(id);
    if (!workoutPlan) {
      throw new DomainException('Workout plan not found');
    }

    workoutPlan.deactivate();
    return await this.workoutPlanRepository.save(workoutPlan);
  }

  async activateWorkoutPlan(id: string): Promise<WorkoutPlan> {
    const workoutPlan = await this.workoutPlanRepository.findById(id);
    if (!workoutPlan) {
      throw new DomainException('Workout plan not found');
    }

    // Check for overlapping active plans
    const existingPlans = await this.workoutPlanRepository.findActiveByUserId(workoutPlan.userId);
    const hasOverlap = existingPlans.some(plan => 
      plan.id !== id && 
      (workoutPlan.startDate <= plan.endDate && workoutPlan.endDate >= plan.startDate)
    );

    if (hasOverlap) {
      throw new DomainException('User already has an active workout plan in this date range');
    }

    workoutPlan.activate();
    return await this.workoutPlanRepository.save(workoutPlan);
  }

  async deleteWorkoutPlan(id: string): Promise<void> {
    const workoutPlan = await this.workoutPlanRepository.findById(id);
    if (!workoutPlan) {
      throw new DomainException('Workout plan not found');
    }

    await this.workoutPlanRepository.delete(id);
  }
}
