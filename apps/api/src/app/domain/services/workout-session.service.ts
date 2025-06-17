import { Injectable } from '@nestjs/common';
import { WorkoutSessionRepositoryInterface } from '../repositories/workout-session.repository.interface';
import { WorkoutSession } from '../entities/workout-session.entity';
import { DomainException } from '../../../shared/domain/domain.exception';

@Injectable()
export class WorkoutSessionService {
  constructor(
    private readonly workoutSessionRepository: WorkoutSessionRepositoryInterface,
  ) {}

  async startWorkoutSession(
    workoutPlanId: string,
    userId: string,
    date: Date,
    startTime: Date,
  ): Promise<WorkoutSession> {
    // Check if user already has an active session
    const activeSessions = await this.workoutSessionRepository.findInProgressByUserId(userId);
    if (activeSessions.length > 0) {
      throw new DomainException('User already has an active workout session');
    }

    const workoutSession = WorkoutSession.start(
      workoutPlanId,
      userId,
      date,
      startTime,
    );

    return await this.workoutSessionRepository.save(workoutSession);
  }

  async completeWorkoutSession(
    id: string,
    endTime: Date,
    exercises: any[],
    totalCaloriesBurned?: number,
    averageHeartRate?: number,
    maxHeartRate?: number,
    notes?: string,
    rating?: number,
  ): Promise<WorkoutSession> {
    const session = await this.workoutSessionRepository.findById(id);
    if (!session) {
      throw new DomainException('Workout session not found');
    }

    if (session.status !== 'in_progress') {
      throw new DomainException('Can only complete sessions that are in progress');
    }

    session.complete(
      endTime,
      exercises,
      totalCaloriesBurned,
      averageHeartRate,
      maxHeartRate,
      notes,
      rating,
    );

    return await this.workoutSessionRepository.save(session);
  }

  async pauseWorkoutSession(id: string): Promise<WorkoutSession> {
    const session = await this.workoutSessionRepository.findById(id);
    if (!session) {
      throw new DomainException('Workout session not found');
    }

    if (session.status !== 'in_progress') {
      throw new DomainException('Can only pause sessions that are in progress');
    }

    session.pause();
    return await this.workoutSessionRepository.save(session);
  }

  async resumeWorkoutSession(id: string): Promise<WorkoutSession> {
    const session = await this.workoutSessionRepository.findById(id);
    if (!session) {
      throw new DomainException('Workout session not found');
    }

    if (session.status !== 'paused') {
      throw new DomainException('Can only resume sessions that are paused');
    }

    session.resume();
    return await this.workoutSessionRepository.save(session);
  }

  async cancelWorkoutSession(id: string): Promise<WorkoutSession> {
    const session = await this.workoutSessionRepository.findById(id);
    if (!session) {
      throw new DomainException('Workout session not found');
    }

    if (session.status === 'completed' || session.status === 'cancelled') {
      throw new DomainException('Cannot cancel a completed or already cancelled session');
    }

    session.cancel();
    return await this.workoutSessionRepository.save(session);
  }

  async updateExerciseProgress(
    sessionId: string,
    exerciseId: string,
    setsCompleted: number,
    repsCompleted: number,
    weightUsed?: number,
    durationCompleted?: number,
    restTimeTaken?: number,
    notes?: string,
    completed?: boolean,
  ): Promise<WorkoutSession> {
    const session = await this.workoutSessionRepository.findById(sessionId);
    if (!session) {
      throw new DomainException('Workout session not found');
    }

    if (session.status !== 'in_progress') {
      throw new DomainException('Can only update exercise progress for sessions in progress');
    }

    session.updateExerciseProgress(
      exerciseId,
      setsCompleted,
      repsCompleted,
      weightUsed,
      durationCompleted,
      restTimeTaken,
      notes,
      completed,
    );

    return await this.workoutSessionRepository.save(session);
  }

  async getWorkoutSessionById(id: string): Promise<WorkoutSession> {
    const session = await this.workoutSessionRepository.findById(id);
    if (!session) {
      throw new DomainException('Workout session not found');
    }
    return session;
  }

  async getAllWorkoutSessions(): Promise<WorkoutSession[]> {
    return await this.workoutSessionRepository.findAll();
  }

  async getWorkoutSessionsByUserId(userId: string): Promise<WorkoutSession[]> {
    return await this.workoutSessionRepository.findByUserId(userId);
  }

  async getWorkoutSessionsByWorkoutPlanId(workoutPlanId: string): Promise<WorkoutSession[]> {
    return await this.workoutSessionRepository.findByWorkoutPlanId(workoutPlanId);
  }

  async getWorkoutSessionsByUserIdAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<WorkoutSession[]> {
    return await this.workoutSessionRepository.findByUserIdAndDateRange(
      userId,
      startDate,
      endDate,
    );
  }

  async getCompletedWorkoutSessionsByUserId(userId: string): Promise<WorkoutSession[]> {
    return await this.workoutSessionRepository.findCompletedByUserId(userId);
  }

  async getActiveWorkoutSessionByUserId(userId: string): Promise<WorkoutSession | null> {
    const activeSessions = await this.workoutSessionRepository.findInProgressByUserId(userId);
    return activeSessions.length > 0 ? activeSessions[0] : null;
  }

  async getWorkoutStatistics(userId: string): Promise<any> {
    const sessions = await this.workoutSessionRepository.findCompletedByUserId(userId);
    
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalDuration: 0,
        totalCaloriesBurned: 0,
        averageRating: 0,
        averageDuration: 0,
        averageCaloriesPerSession: 0,
      };
    }

    const totalDuration = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
    const totalCalories = sessions.reduce((sum, session) => sum + (session.totalCaloriesBurned || 0), 0);
    const totalRating = sessions.reduce((sum, session) => sum + (session.rating || 0), 0);
    const sessionsWithRating = sessions.filter(session => session.rating).length;

    return {
      totalSessions: sessions.length,
      totalDuration,
      totalCaloriesBurned: totalCalories,
      averageRating: sessionsWithRating > 0 ? totalRating / sessionsWithRating : 0,
      averageDuration: totalDuration / sessions.length,
      averageCaloriesPerSession: totalCalories / sessions.length,
    };
  }

  async deleteWorkoutSession(id: string): Promise<void> {
    const session = await this.workoutSessionRepository.findById(id);
    if (!session) {
      throw new DomainException('Workout session not found');
    }

    await this.workoutSessionRepository.delete(id);
  }
}
