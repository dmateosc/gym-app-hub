import { WorkoutSession } from '@entities/workout-session.entity';

export interface WorkoutSessionRepository {
  findAll(): Promise<WorkoutSession[]>;
  findById(id: string): Promise<WorkoutSession | null>;
  findByUserId(userId: string): Promise<WorkoutSession[]>;
  findByWorkoutPlanId(workoutPlanId: string): Promise<WorkoutSession[]>;
  findByGymId(gymId: string): Promise<WorkoutSession[]>;
  findByStatus(status: string): Promise<WorkoutSession[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<WorkoutSession[]>;
  findByUserAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<WorkoutSession[]>;
  findCompletedSessions(userId: string): Promise<WorkoutSession[]>;
  findInProgressSessions(): Promise<WorkoutSession[]>;
  findInProgressByUserId(userId: string): Promise<WorkoutSession[]>;
  findCompletedByUserId(userId: string): Promise<WorkoutSession[]>;
  findByUserIdAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<WorkoutSession[]>;
  save(workoutSession: WorkoutSession): Promise<WorkoutSession>;
  update(
    id: string,
    workoutSession: Partial<WorkoutSession>,
  ): Promise<WorkoutSession>;
  delete(id: string): Promise<void>;
  getSessionStats(userId: string): Promise<{
    totalSessions: number;
    completedSessions: number;
    totalCaloriesBurned: number;
    averageRating: number;
  }>;
}
