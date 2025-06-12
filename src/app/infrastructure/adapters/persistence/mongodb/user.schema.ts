import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = UserMongoModel & Document;

@Schema({ 
  collection: 'users',
  timestamps: true,
  versionKey: false
})
export class UserMongoModel {
  @Prop({ required: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: false })
  phone?: string;

  @Prop({ 
    enum: ['basic', 'premium', 'vip'], 
    default: 'basic',
    lowercase: true
  })
  membershipType: string;

  @Prop({ default: Date.now })
  joinDate: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(UserMongoModel);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ membershipType: 1 });
UserSchema.index({ isActive: 1 });