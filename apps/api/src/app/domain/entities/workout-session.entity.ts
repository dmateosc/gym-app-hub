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
  rating?: number; // 1-5 qué tan difícil fue
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
    public readonly status: string = 'planned', // 'planned', 'in_progress', 'completed', 'skipped'
    public readonly exercises: SessionExercise[] = [],
    public readonly overallRating?: number,
    public readonly notes?: string,
    public readonly caloriesBurned?: number,
  ) {
    super(id);
  }

  public static create(
    userId: string,
    workoutPlanId: string,
    gymId: string,
    sessionDate: Date,
  ): WorkoutSession {
    const id = this.generateId();
    return new WorkoutSession(
      id,
      userId,
      workoutPlanId,
      gymId,
      sessionDate,
    );
  }

  public startSession(): WorkoutSession {
    return new WorkoutSession(
      this.id,
      this.userId,
      this.workoutPlanId,
      this.gymId,
      this.sessionDate,
      new Date(),
      this.endTime,
      'in_progress',
      this.exercises,
      this.overallRating,
      this.notes,
      this.caloriesBurned,
    );
  }

  public completeSession(
    overallRating?: number,
    notes?: string,
    caloriesBurned?: number,
  ): WorkoutSession {
    return new WorkoutSession(
      this.id,
      this.userId,
      this.workoutPlanId,
      this.gymId,
      this.sessionDate,
      this.startTime,
      new Date(),
      'completed',
      this.exercises,
      overallRating,
      notes,
      caloriesBurned,
    );
  }

  public addExerciseResult(exerciseResult: SessionExercise): WorkoutSession {
    const updatedExercises = [...this.exercises, exerciseResult];
    return new WorkoutSession(
      this.id,
      this.userId,
      this.workoutPlanId,
      this.gymId,
      this.sessionDate,
      this.startTime,
      this.endTime,
      this.status,
      updatedExercises,
      this.overallRating,
      this.notes,
      this.caloriesBurned,
    );
  }

  public getDuration(): number {
    if (!this.startTime || !this.endTime) return 0;
    return Math.floor((this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60)); // minutos
  }

  public getCompletionPercentage(): number {
    if (this.exercises.length === 0) return 0;
    
    const completedExercises = this.exercises.filter(exercise => 
      exercise.completedSets.some(set => set.completed)
    );
    
    return Math.round((completedExercises.length / this.exercises.length) * 100);
  }

  public getTotalSetsCompleted(): number {
    return this.exercises.reduce((total, exercise) => 
      total + exercise.completedSets.filter(set => set.completed).length, 0
    );
  }

  public isCompleted(): boolean {
    return this.status === 'completed';
  }

  public isInProgress(): boolean {
    return this.status === 'in_progress';
  }
}
