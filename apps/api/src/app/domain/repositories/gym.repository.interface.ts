import { Gym } from '@entities/gym.entity';

export interface GymRepository {
  findAll(): Promise<Gym[]>;
  findById(id: string): Promise<Gym | null>;
  findByCity(city: string): Promise<Gym[]>;
  findByState(state: string): Promise<Gym[]>;
  findActiveGyms(): Promise<Gym[]>;
  save(gym: Gym): Promise<Gym>;
  update(id: string, gym: Partial<Gym>): Promise<Gym>;
  delete(id: string): Promise<void>;
  findByCapacityRange(minCapacity: number, maxCapacity: number): Promise<Gym[]>;
  isWithinOperatingHours(
    gymId: string,
    day: string,
    time: string,
  ): Promise<boolean>;
}
