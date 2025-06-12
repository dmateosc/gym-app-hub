import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllUsersQuery } from '../queries/get-all-users.query';
import { UserRepositoryPort } from '../ports/user.repository.port';
import { User } from '../../domain/entities/user.entity';

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersHandler implements IQueryHandler<GetAllUsersQuery> {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(query: GetAllUsersQuery): Promise<User[]> {
    return this.userRepository.findAll();
  }
}