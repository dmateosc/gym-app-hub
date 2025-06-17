import { WorkoutPlan } from '@entities/workout-plan.entity';

export interface WorkoutPlanRepository {
  findAll(): Promise<WorkoutPlan[]>;
  findById(id: string): Promise<WorkoutPlan | null>;
  findByUserId(userId: string): Promise<WorkoutPlan[]>;
  findByTrainerId(trainerId: string): Promise<WorkoutPlan[]>;
  findByGymId(gymId: string): Promise<WorkoutPlan[]>;
  findByGoal(goal: string): Promise<WorkoutPlan[]>;
  findActivePlans(): Promise<WorkoutPlan[]>;
  findExpiredPlans(): Promise<WorkoutPlan[]>;
  findByUserAndActive(userId: string): Promise<WorkoutPlan[]>;
  findActiveByUserId(userId: string): Promise<WorkoutPlan[]>;
  save(workoutPlan: WorkoutPlan): Promise<WorkoutPlan>;
  update(id: string, workoutPlan: Partial<WorkoutPlan>): Promise<WorkoutPlan>;
  delete(id: string): Promise<void>;
  findByDateRange(startDate: Date, endDate: Date): Promise<WorkoutPlan[]>;
}
