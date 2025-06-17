import { Injectable, Inject } from '@nestjs/common';
import { Gym } from '@entities/gym.entity';
import { GymRepository } from '@repositories/gym.repository.interface';

@Injectable()
export class GymService {
  constructor(
    @Inject('GymRepository')
    private readonly gymRepository: GymRepository,
  ) {}

  async getAllGyms(): Promise<Gym[]> {
    return this.gymRepository.findAll();
  }

  async getGymById(id: string): Promise<Gym | null> {
    return this.gymRepository.findById(id);
  }

  async getGymsByCity(city: string): Promise<Gym[]> {
    return this.gymRepository.findByCity(city);
  }

  async getActiveGyms(): Promise<Gym[]> {
    return this.gymRepository.findActiveGyms();
  }

  async createGym(gymData: {
    name: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    phone: string;
    email: string;
    operatingHours: {
      monday: { open: string; close: string; isClosed: boolean };
      tuesday: { open: string; close: string; isClosed: boolean };
      wednesday: { open: string; close: string; isClosed: boolean };
      thursday: { open: string; close: string; isClosed: boolean };
      friday: { open: string; close: string; isClosed: boolean };
      saturday: { open: string; close: string; isClosed: boolean };
      sunday: { open: string; close: string; isClosed: boolean };
    };
    facilities: string[];
    maxCapacity: number;
  }): Promise<Gym> {
    const gym = Gym.create(
      gymData.name,
      gymData.address,
      gymData.phone,
      gymData.email,
      gymData.operatingHours,
      gymData.facilities,
      gymData.maxCapacity,
    );
    
    return this.gymRepository.save(gym);
  }

  async updateGym(id: string, gymData: Partial<Gym>): Promise<Gym> {
    return this.gymRepository.update(id, gymData);
  }

  async deleteGym(id: string): Promise<void> {
    return this.gymRepository.delete(id);
  }

  async checkCapacity(gymId: string, currentUsers: number): Promise<boolean> {
    const gym = await this.gymRepository.findById(gymId);
    return gym ? gym.isWithinCapacity(currentUsers) : false;
  }

  async isGymOpen(gymId: string, day: string, time: string): Promise<boolean> {
    return this.gymRepository.isWithinOperatingHours(gymId, day, time);
  }
}
