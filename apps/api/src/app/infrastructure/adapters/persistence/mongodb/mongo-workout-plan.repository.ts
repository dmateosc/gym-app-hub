/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { WorkoutPlan } from '@entities/workout-plan.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WorkoutPlanRepository } from '@repositories/workout-plan.repository.interface';
import { Model, Types } from 'mongoose';
import { WorkoutPlanSchema } from './workout-plan.schema';

@Injectable()
export class MongoWorkoutPlanRepository implements WorkoutPlanRepository {
  constructor(
    @InjectModel(WorkoutPlanSchema.name)
    private readonly workoutPlanModel: Model<WorkoutPlanSchema>,
  ) {}

  async save(workoutPlan: WorkoutPlan): Promise<WorkoutPlan> {
    const workoutPlanData = {
      name: workoutPlan.name,
      description: workoutPlan.description,
      userId: new Types.ObjectId(workoutPlan.userId),
      trainerId: new Types.ObjectId(workoutPlan.trainerId),
      gymId: new Types.ObjectId(workoutPlan.gymId),
      goal: workoutPlan.goal,
      duration: workoutPlan.duration,
      difficulty: workoutPlan.difficulty,
      exercises: workoutPlan.exercises.map(exercise => ({
        exerciseId: new Types.ObjectId(exercise.exerciseId),
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        duration: exercise.duration,
        restTime: exercise.restTime,
        notes: exercise.notes,
        order: exercise.order,
      })),
      schedule: {
        daysPerWeek: workoutPlan.schedule.daysPerWeek,
        preferredDays: workoutPlan.schedule.preferredDays,
        estimatedDuration: workoutPlan.schedule.estimatedDuration,
      },
      startDate: workoutPlan.startDate,
      endDate: workoutPlan.endDate,
      isActive: workoutPlan.isActive,
    };

    if (workoutPlan.id) {
      const updated = await this.workoutPlanModel.findByIdAndUpdate(
        workoutPlan.id,
        workoutPlanData,
        { new: true },
      );
      return this.toDomain(updated!);
    } else {
      const created = await this.workoutPlanModel.create(workoutPlanData);
      return this.toDomain(created);
    }
  }

  async findById(id: string): Promise<WorkoutPlan | null> {
    const workoutPlan = await this.workoutPlanModel
      .findById(id)
      .populate('userId')
      .populate('trainerId')
      .populate('gymId')
      .populate('exercises.exerciseId');

    return workoutPlan ? this.toDomain(workoutPlan) : null;
  }

  async findAll(): Promise<WorkoutPlan[]> {
    const workoutPlans = await this.workoutPlanModel
      .find()
      .populate('userId')
      .populate('trainerId')
      .populate('gymId')
      .populate('exercises.exerciseId')
      .sort({ createdAt: -1 });

    return workoutPlans.map(workoutPlan => this.toDomain(workoutPlan));
  }

  async findByUserId(userId: string): Promise<WorkoutPlan[]> {
    const workoutPlans = await this.workoutPlanModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('trainerId')
      .populate('gymId')
      .populate('exercises.exerciseId')
      .sort({ createdAt: -1 });

    return workoutPlans.map(workoutPlan => this.toDomain(workoutPlan));
  }

  async findByTrainerId(trainerId: string): Promise<WorkoutPlan[]> {
    const workoutPlans = await this.workoutPlanModel
      .find({ trainerId: new Types.ObjectId(trainerId) })
      .populate('userId')
      .populate('gymId')
      .populate('exercises.exerciseId')
      .sort({ createdAt: -1 });

    return workoutPlans.map(workoutPlan => this.toDomain(workoutPlan));
  }

  async findByGymId(gymId: string): Promise<WorkoutPlan[]> {
    const workoutPlans = await this.workoutPlanModel
      .find({ gymId: new Types.ObjectId(gymId) })
      .populate('userId')
      .populate('trainerId')
      .populate('exercises.exerciseId')
      .sort({ createdAt: -1 });

    return workoutPlans.map(workoutPlan => this.toDomain(workoutPlan));
  }

  async findActiveByUserId(userId: string): Promise<WorkoutPlan[]> {
    const workoutPlans = await this.workoutPlanModel
      .find({
        userId: new Types.ObjectId(userId),
        isActive: true,
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() },
      })
      .populate('trainerId')
      .populate('gymId')
      .populate('exercises.exerciseId')
      .sort({ startDate: -1 });

    return workoutPlans.map(workoutPlan => this.toDomain(workoutPlan));
  }

  async findByGoal(goal: string): Promise<WorkoutPlan[]> {
    const workoutPlans = await this.workoutPlanModel
      .find({ goal })
      .populate('userId')
      .populate('trainerId')
      .populate('gymId')
      .populate('exercises.exerciseId')
      .sort({ createdAt: -1 });

    return workoutPlans.map(workoutPlan => this.toDomain(workoutPlan));
  }

  async findActivePlans(): Promise<WorkoutPlan[]> {
    const workoutPlans = await this.workoutPlanModel
      .find({
        isActive: true,
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() },
      })
      .populate('userId')
      .populate('trainerId')
      .populate('gymId')
      .populate('exercises.exerciseId')
      .sort({ startDate: -1 });

    return workoutPlans.map(workoutPlan => this.toDomain(workoutPlan));
  }

  async findExpiredPlans(): Promise<WorkoutPlan[]> {
    const workoutPlans = await this.workoutPlanModel
      .find({
        endDate: { $lt: new Date() },
      })
      .populate('userId')
      .populate('trainerId')
      .populate('gymId')
      .populate('exercises.exerciseId')
      .sort({ endDate: -1 });

    return workoutPlans.map(workoutPlan => this.toDomain(workoutPlan));
  }

  async findByUserAndActive(userId: string): Promise<WorkoutPlan[]> {
    return this.findActiveByUserId(userId);
  }

  async update(
    id: string,
    workoutPlan: Partial<WorkoutPlan>,
  ): Promise<WorkoutPlan> {
    const updated = await this.workoutPlanModel.findByIdAndUpdate(
      id,
      workoutPlan,
      { new: true },
    );
    return this.toDomain(updated!);
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<WorkoutPlan[]> {
    const workoutPlans = await this.workoutPlanModel
      .find({
        $or: [
          { startDate: { $gte: startDate, $lte: endDate } },
          { endDate: { $gte: startDate, $lte: endDate } },
          { startDate: { $lte: startDate }, endDate: { $gte: endDate } },
        ],
      })
      .populate('userId')
      .populate('trainerId')
      .populate('gymId')
      .populate('exercises.exerciseId')
      .sort({ startDate: 1 });

    return workoutPlans.map(workoutPlan => this.toDomain(workoutPlan));
  }

  async delete(id: string): Promise<void> {
    await this.workoutPlanModel.findByIdAndDelete(id);
  }

  private toDomain(workoutPlanDoc: any): WorkoutPlan {
    return WorkoutPlan.restore({
      id: workoutPlanDoc._id.toString(),
      name: workoutPlanDoc.name,
      description: workoutPlanDoc.description,
      userId: workoutPlanDoc.userId.toString(),
      trainerId: workoutPlanDoc.trainerId.toString(),
      gymId: workoutPlanDoc.gymId.toString(),
      goal: workoutPlanDoc.goal,
      duration: workoutPlanDoc.duration,
      difficulty: workoutPlanDoc.difficulty,
      exercises: workoutPlanDoc.exercises.map((exercise: any) => ({
        exerciseId: exercise.exerciseId.toString(),
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        duration: exercise.duration,
        restTime: exercise.restTime,
        notes: exercise.notes,
        order: exercise.order,
      })),
      schedule: {
        daysPerWeek: workoutPlanDoc.schedule.daysPerWeek,
        preferredDays: workoutPlanDoc.schedule.preferredDays,
        estimatedDuration: workoutPlanDoc.schedule.estimatedDuration,
      },
      startDate: workoutPlanDoc.startDate,
      endDate: workoutPlanDoc.endDate,
      isActive: workoutPlanDoc.isActive,
    });
  }
}
