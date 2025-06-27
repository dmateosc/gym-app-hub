import { Injectable } from '@nestjs/common';
import { DomainException } from '../../../shared/domain/domain.exception';
import {
  SessionExercise,
  WorkoutSession,
} from '../entities/workout-session.entity';
import { WorkoutPlanRepository } from '../repositories/workout-plan.repository.interface';
import { WorkoutSessionRepository } from '../repositories/workout-session.repository.interface';

// Service DTOs for cleaner API
export interface CompleteWorkoutSessionRequest {
  id: string;
  endTime: Date;
  exercises: CompletedExerciseData[];
  totalCaloriesBurned?: number;
  averageHeartRate?: number;
  maxHeartRate?: number;
  notes?: string;
  rating?: number;
}

export interface CompletedExerciseData {
  exerciseId: string;
  setsCompleted: number;
  repsCompleted: number;
  weightUsed?: number;
  durationCompleted?: number;
  restTimeTaken?: number;
  notes?: string;
  completed?: boolean;
  rating?: number;
}

export interface UpdateExerciseProgressRequest {
  sessionId: string;
  exerciseId: string;
  setsCompleted: number;
  repsCompleted: number;
  weightUsed?: number;
  durationCompleted?: number;
  restTimeTaken?: number;
  notes?: string;
  completed?: boolean;
}

// New DTO for start workout session
export interface StartWorkoutSessionRequest {
  workoutPlanId: string;
  userId: string;
  sessionDate: Date;
  startTime: Date;
}

@Injectable()
export class WorkoutSessionService {
  constructor(
    private readonly workoutSessionRepository: WorkoutSessionRepository,
    private readonly workoutPlanRepository: WorkoutPlanRepository,
  ) {}

  async startWorkoutSession(
    request: StartWorkoutSessionRequest,
  ): Promise<WorkoutSession> {
    // Check if user already has an active session
    const activeSessions =
      await this.workoutSessionRepository.findInProgressByUserId(
        request.userId,
      );
    if (activeSessions.length > 0) {
      throw new DomainException('User already has an active workout session');
    }

    // Get workout plan to derive gymId
    const workoutPlan = await this.workoutPlanRepository.findById(
      request.workoutPlanId,
    );
    if (!workoutPlan) {
      throw new DomainException('Workout plan not found');
    }

    const workoutSession = WorkoutSession.start(
      request.workoutPlanId,
      request.userId,
      workoutPlan.gymId,
      request.sessionDate,
      request.startTime,
    );

    return await this.workoutSessionRepository.save(workoutSession);
  }

  async completeWorkoutSession(
    request: CompleteWorkoutSessionRequest,
  ): Promise<WorkoutSession> {
    const session = await this.workoutSessionRepository.findById(request.id);
    if (!session) {
      throw new DomainException('Workout session not found');
    }

    if (session.status !== 'in_progress') {
      throw new DomainException(
        'Can only complete sessions that are in progress',
      );
    }

    // Convert DTO exercises to SessionExercise format
    const sessionExercises: SessionExercise[] = request.exercises.map(
      (exercise: CompletedExerciseData) => ({
        exerciseId: exercise.exerciseId,
        plannedSets: exercise.setsCompleted || 1,
        completedSets: [
          {
            reps: exercise.repsCompleted || 0,
            weight: exercise.weightUsed,
            duration: exercise.durationCompleted,
            restTime: exercise.restTimeTaken || 60,
            completed: exercise.completed || true,
          },
        ],
        notes: exercise.notes,
        rating: exercise.rating,
      }),
    );

    const updatedSession = session.complete(
      request.endTime,
      sessionExercises,
      request.rating,
      request.notes,
      request.totalCaloriesBurned,
    );

    return await this.workoutSessionRepository.save(updatedSession);
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
      throw new DomainException(
        'Cannot cancel a completed or already cancelled session',
      );
    }

    session.cancel();
    return await this.workoutSessionRepository.save(session);
  }

  async updateExerciseProgress(
    request: UpdateExerciseProgressRequest,
  ): Promise<WorkoutSession> {
    const session = await this.workoutSessionRepository.findById(
      request.sessionId,
    );
    if (!session) {
      throw new DomainException('Workout session not found');
    }

    if (session.status !== 'in_progress') {
      throw new DomainException(
        'Can only update exercise progress for sessions in progress',
      );
    }

    const updatedSession = session.updateExerciseProgress({
      exerciseId: request.exerciseId,
      sets: request.setsCompleted,
      reps: request.repsCompleted,
      weight: request.weightUsed,
      duration: request.durationCompleted,
      restTime: request.restTimeTaken,
      notes: request.notes,
      completed: request.completed,
    });

    return await this.workoutSessionRepository.save(updatedSession);
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

  async getWorkoutSessionsByWorkoutPlanId(
    workoutPlanId: string,
  ): Promise<WorkoutSession[]> {
    return await this.workoutSessionRepository.findByWorkoutPlanId(
      workoutPlanId,
    );
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

  async getCompletedWorkoutSessionsByUserId(
    userId: string,
  ): Promise<WorkoutSession[]> {
    return await this.workoutSessionRepository.findCompletedByUserId(userId);
  }

  async getActiveWorkoutSessionByUserId(
    userId: string,
  ): Promise<WorkoutSession | null> {
    const activeSessions =
      await this.workoutSessionRepository.findInProgressByUserId(userId);
    return activeSessions.length > 0 ? activeSessions[0] : null;
  }

  async getWorkoutStatistics(userId: string): Promise<any> {
    const sessions =
      await this.workoutSessionRepository.findCompletedByUserId(userId);

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

    const totalDuration = sessions.reduce(
      (sum, session) => sum + (session.getDuration() || 0),
      0,
    );
    const totalCalories = sessions.reduce(
      (sum, session) => sum + (session.caloriesBurned || 0),
      0,
    );
    const totalRating = sessions.reduce(
      (sum, session) => sum + (session.overallRating || 0),
      0,
    );
    const sessionsWithRating = sessions.filter(
      session => session.overallRating,
    ).length;

    return {
      totalSessions: sessions.length,
      totalDuration,
      totalCaloriesBurned: totalCalories,
      averageRating:
        sessionsWithRating > 0 ? totalRating / sessionsWithRating : 0,
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
