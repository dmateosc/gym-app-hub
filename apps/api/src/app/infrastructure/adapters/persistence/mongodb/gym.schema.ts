import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'gyms', timestamps: true })
export class GymSchema extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    required: true,
  })
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop({
    type: {
      monday: {
        open: { type: String, required: true },
        close: { type: String, required: true },
        isClosed: { type: Boolean, default: false },
      },
      tuesday: {
        open: { type: String, required: true },
        close: { type: String, required: true },
        isClosed: { type: Boolean, default: false },
      },
      wednesday: {
        open: { type: String, required: true },
        close: { type: String, required: true },
        isClosed: { type: Boolean, default: false },
      },
      thursday: {
        open: { type: String, required: true },
        close: { type: String, required: true },
        isClosed: { type: Boolean, default: false },
      },
      friday: {
        open: { type: String, required: true },
        close: { type: String, required: true },
        isClosed: { type: Boolean, default: false },
      },
      saturday: {
        open: { type: String, required: true },
        close: { type: String, required: true },
        isClosed: { type: Boolean, default: false },
      },
      sunday: {
        open: { type: String, required: true },
        close: { type: String, required: true },
        isClosed: { type: Boolean, default: false },
      },
    },
    required: true,
  })
  operatingHours: {
    monday: { open: string; close: string; isClosed: boolean };
    tuesday: { open: string; close: string; isClosed: boolean };
    wednesday: { open: string; close: string; isClosed: boolean };
    thursday: { open: string; close: string; isClosed: boolean };
    friday: { open: string; close: string; isClosed: boolean };
    saturday: { open: string; close: string; isClosed: boolean };
    sunday: { open: string; close: string; isClosed: boolean };
  };

  @Prop({ type: [String], default: [] })
  facilities: string[];

  @Prop({ required: true, min: 1 })
  maxCapacity: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const GymMongoSchema = SchemaFactory.createForClass(GymSchema);

// Índices
GymMongoSchema.index({ name: 1 });
GymMongoSchema.index({ 'address.city': 1 });
GymMongoSchema.index({ 'address.state': 1 });
GymMongoSchema.index({ isActive: 1 });
