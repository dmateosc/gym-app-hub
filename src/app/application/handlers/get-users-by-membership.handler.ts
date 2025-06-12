import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetUsersByMembershipQuery } from '../queries/get-users-by-membership.query';
import { UserRepositoryPort } from '../ports/user.repository.port';
import { User } from '../../domain/entities/user.entity';

@QueryHandler(GetUsersByMembershipQuery)
export class GetUsersByMembershipHandler implements IQueryHandler<GetUsersByMembershipQuery> {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(query: GetUsersByMembershipQuery): Promise<User[]> {
    return this.userRepository.findByMembershipType(query.membershipType);
  }
}