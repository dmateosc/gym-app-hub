import { BaseEntity } from '@shared/domain/base.entity';

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  restTime: number;
  notes?: string;
  order: number;
}

export interface WorkoutSchedule {
  daysPerWeek: number;
  preferredDays: string[];
  estimatedDuration: number;
}

export interface CreateWorkoutPlanParams {
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

export interface RestoreWorkoutPlanParams extends CreateWorkoutPlanParams {
  id: string;
  isActive?: boolean;
}

export interface UpdateWorkoutPlanParams {
  name?: string;
  description?: string;
  goal?: string;
  difficulty?: string;
  exercises?: WorkoutExercise[];
  schedule?: WorkoutSchedule;
  isActive?: boolean;
}

export class WorkoutPlan extends BaseEntity {
  constructor(
    id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly userId: string,
    public readonly trainerId: string,
    public readonly gymId: string,
    public readonly goal: string,
    public readonly duration: number,
    public readonly difficulty: string,
    public readonly exercises: WorkoutExercise[],
    public readonly schedule: WorkoutSchedule,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly isActive: boolean = true,
  ) {
    super(id);
  }

  public static create(params: CreateWorkoutPlanParams): WorkoutPlan {
    const id = this.generateId();
    const calculatedEndDate =
      params.endDate ||
      new Date(
        params.startDate.getTime() + params.duration * 7 * 24 * 60 * 60 * 1000,
      );

    return new WorkoutPlan(
      id,
      params.name,
      params.description,
      params.userId,
      params.trainerId,
      params.gymId,
      params.goal,
      params.duration,
      params.difficulty,
      params.exercises,
      params.schedule,
      params.startDate,
      calculatedEndDate,
    );
  }

  public static restore(params: RestoreWorkoutPlanParams): WorkoutPlan {
    const calculatedEndDate =
      params.endDate ||
      new Date(
        params.startDate.getTime() + params.duration * 7 * 24 * 60 * 60 * 1000,
      );

    return new WorkoutPlan(
      params.id,
      params.name,
      params.description,
      params.userId,
      params.trainerId,
      params.gymId,
      params.goal,
      params.duration,
      params.difficulty,
      params.exercises,
      params.schedule,
      params.startDate,
      calculatedEndDate,
      params.isActive ?? true,
    );
  }

  // Simplified update methods
  public update(updates: UpdateWorkoutPlanParams): WorkoutPlan {
    return new WorkoutPlan(
      this.id,
      updates.name ?? this.name,
      updates.description ?? this.description,
      this.userId,
      this.trainerId,
      this.gymId,
      updates.goal ?? this.goal,
      this.duration,
      updates.difficulty ?? this.difficulty,
      updates.exercises ?? this.exercises,
      updates.schedule ?? this.schedule,
      this.startDate,
      this.endDate,
      updates.isActive ?? this.isActive,
    );
  }

  public addExercise(exercise: WorkoutExercise): WorkoutPlan {
    const updatedExercises = [...this.exercises, exercise];
    return this.update({ exercises: updatedExercises });
  }

  public removeExercise(exerciseId: string): WorkoutPlan {
    const updatedExercises = this.exercises.filter(
      ex => ex.exerciseId !== exerciseId,
    );
    return this.update({ exercises: updatedExercises });
  }

  public updateExercise(
    exerciseId: string,
    exerciseUpdates: Partial<WorkoutExercise>,
  ): WorkoutPlan {
    const updatedExercises = this.exercises.map(ex =>
      ex.exerciseId === exerciseId ? { ...ex, ...exerciseUpdates } : ex,
    );
    return this.update({ exercises: updatedExercises });
  }

  // Legacy method support
  public updateName(name: string): WorkoutPlan {
    return this.update({ name });
  }

  public updateDescription(description: string): WorkoutPlan {
    return this.update({ description });
  }

  public updateGoal(goal: string): WorkoutPlan {
    return this.update({ goal });
  }

  public updateDifficulty(difficulty: string): WorkoutPlan {
    return this.update({ difficulty });
  }

  public updateExercises(exercises: WorkoutExercise[]): WorkoutPlan {
    return this.update({ exercises });
  }

  public updateSchedule(schedule: WorkoutSchedule): WorkoutPlan {
    return this.update({ schedule });
  }

  public activate(): WorkoutPlan {
    return this.update({ isActive: true });
  }

  public deactivate(): WorkoutPlan {
    return this.update({ isActive: false });
  }

  // Utility methods
  public validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Name is required');
    }
    if (!this.description || this.description.trim().length === 0) {
      throw new Error('Description is required');
    }
    if (!this.userId) {
      throw new Error('User ID is required');
    }
    if (!this.trainerId) {
      throw new Error('Trainer ID is required');
    }
    if (!this.gymId) {
      throw new Error('Gym ID is required');
    }
    if (this.duration <= 0) {
      throw new Error('Duration must be positive');
    }
    if (this.endDate <= this.startDate) {
      throw new Error('End date must be after start date');
    }
  }

  public getTotalEstimatedTime(): number {
    return this.schedule.estimatedDuration * this.schedule.daysPerWeek;
  }

  public getExerciseCount(): number {
    return this.exercises.length;
  }

  public isExpired(): boolean {
    return new Date() > this.endDate;
  }

  public getDaysRemaining(): number {
    const now = new Date();
    const timeDiff = this.endDate.getTime() - now.getTime();
    return Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
  }
}
