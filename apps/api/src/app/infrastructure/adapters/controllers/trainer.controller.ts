import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TrainerService } from '@services/trainer.service';
import { CreateTrainerDto } from '@infrastructure/dto/create-trainer.dto';
import { UpdateTrainerDto } from '@infrastructure/dto/update-trainer.dto';
import { AddCertificationDto } from '@infrastructure/dto/add-certification.dto';
import { UpdateAvailabilityDto } from '@infrastructure/dto/update-availability.dto';

@ApiTags('trainers')
@Controller('trainers')
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) {}

  @Get()
  @ApiOperation({ summary: 'Get all trainers' })
  @ApiResponse({ status: 200, description: 'List of all trainers' })
  async getAllTrainers() {
    return this.trainerService.getAllTrainers();
  }

  @Get('gym/:gymId')
  @ApiOperation({ summary: 'Get trainers by gym ID' })
  @ApiParam({ name: 'gymId', description: 'Gym ID' })
  @ApiResponse({ status: 200, description: 'List of trainers for the gym' })
  async getTrainersByGymId(@Param('gymId') gymId: string) {
    return this.trainerService.getTrainersByGymId(gymId);
  }

  @Get('gym/:gymId/active')
  @ApiOperation({ summary: 'Get active trainers by gym ID' })
  @ApiParam({ name: 'gymId', description: 'Gym ID' })
  @ApiResponse({ status: 200, description: 'List of active trainers for the gym' })
  async getActiveTrainersByGymId(@Param('gymId') gymId: string) {
    return this.trainerService.getActiveTrainersByGymId(gymId);
  }

  @Get('gym/:gymId/top-rated')
  @ApiOperation({ summary: 'Get top-rated trainers by gym ID' })
  @ApiParam({ name: 'gymId', description: 'Gym ID' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of trainers to return' })
  @ApiResponse({ status: 200, description: 'List of top-rated trainers for the gym' })
  async getTopRatedTrainersByGym(
    @Param('gymId') gymId: string,
    @Query('limit') limit?: string,
  ) {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.trainerService.getTopRatedTrainersByGym(gymId, limitNumber);
  }

  @Get('specialization/:specialization')
  @ApiOperation({ summary: 'Get trainers by specialization' })
  @ApiParam({ name: 'specialization', description: 'Trainer specialization' })
  @ApiResponse({ status: 200, description: 'List of trainers with the specialization' })
  async getTrainersBySpecialization(@Param('specialization') specialization: string) {
    return this.trainerService.getTrainersBySpecialization(specialization);
  }

  @Get('available')
  @ApiOperation({ summary: 'Get available trainers' })
  @ApiQuery({ name: 'gymId', description: 'Gym ID' })
  @ApiQuery({ name: 'day', description: 'Day of the week' })
  @ApiQuery({ name: 'startTime', description: 'Start time (HH:MM)' })
  @ApiQuery({ name: 'endTime', description: 'End time (HH:MM)' })
  @ApiResponse({ status: 200, description: 'List of available trainers' })
  async getAvailableTrainers(
    @Query('gymId') gymId: string,
    @Query('day') day: string,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
  ) {
    return this.trainerService.getAvailableTrainers(gymId, day, startTime, endTime);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get trainer by ID' })
  @ApiParam({ name: 'id', description: 'Trainer ID' })
  @ApiResponse({ status: 200, description: 'Trainer details' })
  @ApiResponse({ status: 404, description: 'Trainer not found' })
  async getTrainerById(@Param('id') id: string) {
    return this.trainerService.getTrainerById(id);
  }

  @Get(':id/availability')
  @ApiOperation({ summary: 'Check trainer availability' })
  @ApiParam({ name: 'id', description: 'Trainer ID' })
  @ApiQuery({ name: 'day', description: 'Day of the week' })
  @ApiQuery({ name: 'startTime', description: 'Start time (HH:MM)' })
  @ApiQuery({ name: 'endTime', description: 'End time (HH:MM)' })
  @ApiResponse({ status: 200, description: 'Availability check result' })
  async checkAvailability(
    @Param('id') id: string,
    @Query('day') day: string,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
  ) {
    const isAvailable = await this.trainerService.checkAvailability(id, day, startTime, endTime);
    return { isAvailable };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new trainer' })
  @ApiResponse({ status: 201, description: 'Trainer created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createTrainer(@Body() createTrainerDto: CreateTrainerDto) {
    return this.trainerService.createTrainer(
      createTrainerDto.firstName,
      createTrainerDto.lastName,
      createTrainerDto.email,
      createTrainerDto.phone,
      createTrainerDto.gymId,
      createTrainerDto.specializations,
      createTrainerDto.certifications,
      createTrainerDto.experience,
      createTrainerDto.hourlyRate,
      createTrainerDto.availability,
      createTrainerDto.bio,
      createTrainerDto.profilePicture,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update trainer' })
  @ApiParam({ name: 'id', description: 'Trainer ID' })
  @ApiResponse({ status: 200, description: 'Trainer updated successfully' })
  @ApiResponse({ status: 404, description: 'Trainer not found' })
  async updateTrainer(
    @Param('id') id: string,
    @Body() updateTrainerDto: UpdateTrainerDto,
  ) {
    return this.trainerService.updateTrainer(
      id,
      updateTrainerDto.firstName,
      updateTrainerDto.lastName,
      updateTrainerDto.phone,
      updateTrainerDto.specializations,
      updateTrainerDto.experience,
      updateTrainerDto.hourlyRate,
      updateTrainerDto.availability,
      updateTrainerDto.bio,
      updateTrainerDto.profilePicture,
    );
  }

  @Post(':id/certifications')
  @ApiOperation({ summary: 'Add certification to trainer' })
  @ApiParam({ name: 'id', description: 'Trainer ID' })
  @ApiResponse({ status: 200, description: 'Certification added successfully' })
  @ApiResponse({ status: 404, description: 'Trainer not found' })
  async addCertification(
    @Param('id') id: string,
    @Body() addCertificationDto: AddCertificationDto,
  ) {
    return this.trainerService.addCertification(
      id,
      addCertificationDto.name,
      addCertificationDto.issuer,
      addCertificationDto.dateObtained,
      addCertificationDto.expiryDate,
    );
  }

  @Delete(':id/certifications/:certificationName')
  @ApiOperation({ summary: 'Remove certification from trainer' })
  @ApiParam({ name: 'id', description: 'Trainer ID' })
  @ApiParam({ name: 'certificationName', description: 'Certification name' })
  @ApiResponse({ status: 200, description: 'Certification removed successfully' })
  @ApiResponse({ status: 404, description: 'Trainer or certification not found' })
  async removeCertification(
    @Param('id') id: string,
    @Param('certificationName') certificationName: string,
  ) {
    return this.trainerService.removeCertification(id, certificationName);
  }

  @Put(':id/rating')
  @ApiOperation({ summary: 'Update trainer rating' })
  @ApiParam({ name: 'id', description: 'Trainer ID' })
  @ApiResponse({ status: 200, description: 'Rating updated successfully' })
  @ApiResponse({ status: 404, description: 'Trainer not found' })
  async updateRating(
    @Param('id') id: string,
    @Body() body: { rating: number },
  ) {
    return this.trainerService.updateRating(id, body.rating);
  }

  @Put(':id/availability')
  @ApiOperation({ summary: 'Update trainer availability for a specific day' })
  @ApiParam({ name: 'id', description: 'Trainer ID' })
  @ApiResponse({ status: 200, description: 'Availability updated successfully' })
  @ApiResponse({ status: 404, description: 'Trainer not found' })
  async updateAvailability(
    @Param('id') id: string,
    @Body() updateAvailabilityDto: UpdateAvailabilityDto,
  ) {
    return this.trainerService.updateAvailability(
      id,
      updateAvailabilityDto.day,
      updateAvailabilityDto.isAvailable,
      updateAvailabilityDto.startTime,
      updateAvailabilityDto.endTime,
    );
  }

  @Put(':id/activate')
  @ApiOperation({ summary: 'Activate trainer' })
  @ApiParam({ name: 'id', description: 'Trainer ID' })
  @ApiResponse({ status: 200, description: 'Trainer activated successfully' })
  @ApiResponse({ status: 404, description: 'Trainer not found' })
  async activateTrainer(@Param('id') id: string) {
    return this.trainerService.activateTrainer(id);
  }

  @Put(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate trainer' })
  @ApiParam({ name: 'id', description: 'Trainer ID' })
  @ApiResponse({ status: 200, description: 'Trainer deactivated successfully' })
  @ApiResponse({ status: 404, description: 'Trainer not found' })
  async deactivateTrainer(@Param('id') id: string) {
    return this.trainerService.deactivateTrainer(id);
  }

  @Put(':id/client-count/increment')
  @ApiOperation({ summary: 'Increment trainer client count' })
  @ApiParam({ name: 'id', description: 'Trainer ID' })
  @ApiResponse({ status: 200, description: 'Client count incremented successfully' })
  @ApiResponse({ status: 404, description: 'Trainer not found' })
  async incrementClientCount(@Param('id') id: string) {
    return this.trainerService.incrementClientCount(id);
  }

  @Put(':id/client-count/decrement')
  @ApiOperation({ summary: 'Decrement trainer client count' })
  @ApiParam({ name: 'id', description: 'Trainer ID' })
  @ApiResponse({ status: 200, description: 'Client count decremented successfully' })
  @ApiResponse({ status: 404, description: 'Trainer not found' })
  async decrementClientCount(@Param('id') id: string) {
    return this.trainerService.decrementClientCount(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete trainer' })
  @ApiParam({ name: 'id', description: 'Trainer ID' })
  @ApiResponse({ status: 200, description: 'Trainer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Trainer not found' })
  async deleteTrainer(@Param('id') id: string) {
    await this.trainerService.deleteTrainer(id);
    return { message: 'Trainer deleted successfully' };
  }
}
