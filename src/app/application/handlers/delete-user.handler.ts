import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteUserCommand } from '../commands/delete-user.command';
import { UserRepositoryPort } from '../ports/user.repository.port';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const userExists = await this.userRepository.exists(command.id);
    if (!userExists) {
      throw new UserNotFoundException(command.id);
    }

    await this.userRepository.delete(command.id);
  }
}