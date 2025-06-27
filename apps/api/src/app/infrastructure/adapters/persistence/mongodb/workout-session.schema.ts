import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
export class CompletedSetSchema {
  @Prop({ required: true, min: 0 })
  reps: number;

  @Prop({ min: 0 })
  weight?: number;

  @Prop({ min: 0 })
  duration?: number;

  @Prop({ required: true, min: 0 })
  restTime: number;

  @Prop({ required: true })
  completed: boolean;
}

@Schema({ _id: false })
export class SessionExerciseSchema {
  @Prop({ type: Types.ObjectId, ref: 'ExerciseSchema', required: true })
  exerciseId: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  plannedSets: number;

  @Prop({ type: [CompletedSetSchema], default: [] })
  completedSets: CompletedSetSchema[];

  @Prop()
  notes?: string;

  @Prop({ min: 1, max: 5 })
  rating?: number;
}

@Schema({ collection: 'workoutsessions', timestamps: true })
export class WorkoutSessionSchema extends Document {
  @Prop({ type: Types.ObjectId, ref: 'UserSchema', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'WorkoutPlanSchema', required: true })
  workoutPlanId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'GymSchema', required: true })
  gymId: Types.ObjectId;

  @Prop({ required: true })
  sessionDate: Date;

  @Prop()
  startTime?: Date;

  @Prop()
  endTime?: Date;

  @Prop({
    default: 'planned',
    enum: ['planned', 'in_progress', 'completed', 'skipped'],
  })
  status: string;

  @Prop({ type: [SessionExerciseSchema], default: [] })
  exercises: SessionExerciseSchema[];

  @Prop({ min: 1, max: 5 })
  overallRating?: number;

  @Prop()
  notes?: string;

  @Prop({ min: 0 })
  caloriesBurned?: number;
}

export const WorkoutSessionMongoSchema =
  SchemaFactory.createForClass(WorkoutSessionSchema);

WorkoutSessionMongoSchema.index({ userId: 1, sessionDate: -1 });
WorkoutSessionMongoSchema.index({ workoutPlanId: 1 });
WorkoutSessionMongoSchema.index({ gymId: 1, sessionDate: -1 });
WorkoutSessionMongoSchema.index({ status: 1 });
WorkoutSessionMongoSchema.index({ userId: 1, status: 1, sessionDate: -1 });
WorkoutSessionMongoSchema.index({ sessionDate: 1 });
