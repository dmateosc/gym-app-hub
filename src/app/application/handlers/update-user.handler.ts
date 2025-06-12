import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateUserCommand } from '../commands/update-user.command';
import { UserRepositoryPort } from '../ports/user.repository.port';
import { User } from '../../domain/entities/user.entity';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { MembershipType } from '../../domain/value-objects/membership-type.vo';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(command: UpdateUserCommand): Promise<User> {
    const user = await this.userRepository.findById(command.id);
    if (!user) {
      throw new UserNotFoundException(command.id);
    }

    if (command.name) {
      user.updateName(command.name);
    }

    if (command.phone) {
      user.updatePhone(command.phone);
    }

    if (command.membershipType) {
      const membershipType = MembershipType.create(command.membershipType);
      user.upgradeMembership(membershipType);
    }

    return this.userRepository.update(command.id, user);
  }
}