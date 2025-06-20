/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Trainer } from '../../../../domain/entities/trainer-simplified.entity';
import { TrainerRepository } from '../../../../domain/repositories/trainer.repository.interface';
import { TrainerSchema } from './trainer.schema';

@Injectable()
export class MongoTrainerRepository implements TrainerRepository {
  constructor(
    @InjectModel(TrainerSchema.name)
    private readonly trainerModel: Model<TrainerSchema>
  ) {}

  async save(trainer: Trainer): Promise<Trainer> {
    const nameParts = trainer.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const trainerData = {
      firstName,
      lastName,
      email: trainer.email,
      phone: trainer.phone,
      gymId: new Types.ObjectId(trainer.gymId),
      specializations: trainer.specialties,
      certifications: trainer.certifications.map(cert => ({
        name: cert.name,
        issuer: cert.institution,
        dateObtained: cert.dateObtained,
        expiryDate: cert.expirationDate,
        isActive: true,
      })),
      experience: trainer.experience,
      hourlyRate: trainer.hourlyRate,
      availability: trainer.availability
        ? {
            monday: trainer.availability.monday,
            tuesday: trainer.availability.tuesday,
            wednesday: trainer.availability.wednesday,
            thursday: trainer.availability.thursday,
            friday: trainer.availability.friday,
            saturday: trainer.availability.saturday,
            sunday: trainer.availability.sunday,
          }
        : {},
      bio: trainer.bio,
      profilePicture: trainer.profileImage,
      rating: trainer.rating,
      totalClients: trainer.totalClients,
      isActive: trainer.isActive,
    };

    if (trainer.id) {
      const updated = await this.trainerModel.findByIdAndUpdate(
        trainer.id,
        trainerData,
        { new: true }
      );
      return this.toDomain(updated!);
    } else {
      const created = await this.trainerModel.create(trainerData);
      return this.toDomain(created);
    }
  }

  async findById(id: string): Promise<Trainer | null> {
    const trainer = await this.trainerModel.findById(id).populate('gymId');

    return trainer ? this.toDomain(trainer) : null;
  }

  async findAll(): Promise<Trainer[]> {
    const trainers = await this.trainerModel
      .find()
      .populate('gymId')
      .sort({ createdAt: -1 });

    return trainers.map(trainer => this.toDomain(trainer));
  }

  async findByGymId(gymId: string): Promise<Trainer[]> {
    const trainers = await this.trainerModel
      .find({ gymId: new Types.ObjectId(gymId) })
      .populate('gymId')
      .sort({ rating: -1 });

    return trainers.map(trainer => this.toDomain(trainer));
  }

  async findByEmail(email: string): Promise<Trainer | null> {
    const trainer = await this.trainerModel
      .findOne({ email: email.toLowerCase() })
      .populate('gymId');

    return trainer ? this.toDomain(trainer) : null;
  }

  async findActiveByGymId(gymId: string): Promise<Trainer[]> {
    const trainers = await this.trainerModel
      .find({
        gymId: new Types.ObjectId(gymId),
        isActive: true,
      })
      .populate('gymId')
      .sort({ rating: -1 });

    return trainers.map(trainer => this.toDomain(trainer));
  }

  async findBySpecialization(specialization: string): Promise<Trainer[]> {
    const trainers = await this.trainerModel
      .find({
        specializations: { $in: [specialization] },
        isActive: true,
      })
      .populate('gymId')
      .sort({ rating: -1 });

    return trainers.map(trainer => this.toDomain(trainer));
  }

  async findAvailableTrainers(
    gymId: string,
    day: string,
    startTime: string,
    endTime: string
  ): Promise<Trainer[]> {
    const trainers = await this.trainerModel
      .find({
        gymId: new Types.ObjectId(gymId),
        isActive: true,
        [`availability.${day.toLowerCase()}.isAvailable`]: true,
      })
      .populate('gymId');

    // Filter trainers based on availability hours
    return trainers
      .filter(trainer => {
        if (!trainer.availability) return false;

        const dayAvailability =
          trainer.availability[
            day.toLowerCase() as keyof typeof trainer.availability
          ];
        if (!dayAvailability || !Array.isArray(dayAvailability)) return false;

        return dayAvailability.some(
          slot =>
            slot.isAvailable &&
            slot.startTime <= startTime &&
            slot.endTime >= endTime
        );
      })
      .map(trainer => this.toDomain(trainer))
      .sort((a, b) => b.rating - a.rating);
  }

  async findTopRatedByGymId(
    gymId: string,
    limit: number = 10
  ): Promise<Trainer[]> {
    const trainers = await this.trainerModel
      .find({
        gymId: new Types.ObjectId(gymId),
        isActive: true,
      })
      .populate('gymId')
      .sort({ rating: -1 })
      .limit(limit);

    return trainers.map(trainer => this.toDomain(trainer));
  }

  async findBySpecialty(specialty: string): Promise<Trainer[]> {
    return this.findBySpecialization(specialty);
  }

  async findByExperienceLevel(level: string): Promise<Trainer[]> {
    const experienceMap: { [key: string]: { min: number; max?: number } } = {
      beginner: { min: 0, max: 2 },
      intermediate: { min: 2, max: 5 },
      advanced: { min: 5, max: 10 },
      expert: { min: 10 },
    };

    const range = experienceMap[level.toLowerCase()];
    if (!range) return [];

    const filter: any = {
      experience: { $gte: range.min },
      isActive: true,
    };

    if (range.max) {
      filter.experience.$lt = range.max;
    }

    const trainers = await this.trainerModel
      .find(filter)
      .populate('gymId')
      .sort({ rating: -1 });

    return trainers.map(trainer => this.toDomain(trainer));
  }

  async findAvailableAt(day: string, time: string): Promise<Trainer[]> {
    const trainers = await this.trainerModel
      .find({
        isActive: true,
        [`availability.${day.toLowerCase()}.isAvailable`]: true,
      })
      .populate('gymId');

    // Filter based on time availability
    return trainers
      .filter(trainer => {
        if (!trainer.availability) return false;

        const dayAvailability =
          trainer.availability[
            day.toLowerCase() as keyof typeof trainer.availability
          ];
        if (!dayAvailability || !Array.isArray(dayAvailability)) return false;

        return dayAvailability.some(
          slot =>
            slot.isAvailable && slot.startTime <= time && slot.endTime >= time
        );
      })
      .map(trainer => this.toDomain(trainer));
  }

  async update(id: string, trainer: Partial<Trainer>): Promise<Trainer> {
    const updated = await this.trainerModel.findByIdAndUpdate(id, trainer, {
      new: true,
    });

    if (!updated) {
      throw new Error(`Trainer with id ${id} not found`);
    }

    return this.toDomain(updated);
  }

  async findActiveTrainers(): Promise<Trainer[]> {
    const trainers = await this.trainerModel
      .find({ isActive: true })
      .populate('gymId')
      .sort({ rating: -1 });

    return trainers.map(trainer => this.toDomain(trainer));
  }

  async findByRateRange(minRate: number, maxRate: number): Promise<Trainer[]> {
    const trainers = await this.trainerModel
      .find({
        hourlyRate: { $gte: minRate, $lte: maxRate },
        isActive: true,
      })
      .populate('gymId')
      .sort({ rating: -1 });

    return trainers.map(trainer => this.toDomain(trainer));
  }

  async delete(id: string): Promise<void> {
    await this.trainerModel.findByIdAndDelete(id);
  }

  private toDomain(trainerDoc: any): Trainer {
    return Trainer.restore(
      trainerDoc._id.toString(),
      trainerDoc.email,
      `${trainerDoc.firstName} ${trainerDoc.lastName}`,
      trainerDoc.phone,
      trainerDoc.gymId.toString(),
      trainerDoc.certifications.map((cert: any) => ({
        name: cert.name,
        institution: cert.issuer,
        dateObtained: cert.dateObtained,
        expirationDate: cert.expiryDate,
      })),
      trainerDoc.specializations,
      trainerDoc.experience,
      trainerDoc.bio,
      trainerDoc.profilePicture,
      trainerDoc.hourlyRate,
      {
        monday: trainerDoc.availability?.monday || [],
        tuesday: trainerDoc.availability?.tuesday || [],
        wednesday: trainerDoc.availability?.wednesday || [],
        thursday: trainerDoc.availability?.thursday || [],
        friday: trainerDoc.availability?.friday || [],
        saturday: trainerDoc.availability?.saturday || [],
        sunday: trainerDoc.availability?.sunday || [],
      },
      trainerDoc.isActive,
      trainerDoc.rating,
      trainerDoc.totalClients
    );
  }
}
