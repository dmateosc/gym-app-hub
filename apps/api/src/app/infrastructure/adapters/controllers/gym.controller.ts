import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GymService } from '@services/gym.service';
import { CreateGymDto } from '@infrastructure/dto/create-gym.dto';
import { UpdateGymDto } from '@infrastructure/dto/update-gym.dto';

@ApiTags('gyms')
@Controller('gyms')
export class GymController {
  constructor(private readonly gymService: GymService) {}

  @Get()
  @ApiOperation({ summary: 'Get all gyms' })
  @ApiResponse({ status: 200, description: 'List of all gyms' })
  async getAllGyms() {
    return this.gymService.getAllGyms();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active gyms' })
  @ApiResponse({ status: 200, description: 'List of all active gyms' })
  async getActiveGyms() {
    return this.gymService.getActiveGyms();
  }

  @Get('city/:city')
  @ApiOperation({ summary: 'Get gyms by city' })
  @ApiResponse({
    status: 200,
    description: 'List of gyms in the specified city',
  })
  async getGymsByCity(@Param('city') city: string) {
    return this.gymService.getGymsByCity(city);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get gym by id' })
  @ApiResponse({ status: 200, description: 'Gym details' })
  @ApiResponse({ status: 404, description: 'Gym not found' })
  async getGymById(@Param('id') id: string) {
    return this.gymService.getGymById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new gym' })
  @ApiResponse({ status: 201, description: 'Gym created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createGym(@Body() createGymDto: CreateGymDto) {
    return this.gymService.createGym(createGymDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update gym' })
  @ApiResponse({ status: 200, description: 'Gym updated successfully' })
  @ApiResponse({ status: 404, description: 'Gym not found' })
  async updateGym(@Param('id') id: string, @Body() updateGymDto: UpdateGymDto) {
    return this.gymService.updateGym(id, updateGymDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete gym' })
  @ApiResponse({ status: 200, description: 'Gym deleted successfully' })
  @ApiResponse({ status: 404, description: 'Gym not found' })
  async deleteGym(@Param('id') id: string) {
    await this.gymService.deleteGym(id);
    return { message: 'Gym deleted successfully' };
  }

  @Get(':id/capacity-check')
  @ApiOperation({ summary: 'Check gym capacity' })
  @ApiResponse({ status: 200, description: 'Capacity check result' })
  async checkCapacity(
    @Param('id') id: string,
    @Query('currentUsers') currentUsers: number,
  ) {
    const withinCapacity = await this.gymService.checkCapacity(
      id,
      currentUsers,
    );
    return { withinCapacity };
  }

  @Get(':id/operating-hours')
  @ApiOperation({ summary: 'Check if gym is open' })
  @ApiResponse({ status: 200, description: 'Operating hours check result' })
  async checkOperatingHours(
    @Param('id') id: string,
    @Query('day') day: string,
    @Query('time') time: string,
  ) {
    const isOpen = await this.gymService.isGymOpen(id, day, time);
    return { isOpen };
  }
}
