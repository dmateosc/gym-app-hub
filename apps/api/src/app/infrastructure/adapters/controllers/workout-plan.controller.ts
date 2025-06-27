import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WorkoutPlanService } from '../../../domain/services/workout-plan.service';
import { AddExerciseToWorkoutPlanDto } from '../../dto/add-exercise-to-workout-plan.dto';
import { CreateWorkoutPlanDto } from '../../dto/create-workout-plan.dto';
import { UpdateWorkoutPlanDto } from '../../dto/update-workout-plan.dto';

@ApiTags('workout-plans')
@Controller('workout-plans')
export class WorkoutPlanController {
  constructor(private readonly workoutPlanService: WorkoutPlanService) {}

  @Get()
  @ApiOperation({ summary: 'Get all workout plans' })
  @ApiResponse({ status: 200, description: 'List of all workout plans' })
  async getAllWorkoutPlans() {
    return this.workoutPlanService.getAllWorkoutPlans();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get workout plans by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'List of workout plans for the user',
  })
  async getWorkoutPlansByUserId(@Param('userId') userId: string) {
    return this.workoutPlanService.getWorkoutPlansByUserId(userId);
  }

  @Get('trainer/:trainerId')
  @ApiOperation({ summary: 'Get workout plans by trainer ID' })
  @ApiParam({ name: 'trainerId', description: 'Trainer ID' })
  @ApiResponse({
    status: 200,
    description: 'List of workout plans for the trainer',
  })
  async getWorkoutPlansByTrainerId(@Param('trainerId') trainerId: string) {
    return this.workoutPlanService.getWorkoutPlansByTrainerId(trainerId);
  }

  @Get('gym/:gymId')
  @ApiOperation({ summary: 'Get workout plans by gym ID' })
  @ApiParam({ name: 'gymId', description: 'Gym ID' })
  @ApiResponse({
    status: 200,
    description: 'List of workout plans for the gym',
  })
  async getWorkoutPlansByGymId(@Param('gymId') gymId: string) {
    return this.workoutPlanService.getWorkoutPlansByGymId(gymId);
  }

  @Get('user/:userId/active')
  @ApiOperation({ summary: 'Get active workout plans by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'List of active workout plans for the user',
  })
  async getActiveWorkoutPlansByUserId(@Param('userId') userId: string) {
    return this.workoutPlanService.getActiveWorkoutPlansByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workout plan by ID' })
  @ApiParam({ name: 'id', description: 'Workout plan ID' })
  @ApiResponse({ status: 200, description: 'Workout plan details' })
  @ApiResponse({ status: 404, description: 'Workout plan not found' })
  async getWorkoutPlanById(@Param('id') id: string) {
    return this.workoutPlanService.getWorkoutPlanById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new workout plan' })
  @ApiResponse({
    status: 201,
    description: 'Workout plan created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createWorkoutPlan(@Body() createWorkoutPlanDto: CreateWorkoutPlanDto) {
    return this.workoutPlanService.createWorkoutPlan({
      name: createWorkoutPlanDto.name,
      description: createWorkoutPlanDto.description,
      userId: createWorkoutPlanDto.userId,
      trainerId: createWorkoutPlanDto.trainerId,
      gymId: createWorkoutPlanDto.gymId,
      goal: createWorkoutPlanDto.goal,
      duration: createWorkoutPlanDto.duration,
      difficulty: createWorkoutPlanDto.difficulty,
      exercises: createWorkoutPlanDto.exercises,
      schedule: createWorkoutPlanDto.schedule,
      startDate: createWorkoutPlanDto.startDate,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update workout plan' })
  @ApiParam({ name: 'id', description: 'Workout plan ID' })
  @ApiResponse({
    status: 200,
    description: 'Workout plan updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Workout plan not found' })
  async updateWorkoutPlan(
    @Param('id') id: string,
    @Body() updateWorkoutPlanDto: UpdateWorkoutPlanDto,
  ) {
    return this.workoutPlanService.updateWorkoutPlan(id, {
      name: updateWorkoutPlanDto.name,
      description: updateWorkoutPlanDto.description,
      goal: updateWorkoutPlanDto.goal,
      difficulty: updateWorkoutPlanDto.difficulty,
      exercises: updateWorkoutPlanDto.exercises,
      schedule: updateWorkoutPlanDto.schedule,
      isActive: updateWorkoutPlanDto.isActive,
    });
  }

  @Post(':id/exercises')
  @ApiOperation({ summary: 'Add exercise to workout plan' })
  @ApiParam({ name: 'id', description: 'Workout plan ID' })
  @ApiResponse({ status: 200, description: 'Exercise added successfully' })
  @ApiResponse({ status: 404, description: 'Workout plan not found' })
  async addExerciseToWorkoutPlan(
    @Param('id') id: string,
    @Body() addExerciseDto: AddExerciseToWorkoutPlanDto,
  ) {
    return this.workoutPlanService.addExerciseToWorkoutPlan({
      id,
      exerciseId: addExerciseDto.exerciseId,
      sets: addExerciseDto.sets,
      reps: addExerciseDto.reps,
      weight: addExerciseDto.weight,
      duration: addExerciseDto.duration,
      restTime: addExerciseDto.restTime,
      notes: addExerciseDto.notes,
    });
  }

  @Delete(':id/exercises/:exerciseId')
  @ApiOperation({ summary: 'Remove exercise from workout plan' })
  @ApiParam({ name: 'id', description: 'Workout plan ID' })
  @ApiParam({ name: 'exerciseId', description: 'Exercise ID' })
  @ApiResponse({ status: 200, description: 'Exercise removed successfully' })
  @ApiResponse({
    status: 404,
    description: 'Workout plan or exercise not found',
  })
  async removeExerciseFromWorkoutPlan(
    @Param('id') id: string,
    @Param('exerciseId') exerciseId: string,
  ) {
    return this.workoutPlanService.removeExerciseFromWorkoutPlan(
      id,
      exerciseId,
    );
  }

  @Put(':id/activate')
  @ApiOperation({ summary: 'Activate workout plan' })
  @ApiParam({ name: 'id', description: 'Workout plan ID' })
  @ApiResponse({
    status: 200,
    description: 'Workout plan activated successfully',
  })
  @ApiResponse({ status: 404, description: 'Workout plan not found' })
  async activateWorkoutPlan(@Param('id') id: string) {
    return this.workoutPlanService.activateWorkoutPlan(id);
  }

  @Put(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate workout plan' })
  @ApiParam({ name: 'id', description: 'Workout plan ID' })
  @ApiResponse({
    status: 200,
    description: 'Workout plan deactivated successfully',
  })
  @ApiResponse({ status: 404, description: 'Workout plan not found' })
  async deactivateWorkoutPlan(@Param('id') id: string) {
    return this.workoutPlanService.deactivateWorkoutPlan(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete workout plan' })
  @ApiParam({ name: 'id', description: 'Workout plan ID' })
  @ApiResponse({
    status: 200,
    description: 'Workout plan deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Workout plan not found' })
  async deleteWorkoutPlan(@Param('id') id: string) {
    await this.workoutPlanService.deleteWorkoutPlan(id);
    return { message: 'Workout plan deleted successfully' };
  }
}
