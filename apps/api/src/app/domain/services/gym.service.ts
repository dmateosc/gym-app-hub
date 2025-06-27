import { Injectable, Inject } from '@nestjs/common';
import {
  Gym,
  CreateGymParams,
  Address,
  OperatingHours,
} from '@entities/gym.entity';
import { GymRepository } from '@repositories/gym.repository.interface';
import { DomainException } from '@shared/domain/domain.exception';

// Service DTOs for cleaner API
export interface CreateGymRequest {
  name: string;
  address: Address;
  phone: string;
  email: string;
  operatingHours: OperatingHours;
  facilities: string[];
  maxCapacity: number;
}

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

  async createGym(request: CreateGymRequest): Promise<Gym> {
    // Validate business rules
    this.validateGymData(request);

    const params: CreateGymParams = {
      name: request.name,
      address: request.address,
      phone: request.phone,
      email: request.email,
      operatingHours: request.operatingHours,
      facilities: request.facilities,
      maxCapacity: request.maxCapacity,
    };

    const gym = Gym.create(params);
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
    const gym = await this.gymRepository.findById(gymId);
    return gym ? gym.isOpenAt(day, time) : false;
  }

  // Private validation helper methods
  private validateGymData(request: CreateGymRequest): void {
    if (!request.name.trim()) {
      throw new DomainException('Gym name cannot be empty');
    }
    if (!request.email.trim()) {
      throw new DomainException('Gym email cannot be empty');
    }
    if (!request.phone.trim()) {
      throw new DomainException('Gym phone cannot be empty');
    }
    if (request.maxCapacity <= 0) {
      throw new DomainException('Gym capacity must be positive');
    }
    if (!request.facilities || request.facilities.length === 0) {
      throw new DomainException('Gym must have at least one facility');
    }
  }
}
