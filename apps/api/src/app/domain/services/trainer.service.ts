import {
  Certification,
  CreateTrainerParams,
  Trainer,
  UpdateTrainerParams,
} from '@entities/trainer-simplified.entity';
import { Injectable } from '@nestjs/common';
import { TrainerRepository } from '@repositories/trainer.repository.interface';
import { DomainException } from '@shared/domain/domain.exception';

// Service DTOs for cleaner API
export interface CreateTrainerRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gymId: string;
  specializations: string[];
  certifications: any[];
  experience: number;
  hourlyRate: number;
  availability: any;
  bio?: string;
  profilePicture?: string;
}

export interface UpdateTrainerRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  specializations?: string[];
  experience?: number;
  hourlyRate?: number;
  availability?: any;
  bio?: string;
  profilePicture?: string;
}

@Injectable()
export class TrainerService {
  constructor(private readonly trainerRepository: TrainerRepository) {}

  async createTrainer(request: CreateTrainerRequest): Promise<Trainer> {
    // Check if email is already taken
    const existingTrainer = await this.trainerRepository.findByEmail(
      request.email
    );
    if (existingTrainer) {
      throw new DomainException('Email is already in use');
    }

    // Validate business rules
    this.validateTrainerData(request);

    const params: CreateTrainerParams = {
      email: request.email,
      name: `${request.firstName} ${request.lastName}`,
      phone: request.phone,
      gymId: request.gymId,
      certifications: this.formatCertifications(request.certifications),
      specialties: request.specializations,
      experience: request.experience,
      bio: request.bio || '',
      profileImage: request.profilePicture,
      hourlyRate: request.hourlyRate,
      availability: request.availability,
    };

    const trainer = Trainer.create(params);
    return await this.trainerRepository.save(trainer);
  }

  async updateTrainer(
    id: string,
    request: UpdateTrainerRequest
  ): Promise<Trainer> {
    const trainer = await this.trainerRepository.findById(id);
    if (!trainer) {
      throw new DomainException('Trainer not found');
    }

    // Validate business rules if applicable
    if (request.experience !== undefined && request.experience < 0) {
      throw new DomainException('Experience cannot be negative');
    }
    if (request.hourlyRate !== undefined && request.hourlyRate <= 0) {
      throw new DomainException('Hourly rate must be positive');
    }

    const updateParams: UpdateTrainerParams = {
      name:
        request.firstName && request.lastName
          ? `${request.firstName} ${request.lastName}`
          : undefined,
      phone: request.phone,
      specialties: request.specializations,
      experience: request.experience,
      hourlyRate: request.hourlyRate,
      availability: request.availability,
      bio: request.bio,
      profileImage: request.profilePicture,
    };

    const updatedTrainer = trainer.update(updateParams);
    return await this.trainerRepository.save(updatedTrainer);
  }

  async addCertification(
    id: string,
    name: string,
    issuer: string,
    dateObtained: Date,
    expiryDate?: Date
  ): Promise<Trainer> {
    const trainer = await this.trainerRepository.findById(id);
    if (!trainer) {
      throw new DomainException('Trainer not found');
    }

    const certification: Certification = {
      name,
      institution: issuer,
      dateObtained,
      expirationDate: expiryDate,
    };

    const updatedTrainer = trainer.addCertification(certification);
    return await this.trainerRepository.save(updatedTrainer);
  }

  async removeCertification(
    id: string,
    certificationName: string
  ): Promise<Trainer> {
    const trainer = await this.trainerRepository.findById(id);
    if (!trainer) {
      throw new DomainException('Trainer not found');
    }

    const updatedTrainer = trainer.removeCertification(certificationName);
    return await this.trainerRepository.save(updatedTrainer);
  }

  async getTrainerById(id: string): Promise<Trainer> {
    const trainer = await this.trainerRepository.findById(id);
    if (!trainer) {
      throw new DomainException('Trainer not found');
    }
    return trainer;
  }

  async getAllTrainers(): Promise<Trainer[]> {
    return await this.trainerRepository.findAll();
  }

  async getTrainersByGymId(gymId: string): Promise<Trainer[]> {
    return await this.trainerRepository.findByGymId(gymId);
  }

  async getActiveTrainersByGymId(gymId: string): Promise<Trainer[]> {
    return await this.trainerRepository.findActiveByGymId(gymId);
  }

  async getTrainersBySpecialization(
    specialization: string
  ): Promise<Trainer[]> {
    return await this.trainerRepository.findBySpecialization(specialization);
  }

  async getAvailableTrainers(
    gymId: string,
    day: string,
    startTime: string,
    endTime: string
  ): Promise<Trainer[]> {
    return await this.trainerRepository.findAvailableTrainers(
      gymId,
      day,
      startTime,
      endTime
    );
  }

  async activateTrainer(id: string): Promise<Trainer> {
    const trainer = await this.trainerRepository.findById(id);
    if (!trainer) {
      throw new DomainException('Trainer not found');
    }

    const updatedTrainer = trainer.activate();
    return await this.trainerRepository.save(updatedTrainer);
  }

  async deactivateTrainer(id: string): Promise<Trainer> {
    const trainer = await this.trainerRepository.findById(id);
    if (!trainer) {
      throw new DomainException('Trainer not found');
    }

    const updatedTrainer = trainer.deactivate();
    return await this.trainerRepository.save(updatedTrainer);
  }

  async updateAvailability(
    id: string,
    day: string,
    isAvailable: boolean,
    startTime?: string,
    endTime?: string
  ): Promise<Trainer> {
    const trainer = await this.trainerRepository.findById(id);
    if (!trainer) {
      throw new DomainException('Trainer not found');
    }

    const validDays = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];
    if (!validDays.includes(day.toLowerCase())) {
      throw new DomainException('Invalid day of week');
    }

    const updatedTrainer = trainer.updateDayAvailability(
      day,
      isAvailable,
      startTime,
      endTime
    );
    return await this.trainerRepository.save(updatedTrainer);
  }

  async checkAvailability(
    id: string,
    day: string,
    startTime: string,
    endTime: string
  ): Promise<boolean> {
    const trainer = await this.trainerRepository.findById(id);
    if (!trainer) {
      throw new DomainException('Trainer not found');
    }

    return trainer.isAvailable(day, startTime, endTime);
  }

  async deleteTrainer(id: string): Promise<void> {
    const trainer = await this.trainerRepository.findById(id);
    if (!trainer) {
      throw new DomainException('Trainer not found');
    }

    await this.trainerRepository.delete(id);
  }

  // Helper methods for validation and formatting
  private validateTrainerData(request: CreateTrainerRequest): void {
    if (request.experience < 0) {
      throw new DomainException('Experience cannot be negative');
    }
    if (request.hourlyRate <= 0) {
      throw new DomainException('Hourly rate must be positive');
    }
    if (request.specializations.length === 0) {
      throw new DomainException('At least one specialization is required');
    }
  }

  private formatCertifications(certifications: any[]): Certification[] {
    return certifications.map(cert => ({
      name: cert.name,
      institution: cert.institution || cert.issuer,
      dateObtained: cert.dateObtained,
      expirationDate: cert.expirationDate || cert.expiryDate,
    }));
  }
}
