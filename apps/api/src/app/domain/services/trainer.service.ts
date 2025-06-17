import { Injectable } from '@nestjs/common';
import { TrainerRepository } from '@repositories/trainer.repository.interface';
import { Trainer } from '@entities/trainer.entity';
import { DomainException } from '@shared/domain/domain.exception';

@Injectable()
export class TrainerService {
  constructor(
    private readonly trainerRepository: TrainerRepository,
  ) {}

  async createTrainer(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    gymId: string,
    specializations: string[],
    certifications: any[],
    experience: number,
    hourlyRate: number,
    availability: any,
    bio?: string,
    profilePicture?: string,
  ): Promise<Trainer> {
    // Check if email is already taken
    const existingTrainer = await this.trainerRepository.findByEmail(email);
    if (existingTrainer) {
      throw new DomainException('Email is already in use');
    }

    // Validate experience
    if (experience < 0) {
      throw new DomainException('Experience cannot be negative');
    }

    // Validate hourly rate
    if (hourlyRate <= 0) {
      throw new DomainException('Hourly rate must be positive');
    }

    // Validate specializations
    if (specializations.length === 0) {
      throw new DomainException('At least one specialization is required');
    }

    const trainer = Trainer.create(
      firstName,
      lastName,
      email,
      phone,
      gymId,
      specializations,
      certifications,
      experience,
      hourlyRate,
      availability,
      bio,
      profilePicture,
    );

    return await this.trainerRepository.save(trainer);
  }

  async updateTrainer(
    id: string,
    firstName?: string,
    lastName?: string,
    phone?: string,
    specializations?: string[],
    experience?: number,
    hourlyRate?: number,
    availability?: any,
    bio?: string,
    profilePicture?: string,
  ): Promise<Trainer> {
    const trainer = await this.trainerRepository.findById(id);
    if (!trainer) {
      throw new DomainException('Trainer not found');
    }

    if (firstName) trainer.updateFirstName(firstName);
    if (lastName) trainer.updateLastName(lastName);
    if (phone) trainer.updatePhone(phone);
    if (specializations) trainer.updateSpecializations(specializations);
    if (experience !== undefined) {
      if (experience < 0) {
        throw new DomainException('Experience cannot be negative');
      }
      trainer.updateExperience(experience);
    }
    if (hourlyRate !== undefined) {
      if (hourlyRate <= 0) {
        throw new DomainException('Hourly rate must be positive');
      }
      trainer.updateHourlyRate(hourlyRate);
    }
    if (availability) trainer.updateAvailability(availability);
    if (bio !== undefined) trainer.updateBio(bio);
    if (profilePicture !== undefined) trainer.updateProfilePicture(profilePicture);

    return await this.trainerRepository.save(trainer);
  }

  async addCertification(
    id: string,
    name: string,
    issuer: string,
    dateObtained: Date,
    expiryDate?: Date,
  ): Promise<Trainer> {
    const trainer = await this.trainerRepository.findById(id);
    if (!trainer) {
      throw new DomainException('Trainer not found');
    }

    const certification = {
      name,
      issuer,
      dateObtained,
      expiryDate,
      isActive: true,
    };

    trainer.addCertification(certification);
    return await this.trainerRepository.save(trainer);
  }

  async removeCertification(id: string, certificationName: string): Promise<Trainer> {
    const trainer = await this.trainerRepository.findById(id);
    if (!trainer) {
      throw new DomainException('Trainer not found');
    }

    trainer.removeCertification(certificationName);
    return await this.trainerRepository.save(trainer);
  }

  async updateRating(id: string, newRating: number): Promise<Trainer> {
    const trainer = await this.trainerRepository.findById(id);
    if (!trainer) {
      throw new DomainException('Trainer not found');
    }

    if (newRating < 0 || newRating > 5) {
      throw new DomainException('Rating must be between 0 and 5');
    }

    trainer.updateRating(newRating);
    return await this.trainerRepository.save(trainer);
  }

  async incrementClientCount(id: string): Promise<Trainer> {
    const trainer = await this.trainerRepository.findById(id);
    if (!trainer) {
      throw new DomainException('Trainer not found');
    }

    trainer.incrementClientCount();
    return await this.trainerRepository.save(trainer);
  }

  async decrementClientCount(id: string): Promise<Trainer> {
    const trainer = await this.trainerRepository.findById(id);
    if (!trainer) {
      throw new DomainException('Trainer not found');
    }

    trainer.decrementClientCount();
    return await this.trainerRepository.save(trainer);
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

  async getTrainersBySpecialization(specialization: string): Promise<Trainer[]> {
    return await this.trainerRepository.findBySpecialization(specialization);
  }

  async getAvailableTrainers(
    gymId: string,
    day: string,
    startTime: string,
    endTime: string,
  ): Promise<Trainer[]> {
    return await this.trainerRepository.findAvailableTrainers(gymId, day, startTime, endTime);
  }

  async getTopRatedTrainersByGym(gymId: string, limit: number = 10): Promise<Trainer[]> {
    return await this.trainerRepository.findTopRatedByGymId(gymId, limit);
  }

  async activateTrainer(id: string): Promise<Trainer> {
    const trainer = await this.trainerRepository.findById(id);
    if (!trainer) {
      throw new DomainException('Trainer not found');
    }

    trainer.activate();
    return await this.trainerRepository.save(trainer);
  }

  async deactivateTrainer(id: string): Promise<Trainer> {
    const trainer = await this.trainerRepository.findById(id);
    if (!trainer) {
      throw new DomainException('Trainer not found');
    }

    trainer.deactivate();
    return await this.trainerRepository.save(trainer);
  }

  async updateAvailability(
    id: string,
    day: string,
    isAvailable: boolean,
    startTime?: string,
    endTime?: string,
  ): Promise<Trainer> {
    const trainer = await this.trainerRepository.findById(id);
    if (!trainer) {
      throw new DomainException('Trainer not found');
    }

    const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    if (!validDays.includes(day.toLowerCase())) {
      throw new DomainException('Invalid day of week');
    }

    trainer.updateDayAvailability(day, isAvailable, startTime, endTime);
    return await this.trainerRepository.save(trainer);
  }

  async checkAvailability(
    id: string,
    day: string,
    startTime: string,
    endTime: string,
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
}
