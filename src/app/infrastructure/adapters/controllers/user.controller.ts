import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  Post, 
  Put, 
  HttpCode, 
  HttpStatus,
  Query
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateUserCommand } from '../../application/commands/create-user.command';
import { UpdateUserCommand } from '../../application/commands/update-user.command';
import { DeleteUserCommand } from '../../application/commands/delete-user.command';
import { GetUserQuery } from '../../application/queries/get-user.query';
import { GetAllUsersQuery } from '../../application/queries/get-all-users.query';
import { GetUsersByMembershipQuery } from '../../application/queries/get-users-by-membership.query';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { User } from '../../domain/entities/user.entity';

@ApiTags('Users')
@Controller('api/users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User created successfully',
    type: UserResponseDto
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const command = new CreateUserCommand(
      createUserDto.name,
      createUserDto.email,
      createUserDto.phone,
      createUserDto.membershipType,
    );
    
    const user = await this.commandBus.execute(command);
    return this.toResponseDto(user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ 
    name: 'membershipType', 
    required: false, 
    enum: ['basic', 'premium', 'vip'],
    description: 'Filter by membership type'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Users retrieved successfully',
    type: [UserResponseDto]
  })
  async findAll(@Query('membershipType') membershipType?: string): Promise<UserResponseDto[]> {
    let query;
    
    if (membershipType) {
      query = new GetUsersByMembershipQuery(membershipType);
    } else {
      query = new GetAllUsersQuery();
    }
    
    const users = await this.queryBus.execute(query);
    return users.map(user => this.toResponseDto(user));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'User retrieved successfully',
    type: UserResponseDto
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const query = new GetUserQuery(id);
    const user = await this.queryBus.execute(query);
    return this.toResponseDto(user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'User updated successfully',
    type: UserResponseDto
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async update(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    const command = new UpdateUserCommand(
      id,
      updateUserDto.name,
      updateUserDto.phone,
      updateUserDto.membershipType,
    );
    
    const user = await this.commandBus.execute(command);
    return this.toResponseDto(user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string): Promise<void> {
    const command = new DeleteUserCommand(id);
    await this.commandBus.execute(command);
  }

  private toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id!,
      name: user.name,
      email: user.email.value,
      phone: user.phone?.value,
      membershipType: user.membershipType.value,
      joinDate: user.joinDate,
      isActive: user.isActive,
    };
  }
}