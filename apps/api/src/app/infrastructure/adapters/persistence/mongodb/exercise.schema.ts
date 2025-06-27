import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'exercises', timestamps: true })
export class ExerciseSchema extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
    enum: ['cardio', 'strength', 'flexibility', 'sports'],
  })
  category: string;

  @Prop({
    type: [String],
    enum: ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'full_body'],
    default: [],
  })
  muscleGroups: string[];

  @Prop({
    type: [String],
    enum: [
      'barbell',
      'dumbbell',
      'machine',
      'bodyweight',
      'resistance_band',
      'kettlebell',
      'cable',
    ],
    default: [],
  })
  equipment: string[];

  @Prop({
    required: true,
    enum: ['beginner', 'intermediate', 'advanced'],
  })
  difficulty: string;

  @Prop({ type: [String], default: [] })
  instructions: string[];

  @Prop({ type: [String], default: [] })
  tips: string[];

  @Prop({ type: [String], default: [] })
  warnings: string[];

  @Prop()
  imageUrl?: string;

  @Prop()
  videoUrl?: string;

  @Prop({ min: 0 })
  estimatedCaloriesPerMinute?: number;

  @Prop({ type: Types.ObjectId, ref: 'TrainerSchema' })
  createdBy?: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;
}

export const ExerciseMongoSchema = SchemaFactory.createForClass(ExerciseSchema);

// Índices
ExerciseMongoSchema.index({ name: 1 });
ExerciseMongoSchema.index({ category: 1 });
ExerciseMongoSchema.index({ muscleGroups: 1 });
ExerciseMongoSchema.index({ difficulty: 1 });
ExerciseMongoSchema.index({ equipment: 1 });
ExerciseMongoSchema.index({ isActive: 1 });

// Índice de texto completo para búsquedas
ExerciseMongoSchema.index({
  name: 'text',
  description: 'text',
  instructions: 'text',
});
