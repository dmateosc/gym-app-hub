import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
export class WorkoutExerciseSchema {
  @Prop({ type: Types.ObjectId, ref: 'ExerciseSchema', required: true })
  exerciseId: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  sets: number;

  @Prop({ required: true, min: 1 })
  reps: number;

  @Prop({ min: 0 })
  weight?: number;

  @Prop({ min: 0 })
  duration?: number;

  @Prop({ required: true, min: 0 })
  restTime: number;

  @Prop()
  notes?: string;

  @Prop({ required: true, min: 1 })
  order: number;
}

@Schema({ _id: false })
export class WorkoutScheduleSchema {
  @Prop({ required: true, min: 1, max: 7 })
  daysPerWeek: number;

  @Prop({
    type: [String],
    enum: [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ],
    required: true,
  })
  preferredDays: string[];

  @Prop({ required: true, min: 15 })
  estimatedDuration: number;
}

@Schema({ collection: 'workoutplans', timestamps: true })
export class WorkoutPlanSchema extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'UserSchema', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'TrainerSchema', required: true })
  trainerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'GymSchema', required: true })
  gymId: Types.ObjectId;

  @Prop({ 
    required: true, 
    enum: ['weight_loss', 'muscle_gain', 'endurance', 'strength', 'general_fitness'],
  })
  goal: string;

  @Prop({ required: true, min: 1 })
  duration: number;

  @Prop({ 
    required: true, 
    enum: ['beginner', 'intermediate', 'advanced'],
  })
  difficulty: string;

  @Prop({ type: [WorkoutExerciseSchema], default: [] })
  exercises: WorkoutExerciseSchema[];

  @Prop({ type: WorkoutScheduleSchema, required: true })
  schedule: WorkoutScheduleSchema;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const WorkoutPlanMongoSchema = SchemaFactory.createForClass(WorkoutPlanSchema);

WorkoutPlanMongoSchema.index({ userId: 1 });
WorkoutPlanMongoSchema.index({ trainerId: 1 });
WorkoutPlanMongoSchema.index({ gymId: 1 });
WorkoutPlanMongoSchema.index({ goal: 1 });
WorkoutPlanMongoSchema.index({ difficulty: 1 });
WorkoutPlanMongoSchema.index({ startDate: 1, endDate: 1 });
WorkoutPlanMongoSchema.index({ isActive: 1 });
WorkoutPlanMongoSchema.index({ userId: 1, isActive: 1, startDate: -1 });
