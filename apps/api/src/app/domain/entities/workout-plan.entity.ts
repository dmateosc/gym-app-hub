import { BaseEntity } from '@shared/domain/base.entity';

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number; // Para ejercicios de tiempo (cardio)
  restTime: number; // Tiempo de descanso en segundos
  notes?: string;
  order: number; // Orden en la rutina
}

export interface WorkoutSchedule {
  daysPerWeek: number;
  preferredDays: string[]; // ['monday', 'wednesday', 'friday']
  estimatedDuration: number; // Duración estimada por sesión en minutos
}

export class WorkoutPlan extends BaseEntity {
  constructor(
    id: string,
    private _name: string,
    private _description: string,
    public readonly userId: string,
    public readonly trainerId: string,
    public readonly gymId: string,
    private _goal: string, // 'weight_loss', 'muscle_gain', 'endurance', 'strength'
    public readonly duration: number, // Duración en semanas
    private _difficulty: string,
    private _exercises: WorkoutExercise[],
    private _schedule: WorkoutSchedule,
    public readonly startDate: Date,
    public readonly endDate: Date,
    private _isActive: boolean = true,
  ) {
    super(id);
  }

  // Getters
  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get goal(): string {
    return this._goal;
  }

  get difficulty(): string {
    return this._difficulty;
  }

  get exercises(): WorkoutExercise[] {
    return [...this._exercises];
  }

  get schedule(): WorkoutSchedule {
    return { ...this._schedule };
  }

  get isActive(): boolean {
    return this._isActive;
  }

  public static create(createParams: {
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
  }): WorkoutPlan {
    const id = crypto.randomUUID();
    const endDate = new Date(createParams.startDate);
    endDate.setDate(
      createParams.startDate.getDate() + createParams.duration * 7,
    );

    return new WorkoutPlan(
      id,
      createParams.name,
      createParams.description,
      createParams.userId,
      createParams.trainerId,
      createParams.gymId,
      createParams.goal,
      createParams.duration,
      createParams.difficulty,
      createParams.exercises,
      createParams.schedule,
      createParams.startDate,
      endDate,
    );
  }

  public static restore(params: {
    id: string;
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
    endDate: Date;
    isActive?: boolean;
  }): WorkoutPlan {
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
      params.endDate,
      params.isActive ?? true,
    );
  }

  public updateName(name: string): void {
    this._name = name;
  }

  public updateDescription(description: string): void {
    this._description = description;
  }

  public updateGoal(goal: string): void {
    this._goal = goal;
  }

  public updateDifficulty(difficulty: string): void {
    this._difficulty = difficulty;
  }

  public updateExercises(exercises: WorkoutExercise[]): void {
    this._exercises = [...exercises];
  }

  public updateSchedule(schedule: WorkoutSchedule): void {
    this._schedule = { ...schedule };
  }

  public setActive(isActive: boolean): void {
    this._isActive = isActive;
  }

  public activate(): void {
    this._isActive = true;
  }

  public deactivate(): void {
    this._isActive = false;
  }

  public getTotalExercises(): number {
    return this._exercises.length;
  }

  public getEstimatedSessionDuration(): number {
    return this._schedule.estimatedDuration;
  }

  public isExpired(): boolean {
    return new Date() > this.endDate;
  }

  public addExercise(exercise: WorkoutExercise): void {
    this._exercises.push(exercise);
  }

  public removeExercise(exerciseId: string): void {
    this._exercises = this._exercises.filter(
      ex => ex.exerciseId !== exerciseId,
    );
  }

  public getExercisesByMuscleGroup(): WorkoutExercise[] {
    // Esta función requeriría acceso a la información de ejercicios
    // En una implementación real, se pasaría como dependencia
    return this._exercises; // Placeholder
  }

  public validate(): void {
    if (!this._name || this._name.trim().length === 0) {
      throw new Error('Name is required');
    }
    if (!this._description || this._description.trim().length === 0) {
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
}
