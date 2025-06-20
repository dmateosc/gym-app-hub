import { Trainer } from '@entities/trainer-simplified.entity';

export interface TrainerRepository {
  findAll(): Promise<Trainer[]>;
  findById(id: string): Promise<Trainer | null>;
  findByGymId(gymId: string): Promise<Trainer[]>;
  findBySpecialty(specialty: string): Promise<Trainer[]>;
  findBySpecialization(specialization: string): Promise<Trainer[]>; // Alias for findBySpecialty
  findByExperienceLevel(level: string): Promise<Trainer[]>;
  findAvailableAt(day: string, time: string): Promise<Trainer[]>;
  findAvailableTrainers(
    gymId: string,
    day: string,
    startTime: string,
    endTime: string
  ): Promise<Trainer[]>;
  findByEmail(email: string): Promise<Trainer | null>;
  save(trainer: Trainer): Promise<Trainer>;
  update(id: string, trainer: Partial<Trainer>): Promise<Trainer>;
  delete(id: string): Promise<void>;
  findActiveTrainers(): Promise<Trainer[]>;
  findActiveByGymId(gymId: string): Promise<Trainer[]>;
  findTopRatedByGymId(gymId: string, limit?: number): Promise<Trainer[]>;
  findByRateRange(minRate: number, maxRate: number): Promise<Trainer[]>;
}
