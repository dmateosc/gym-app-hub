import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
export class CertificationSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  institution: string;

  @Prop({ required: true })
  dateObtained: Date;

  @Prop()
  expirationDate?: Date;

  @Prop()
  certificateUrl?: string;
}

@Schema({ _id: false })
export class AvailabilitySlotSchema {
  @Prop({ required: true })
  start: string;

  @Prop({ required: true })
  end: string;
}

@Schema({ _id: false })
export class AvailabilitySchema {
  @Prop({ type: [AvailabilitySlotSchema], default: [] })
  monday: AvailabilitySlotSchema[];

  @Prop({ type: [AvailabilitySlotSchema], default: [] })
  tuesday: AvailabilitySlotSchema[];

  @Prop({ type: [AvailabilitySlotSchema], default: [] })
  wednesday: AvailabilitySlotSchema[];

  @Prop({ type: [AvailabilitySlotSchema], default: [] })
  thursday: AvailabilitySlotSchema[];

  @Prop({ type: [AvailabilitySlotSchema], default: [] })
  friday: AvailabilitySlotSchema[];

  @Prop({ type: [AvailabilitySlotSchema], default: [] })
  saturday: AvailabilitySlotSchema[];

  @Prop({ type: [AvailabilitySlotSchema], default: [] })
  sunday: AvailabilitySlotSchema[];
}

@Schema({ collection: 'trainers', timestamps: true })
export class TrainerSchema extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ type: Types.ObjectId, ref: 'GymSchema', required: true })
  gymId: Types.ObjectId;

  @Prop({ type: [CertificationSchema], default: [] })
  certifications: CertificationSchema[];

  @Prop({ 
    type: [String], 
    enum: ['weight_training', 'cardio', 'nutrition', 'yoga', 'pilates', 'crossfit', 'boxing'],
    default: [],
  })
  specialties: string[];

  @Prop({ required: true, min: 0 })
  experience: number;

  @Prop({ required: true })
  bio: string;

  @Prop()
  profileImage?: string;

  @Prop({ min: 0 })
  hourlyRate?: number;

  @Prop({ type: AvailabilitySchema })
  availability?: AvailabilitySchema;

  @Prop({ default: true })
  isActive: boolean;
}

export const TrainerMongoSchema = SchemaFactory.createForClass(TrainerSchema);

TrainerMongoSchema.index({ email: 1 }, { unique: true });
TrainerMongoSchema.index({ gymId: 1 });
TrainerMongoSchema.index({ specialties: 1 });
TrainerMongoSchema.index({ experience: 1 });
TrainerMongoSchema.index({ hourlyRate: 1 });
TrainerMongoSchema.index({ isActive: 1 });
TrainerMongoSchema.index({ gymId: 1, specialties: 1 });
TrainerMongoSchema.index({ gymId: 1, isActive: 1 });
