import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TrainerRepositoryInterface } from '../../../../domain/repositories/trainer.repository.interface';
import { Trainer } from '../../../../domain/entities/trainer.entity';
import { TrainerSchema } from './trainer.schema';

@Injectable()
export class MongoTrainerRepository implements TrainerRepositoryInterface {
  constructor(
    @InjectModel(TrainerSchema.name)
    private readonly trainerModel: Model<TrainerSchema>,
  ) {}

  async save(trainer: Trainer): Promise<Trainer> {
    const trainerData = {
      firstName: trainer.firstName,
      lastName: trainer.lastName,
      email: trainer.email,
      phone: trainer.phone,
      gymId: new Types.ObjectId(trainer.gymId),
      specializations: trainer.specializations,
      certifications: trainer.certifications.map(cert => ({
        name: cert.name,
        issuer: cert.issuer,
        dateObtained: cert.dateObtained,
        expiryDate: cert.expiryDate,
        isActive: cert.isActive,
      })),
      experience: trainer.experience,
      hourlyRate: trainer.hourlyRate,
      availability: {
        monday: trainer.availability.monday,
        tuesday: trainer.availability.tuesday,
        wednesday: trainer.availability.wednesday,
        thursday: trainer.availability.thursday,
        friday: trainer.availability.friday,
        saturday: trainer.availability.saturday,
        sunday: trainer.availability.sunday,
      },
      bio: trainer.bio,
      profilePicture: trainer.profilePicture,
      rating: trainer.rating,
      totalClients: trainer.totalClients,
      isActive: trainer.isActive,
    };

    if (trainer.id) {
      const updated = await this.trainerModel.findByIdAndUpdate(
        trainer.id,
        trainerData,
        { new: true },
      );
      return this.toDomain(updated!);
    } else {
      const created = await this.trainerModel.create(trainerData);
      return this.toDomain(created);
    }
  }

  async findById(id: string): Promise<Trainer | null> {
    const trainer = await this.trainerModel
      .findById(id)
      .populate('gymId');
    
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
    endTime: string,
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
        const dayAvailability = trainer.availability[day.toLowerCase() as keyof typeof trainer.availability];
        if (!dayAvailability || !dayAvailability.isAvailable) return false;
        
        return dayAvailability.startTime <= startTime && dayAvailability.endTime >= endTime;
      })
      .map(trainer => this.toDomain(trainer))
      .sort((a, b) => b.rating - a.rating);
  }

  async findTopRatedByGymId(gymId: string, limit: number = 10): Promise<Trainer[]> {
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

  async delete(id: string): Promise<void> {
    await this.trainerModel.findByIdAndDelete(id);
  }

  private toDomain(trainerDoc: any): Trainer {
    return Trainer.restore(
      trainerDoc._id.toString(),
      trainerDoc.firstName,
      trainerDoc.lastName,
      trainerDoc.email,
      trainerDoc.phone,
      trainerDoc.gymId.toString(),
      trainerDoc.specializations,
      trainerDoc.certifications.map((cert: any) => ({
        name: cert.name,
        issuer: cert.issuer,
        dateObtained: cert.dateObtained,
        expiryDate: cert.expiryDate,
        isActive: cert.isActive,
      })),
      trainerDoc.experience,
      trainerDoc.hourlyRate,
      {
        monday: trainerDoc.availability.monday,
        tuesday: trainerDoc.availability.tuesday,
        wednesday: trainerDoc.availability.wednesday,
        thursday: trainerDoc.availability.thursday,
        friday: trainerDoc.availability.friday,
        saturday: trainerDoc.availability.saturday,
        sunday: trainerDoc.availability.sunday,
      },
      trainerDoc.bio,
      trainerDoc.profilePicture,
      trainerDoc.rating,
      trainerDoc.totalClients,
      trainerDoc.isActive,
    );
  }
}
