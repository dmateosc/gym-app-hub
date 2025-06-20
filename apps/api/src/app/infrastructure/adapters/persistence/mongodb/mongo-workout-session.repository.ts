import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WorkoutSession } from '../../../../domain/entities/workout-session.entity';
import { WorkoutSessionSchema } from './workout-session.schema';

@Injectable()
export class MongoWorkoutSessionRepository {
  constructor(
    @InjectModel(WorkoutSessionSchema.name)
    private readonly workoutSessionModel: Model<WorkoutSessionSchema>
  ) {}

  async save(workoutSession: WorkoutSession): Promise<WorkoutSession> {
    const sessionData = {
      workoutPlanId: new Types.ObjectId(workoutSession.workoutPlanId),
      userId: new Types.ObjectId(workoutSession.userId),
      startTime: workoutSession.startTime,
      endTime: workoutSession.endTime,
      exercises: workoutSession.exercises.map(exercise => ({
        exerciseId: new Types.ObjectId(exercise.exerciseId),
        setsCompleted: exercise.setsCompleted,
        repsCompleted: exercise.repsCompleted,
        weightUsed: exercise.weightUsed,
        durationCompleted: exercise.durationCompleted,
        restTimeTaken: exercise.restTimeTaken,
        notes: exercise.notes,
        completed: exercise.completed,
      })),
      totalCaloriesBurned: workoutSession.totalCaloriesBurned,
      averageHeartRate: workoutSession.averageHeartRate,
      maxHeartRate: workoutSession.maxHeartRate,
      notes: workoutSession.notes,
      rating: workoutSession.rating,
      status: workoutSession.status,
    };

    if (workoutSession.id) {
      const updated = await this.workoutSessionModel.findByIdAndUpdate(
        workoutSession.id,
        sessionData,
        { new: true }
      );
      return this.toDomain(updated!);
    } else {
      const created = await this.workoutSessionModel.create(sessionData);
      return this.toDomain(created);
    }
  }

  async findById(id: string): Promise<WorkoutSession | null> {
    const session = await this.workoutSessionModel
      .findById(id)
      .populate('workoutPlanId')
      .populate('userId')
      .populate('exercises.exerciseId');

    return session ? this.toDomain(session) : null;
  }

  async findAll(): Promise<WorkoutSession[]> {
    const sessions = await this.workoutSessionModel
      .find()
      .populate('workoutPlanId')
      .populate('userId')
      .populate('exercises.exerciseId')
      .sort({ date: -1, startTime: -1 });

    return sessions.map(session => this.toDomain(session));
  }

  async findByUserId(userId: string): Promise<WorkoutSession[]> {
    const sessions = await this.workoutSessionModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('workoutPlanId')
      .populate('exercises.exerciseId')
      .sort({ date: -1, startTime: -1 });

    return sessions.map(session => this.toDomain(session));
  }

  async findByWorkoutPlanId(workoutPlanId: string): Promise<WorkoutSession[]> {
    const sessions = await this.workoutSessionModel
      .find({ workoutPlanId: new Types.ObjectId(workoutPlanId) })
      .populate('userId')
      .populate('exercises.exerciseId')
      .sort({ date: -1, startTime: -1 });

    return sessions.map(session => this.toDomain(session));
  }

  async findByUserIdAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<WorkoutSession[]> {
    const sessions = await this.workoutSessionModel
      .find({
        userId: new Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate },
      })
      .populate('workoutPlanId')
      .populate('exercises.exerciseId')
      .sort({ date: -1, startTime: -1 });

    return sessions.map(session => this.toDomain(session));
  }

  async findCompletedByUserId(userId: string): Promise<WorkoutSession[]> {
    const sessions = await this.workoutSessionModel
      .find({
        userId: new Types.ObjectId(userId),
        status: 'completed',
      })
      .populate('workoutPlanId')
      .populate('exercises.exerciseId')
      .sort({ date: -1, startTime: -1 });

    return sessions.map(session => this.toDomain(session));
  }

  async findInProgressByUserId(userId: string): Promise<WorkoutSession[]> {
    const sessions = await this.workoutSessionModel
      .find({
        userId: new Types.ObjectId(userId),
        status: 'in_progress',
      })
      .populate('workoutPlanId')
      .populate('exercises.exerciseId')
      .sort({ date: -1, startTime: -1 });

    return sessions.map(session => this.toDomain(session));
  }

  async delete(id: string): Promise<void> {
    await this.workoutSessionModel.findByIdAndDelete(id);
  }

  private toDomain(sessionDoc: any): WorkoutSession {
    return WorkoutSession.restore(
      sessionDoc._id.toString(),
      sessionDoc.workoutPlanId.toString(),
      sessionDoc.userId.toString(),
      sessionDoc.date,
      sessionDoc.startTime,
      sessionDoc.endTime,
      sessionDoc.duration,
      sessionDoc.exercises.map((exercise: any) => ({
        exerciseId: exercise.exerciseId.toString(),
        setsCompleted: exercise.setsCompleted,
        repsCompleted: exercise.repsCompleted,
        weightUsed: exercise.weightUsed,
        durationCompleted: exercise.durationCompleted,
        restTimeTaken: exercise.restTimeTaken,
        notes: exercise.notes,
        completed: exercise.completed,
      })),
      sessionDoc.totalCaloriesBurned,
      sessionDoc.averageHeartRate,
      sessionDoc.maxHeartRate,
      sessionDoc.notes,
      sessionDoc.rating,
      sessionDoc.status
    );
  }
}
