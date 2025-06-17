import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gym } from '@entities/gym.entity';
import { GymRepository } from '@repositories/gym.repository.interface';
import { GymSchema } from './gym.schema';

@Injectable()
export class MongoGymRepository implements GymRepository {
  constructor(
    @InjectModel(GymSchema.name)
    private readonly gymModel: Model<GymSchema>,
  ) {}

  async findAll(): Promise<Gym[]> {
    const gyms = await this.gymModel.find().exec();
    return gyms.map(this.toDomain);
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = await this.gymModel.findById(id).exec();
    return gym ? this.toDomain(gym) : null;
  }

  async findByCity(city: string): Promise<Gym[]> {
    const gyms = await this.gymModel.find({ 'address.city': city }).exec();
    return gyms.map(this.toDomain);
  }

  async findByState(state: string): Promise<Gym[]> {
    const gyms = await this.gymModel.find({ 'address.state': state }).exec();
    return gyms.map(this.toDomain);
  }

  async findActiveGyms(): Promise<Gym[]> {
    const gyms = await this.gymModel.find({ isActive: true }).exec();
    return gyms.map(this.toDomain);
  }

  async save(gym: Gym): Promise<Gym> {
    const gymDoc = new this.gymModel({
      _id: gym.id,
      name: gym.name,
      address: gym.address,
      phone: gym.phone,
      email: gym.email,
      operatingHours: gym.operatingHours,
      facilities: gym.facilities,
      maxCapacity: gym.maxCapacity,
      isActive: gym.isActive,
    });
    
    const savedGym = await gymDoc.save();
    return this.toDomain(savedGym);
  }

  async update(id: string, gymData: Partial<Gym>): Promise<Gym> {
    const updatedGym = await this.gymModel
      .findByIdAndUpdate(id, gymData, { new: true })
      .exec();
    
    if (!updatedGym) {
      throw new Error(`Gym with id ${id} not found`);
    }
    
    return this.toDomain(updatedGym);
  }

  async delete(id: string): Promise<void> {
    await this.gymModel.findByIdAndDelete(id).exec();
  }

  async findByCapacityRange(minCapacity: number, maxCapacity: number): Promise<Gym[]> {
    const gyms = await this.gymModel
      .find({
        maxCapacity: { $gte: minCapacity, $lte: maxCapacity }
      })
      .exec();
    return gyms.map(this.toDomain);
  }

  async isWithinOperatingHours(gymId: string, day: string, time: string): Promise<boolean> {
    const gym = await this.findById(gymId);
    return gym ? gym.isOpenAt(day, time) : false;
  }

  private toDomain(gymSchema: GymSchema): Gym {
    return new Gym(
      gymSchema._id.toString(),
      gymSchema.name,
      gymSchema.address,
      gymSchema.phone,
      gymSchema.email,
      gymSchema.operatingHours,
      gymSchema.facilities,
      gymSchema.maxCapacity,
      gymSchema.isActive,
    );
  }
}
