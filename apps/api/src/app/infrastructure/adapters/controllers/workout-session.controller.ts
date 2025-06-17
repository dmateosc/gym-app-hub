import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { WorkoutSessionService } from '../../../domain/services/workout-session.service';
import { StartWorkoutSessionDto } from '../../dto/start-workout-session.dto';
import { CompleteWorkoutSessionDto } from '../../dto/complete-workout-session.dto';
import { UpdateExerciseProgressDto } from '../../dto/update-exercise-progress.dto';

@ApiTags('workout-sessions')
@Controller('workout-sessions')
export class WorkoutSessionController {
  constructor(private readonly workoutSessionService: WorkoutSessionService) {}

  @Get()
  @ApiOperation({ summary: 'Get all workout sessions' })
  @ApiResponse({ status: 200, description: 'List of all workout sessions' })
  async getAllWorkoutSessions() {
    return this.workoutSessionService.getAllWorkoutSessions();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get workout sessions by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of workout sessions for the user' })
  async getWorkoutSessionsByUserId(@Param('userId') userId: string) {
    return this.workoutSessionService.getWorkoutSessionsByUserId(userId);
  }

  @Get('user/:userId/completed')
  @ApiOperation({ summary: 'Get completed workout sessions by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of completed workout sessions for the user' })
  async getCompletedWorkoutSessionsByUserId(@Param('userId') userId: string) {
    return this.workoutSessionService.getCompletedWorkoutSessionsByUserId(userId);
  }

  @Get('user/:userId/active')
  @ApiOperation({ summary: 'Get active workout session by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Active workout session for the user' })
  async getActiveWorkoutSessionByUserId(@Param('userId') userId: string) {
    return this.workoutSessionService.getActiveWorkoutSessionByUserId(userId);
  }

  @Get('user/:userId/statistics')
  @ApiOperation({ summary: 'Get workout statistics by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Workout statistics for the user' })
  async getWorkoutStatistics(@Param('userId') userId: string) {
    return this.workoutSessionService.getWorkoutStatistics(userId);
  }

  @Get('user/:userId/date-range')
  @ApiOperation({ summary: 'Get workout sessions by user ID and date range' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({ name: 'startDate', description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', description: 'End date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'List of workout sessions in the date range' })
  async getWorkoutSessionsByUserIdAndDateRange(
    @Param('userId') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.workoutSessionService.getWorkoutSessionsByUserIdAndDateRange(
      userId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('workout-plan/:workoutPlanId')
  @ApiOperation({ summary: 'Get workout sessions by workout plan ID' })
  @ApiParam({ name: 'workoutPlanId', description: 'Workout plan ID' })
  @ApiResponse({ status: 200, description: 'List of workout sessions for the workout plan' })
  async getWorkoutSessionsByWorkoutPlanId(@Param('workoutPlanId') workoutPlanId: string) {
    return this.workoutSessionService.getWorkoutSessionsByWorkoutPlanId(workoutPlanId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workout session by ID' })
  @ApiParam({ name: 'id', description: 'Workout session ID' })
  @ApiResponse({ status: 200, description: 'Workout session details' })
  @ApiResponse({ status: 404, description: 'Workout session not found' })
  async getWorkoutSessionById(@Param('id') id: string) {
    return this.workoutSessionService.getWorkoutSessionById(id);
  }

  @Post('start')
  @ApiOperation({ summary: 'Start a new workout session' })
  @ApiResponse({ status: 201, description: 'Workout session started successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data or user already has active session' })
  async startWorkoutSession(@Body() startWorkoutSessionDto: StartWorkoutSessionDto) {
    return this.workoutSessionService.startWorkoutSession(
      startWorkoutSessionDto.workoutPlanId,
      startWorkoutSessionDto.userId,
      startWorkoutSessionDto.date,
      startWorkoutSessionDto.startTime,
    );
  }

  @Put(':id/complete')
  @ApiOperation({ summary: 'Complete workout session' })
  @ApiParam({ name: 'id', description: 'Workout session ID' })
  @ApiResponse({ status: 200, description: 'Workout session completed successfully' })
  @ApiResponse({ status: 404, description: 'Workout session not found' })
  async completeWorkoutSession(
    @Param('id') id: string,
    @Body() completeWorkoutSessionDto: CompleteWorkoutSessionDto,
  ) {
    return this.workoutSessionService.completeWorkoutSession(
      id,
      completeWorkoutSessionDto.endTime,
      completeWorkoutSessionDto.exercises,
      completeWorkoutSessionDto.totalCaloriesBurned,
      completeWorkoutSessionDto.averageHeartRate,
      completeWorkoutSessionDto.maxHeartRate,
      completeWorkoutSessionDto.notes,
      completeWorkoutSessionDto.rating,
    );
  }

  @Put(':id/pause')
  @ApiOperation({ summary: 'Pause workout session' })
  @ApiParam({ name: 'id', description: 'Workout session ID' })
  @ApiResponse({ status: 200, description: 'Workout session paused successfully' })
  @ApiResponse({ status: 404, description: 'Workout session not found' })
  async pauseWorkoutSession(@Param('id') id: string) {
    return this.workoutSessionService.pauseWorkoutSession(id);
  }

  @Put(':id/resume')
  @ApiOperation({ summary: 'Resume workout session' })
  @ApiParam({ name: 'id', description: 'Workout session ID' })
  @ApiResponse({ status: 200, description: 'Workout session resumed successfully' })
  @ApiResponse({ status: 404, description: 'Workout session not found' })
  async resumeWorkoutSession(@Param('id') id: string) {
    return this.workoutSessionService.resumeWorkoutSession(id);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel workout session' })
  @ApiParam({ name: 'id', description: 'Workout session ID' })
  @ApiResponse({ status: 200, description: 'Workout session cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Workout session not found' })
  async cancelWorkoutSession(@Param('id') id: string) {
    return this.workoutSessionService.cancelWorkoutSession(id);
  }

  @Put(':id/exercise-progress')
  @ApiOperation({ summary: 'Update exercise progress in workout session' })
  @ApiParam({ name: 'id', description: 'Workout session ID' })
  @ApiResponse({ status: 200, description: 'Exercise progress updated successfully' })
  @ApiResponse({ status: 404, description: 'Workout session not found' })
  async updateExerciseProgress(
    @Param('id') id: string,
    @Body() updateExerciseProgressDto: UpdateExerciseProgressDto,
  ) {
    return this.workoutSessionService.updateExerciseProgress(
      id,
      updateExerciseProgressDto.exerciseId,
      updateExerciseProgressDto.setsCompleted,
      updateExerciseProgressDto.repsCompleted,
      updateExerciseProgressDto.weightUsed,
      updateExerciseProgressDto.durationCompleted,
      updateExerciseProgressDto.restTimeTaken,
      updateExerciseProgressDto.notes,
      updateExerciseProgressDto.completed,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete workout session' })
  @ApiParam({ name: 'id', description: 'Workout session ID' })
  @ApiResponse({ status: 200, description: 'Workout session deleted successfully' })
  @ApiResponse({ status: 404, description: 'Workout session not found' })
  async deleteWorkoutSession(@Param('id') id: string) {
    await this.workoutSessionService.deleteWorkoutSession(id);
    return { message: 'Workout session deleted successfully' };
  }
}
