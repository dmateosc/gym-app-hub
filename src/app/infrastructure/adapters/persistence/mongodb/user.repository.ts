import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepositoryPort } from '../../../application/ports/user.repository.port';
import { User } from '../../../domain/entities/user.entity';
import { UserDocument, UserMongoModel } from './user.schema';
import { Email } from '../../../domain/value-objects/email.vo';
import { MembershipType } from '../../../domain/value-objects/membership-type.vo';
import { Phone } from '../../../domain/value-objects/phone.vo';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(
    @InjectModel(UserMongoModel.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async save(user: User): Promise<User> {
    const userDoc = new this.userModel({
      name: user.name,
      email: user.email.value,
      phone: user.phone?.value,
      membershipType: user.membershipType.value,
      joinDate: user.joinDate,
      isActive: user.isActive,
    });

    const savedUser = await userDoc.save();
    return this.toDomain(savedUser);
  }

  async findById(id: string): Promise<User | null> {
    try {
      const user = await this.userModel.findById(id);
      return user ? this.toDomain(user) : null;
    } catch (error) {
      return null;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    return user ? this.toDomain(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().sort({ joinDate: -1 });
    return users.map(user => this.toDomain(user));
  }

  async findActiveUsers(): Promise<User[]> {
    const users = await this.userModel.find({ isActive: true }).sort({ joinDate: -1 });
    return users.map(user => this.toDomain(user));
  }

  async findByMembershipType(membershipType: string): Promise<User[]> {
    const users = await this.userModel.find({ 
      membershipType: membershipType.toLowerCase(),
      isActive: true 
    }).sort({ joinDate: -1 });
    return users.map(user => this.toDomain(user));
  }

  async update(id: string, user: User): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      {
        name: user.name,
        phone: user.phone?.value,
        membershipType: user.membershipType.value,
        isActive: user.isActive,
      },
      { new: true },
    );

    if (!updatedUser) {
      throw new Error('User not found for update');
    }

    return this.toDomain(updatedUser);
  }

  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id);
  }

  async exists(id: string): Promise<boolean> {
    try {
      const user = await this.userModel.findById(id).select('_id');
      return !!user;
    } catch (error) {
      return false;
    }
  }

  private toDomain(userDoc: UserDocument): User {
    const phone = userDoc.phone ? Phone.create(userDoc.phone) : undefined;

    return User.restore(
      {
        name: userDoc.name,
        email: Email.create(userDoc.email),
        phone,
        membershipType: MembershipType.create(userDoc.membershipType),
        joinDate: userDoc.joinDate,
        isActive: userDoc.isActive,
      },
      userDoc._id.toString(),
    );
  }
}