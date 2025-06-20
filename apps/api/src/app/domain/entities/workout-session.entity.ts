import { BaseEntity } from '@shared/domain/base.entity';

export interface CompletedSet {
  reps: number;
  weight?: number;
  duration?: number;
  restTime: number;
  completed: boolean;
}

export interface SessionExercise {
  exerciseId: string;
  plannedSets: number;
  completedSets: CompletedSet[];
  notes?: string;
  rating?: number;
}

export class WorkoutSession extends BaseEntity {
  constructor(
    id: string,
    public readonly userId: string,
    public readonly workoutPlanId: string,
    public readonly gymId: string,
    public readonly sessionDate: Date,
    public readonly startTime?: Date,
    public readonly endTime?: Date,
    public readonly status: string = 'planned',
    public readonly exercises: SessionExercise[] = [],
    public readonly overallRating?: number,
    public readonly notes?: string,
    public readonly caloriesBurned?: number
  ) {
    super(id);
  }

  // Factory method for creating new session
  public static create(
    userId: string,
    workoutPlanId: string,
    gymId: string,
    sessionDate: Date
  ): WorkoutSession {
    const id = this.generateId();
    return new WorkoutSession(id, userId, workoutPlanId, gymId, sessionDate);
  }

  // Factory method for starting session
  public static start(
    workoutPlanId: string,
    userId: string,
    gymId: string,
    sessionDate: Date,
    startTime: Date
  ): WorkoutSession {
    const id = this.generateId();
    return new WorkoutSession(
      id,
      userId,
      workoutPlanId,
      gymId,
      sessionDate,
      startTime,
      undefined,
      'in_progress'
    );
  }

  // Factory method for restoration from database
  public static restore(data: {
    id: string;
    userId: string;
    workoutPlanId: string;
    gymId: string;
    sessionDate: Date;
    startTime?: Date;
    endTime?: Date;
    status?: string;
    exercises?: SessionExercise[];
    overallRating?: number;
    notes?: string;
    caloriesBurned?: number;
  }): WorkoutSession {
    return new WorkoutSession(
      data.id,
      data.userId,
      data.workoutPlanId,
      data.gymId,
      data.sessionDate,
      data.startTime,
      data.endTime,
      data.status ?? 'planned',
      data.exercises ?? [],
      data.overallRating,
      data.notes,
      data.caloriesBurned
    );
  }

  // Unified update method
  public update(
    updates: Partial<{
      startTime: Date;
      endTime: Date;
      status: string;
      exercises: SessionExercise[];
      overallRating: number;
      notes: string;
      caloriesBurned: number;
    }>
  ): WorkoutSession {
    return new WorkoutSession(
      this.id,
      this.userId,
      this.workoutPlanId,
      this.gymId,
      this.sessionDate,
      updates.startTime ?? this.startTime,
      updates.endTime ?? this.endTime,
      updates.status ?? this.status,
      updates.exercises ?? this.exercises,
      updates.overallRating ?? this.overallRating,
      updates.notes ?? this.notes,
      updates.caloriesBurned ?? this.caloriesBurned
    );
  }

  // State transition methods
  public start(): WorkoutSession {
    return this.update({
      startTime: new Date(),
      status: 'in_progress',
    });
  }

  public complete(
    endTime: Date,
    exercises: SessionExercise[],
    overallRating?: number,
    notes?: string,
    caloriesBurned?: number
  ): WorkoutSession {
    return this.update({
      endTime,
      exercises,
      status: 'completed',
      overallRating,
      notes,
      caloriesBurned,
    });
  }

  public pause(): WorkoutSession {
    return this.update({ status: 'paused' });
  }

  public resume(): WorkoutSession {
    return this.update({ status: 'in_progress' });
  }

  public cancel(): WorkoutSession {
    return this.update({ status: 'cancelled' });
  }

  // Exercise management
  public addExerciseResult(exerciseResult: SessionExercise): WorkoutSession {
    const updatedExercises = [...this.exercises, exerciseResult];
    return this.update({ exercises: updatedExercises });
  }

  public updateExerciseProgress(data: {
    exerciseId: string;
    sets: number;
    reps: number;
    weight?: number;
    duration?: number;
    restTime?: number;
    notes?: string;
    completed?: boolean;
  }): WorkoutSession {
    const updatedExercises = [...this.exercises];
    const exerciseIndex = updatedExercises.findIndex(
      ex => ex.exerciseId === data.exerciseId
    );

    if (exerciseIndex >= 0) {
      const exercise = updatedExercises[exerciseIndex];
      const newSet: CompletedSet = {
        reps: data.reps,
        weight: data.weight,
        duration: data.duration,
        restTime: data.restTime ?? 60,
        completed: data.completed ?? true,
      };

      const updatedExercise: SessionExercise = {
        ...exercise,
        completedSets: [...exercise.completedSets, newSet],
        notes: data.notes ?? exercise.notes,
      };

      updatedExercises[exerciseIndex] = updatedExercise;
    }

    return this.update({ exercises: updatedExercises });
  }

  // Computed properties for backward compatibility
  public getDuration(): number {
    if (!this.startTime || !this.endTime) return 0;
    return this.endTime.getTime() - this.startTime.getTime();
  }

  public getCompletionPercentage(): number {
    if (this.exercises.length === 0) return 0;
    const completedExercises = this.exercises.filter(
      exercise => exercise.completedSets.length >= exercise.plannedSets
    );
    return (completedExercises.length / this.exercises.length) * 100;
  }

  public getTotalSetsCompleted(): number {
    return this.exercises.reduce(
      (total, exercise) => total + exercise.completedSets.length,
      0
    );
  }

  public isCompleted(): boolean {
    return this.status === 'completed';
  }

  public isInProgress(): boolean {
    return this.status === 'in_progress';
  }

  public isPaused(): boolean {
    return this.status === 'paused';
  }

  public isCancelled(): boolean {
    return this.status === 'cancelled';
  }

  public isPlanned(): boolean {
    return this.status === 'planned';
  }
}
