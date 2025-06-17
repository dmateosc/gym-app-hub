import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExerciseService } from '@services/exercise.service';
import { CreateExerciseDto } from '@infrastructure/dto/create-exercise.dto';
import { UpdateExerciseDto } from '@infrastructure/dto/update-exercise.dto';

@ApiTags('exercises')
@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get()
  @ApiOperation({ summary: 'Get all exercises' })
  @ApiResponse({ status: 200, description: 'List of all exercises' })
  async getAllExercises() {
    return this.exerciseService.getAllExercises();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active exercises' })
  @ApiResponse({ status: 200, description: 'List of all active exercises' })
  async getActiveExercises() {
    return this.exerciseService.getActiveExercises();
  }

  @Get('bodyweight')
  @ApiOperation({ summary: 'Get bodyweight exercises' })
  @ApiResponse({ status: 200, description: 'List of bodyweight exercises' })
  async getBodyweightExercises() {
    return this.exerciseService.getBodyweightExercises();
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get exercises by category' })
  @ApiResponse({ status: 200, description: 'List of exercises in the specified category' })
  async getExercisesByCategory(@Param('category') category: string) {
    return this.exerciseService.getExercisesByCategory(category);
  }

  @Get('muscle-group/:muscleGroup')
  @ApiOperation({ summary: 'Get exercises by muscle group' })
  @ApiResponse({ status: 200, description: 'List of exercises for the specified muscle group' })
  async getExercisesByMuscleGroup(@Param('muscleGroup') muscleGroup: string) {
    return this.exerciseService.getExercisesByMuscleGroup(muscleGroup);
  }

  @Get('difficulty/:difficulty')
  @ApiOperation({ summary: 'Get exercises by difficulty' })
  @ApiResponse({ status: 200, description: 'List of exercises for the specified difficulty' })
  async getExercisesByDifficulty(@Param('difficulty') difficulty: string) {
    return this.exerciseService.getExercisesByDifficulty(difficulty);
  }

  @Get('equipment/:equipment')
  @ApiOperation({ summary: 'Get exercises by equipment' })
  @ApiResponse({ status: 200, description: 'List of exercises using the specified equipment' })
  async getExercisesByEquipment(@Param('equipment') equipment: string) {
    return this.exerciseService.getExercisesByEquipment(equipment);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search exercises by name' })
  @ApiResponse({ status: 200, description: 'List of exercises matching the search term' })
  async searchExercises(@Query('name') name: string) {
    return this.exerciseService.searchExercisesByName(name);
  }

  @Get('creator/:creatorId')
  @ApiOperation({ summary: 'Get exercises by creator' })
  @ApiResponse({ status: 200, description: 'List of exercises created by the specified trainer' })
  async getExercisesByCreator(@Param('creatorId') creatorId: string) {
    return this.exerciseService.getExercisesByCreator(creatorId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get exercise by id' })
  @ApiResponse({ status: 200, description: 'Exercise details' })
  @ApiResponse({ status: 404, description: 'Exercise not found' })
  async getExerciseById(@Param('id') id: string) {
    return this.exerciseService.getExerciseById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new exercise' })
  @ApiResponse({ status: 201, description: 'Exercise created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createExercise(@Body() createExerciseDto: CreateExerciseDto) {
    return this.exerciseService.createExercise(createExerciseDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update exercise' })
  @ApiResponse({ status: 200, description: 'Exercise updated successfully' })
  @ApiResponse({ status: 404, description: 'Exercise not found' })
  async updateExercise(@Param('id') id: string, @Body() updateExerciseDto: UpdateExerciseDto) {
    return this.exerciseService.updateExercise(id, updateExerciseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete exercise' })
  @ApiResponse({ status: 200, description: 'Exercise deleted successfully' })
  @ApiResponse({ status: 404, description: 'Exercise not found' })
  async deleteExercise(@Param('id') id: string) {
    await this.exerciseService.deleteExercise(id);
    return { message: 'Exercise deleted successfully' };
  }
}
