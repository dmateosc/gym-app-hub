import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteUserCommand } from '../commands/delete-user.command';
import { UserRepositoryPort } from '../ports/user.repository.port';
import { EventPublisherPort } from '../ports/event-publisher.port';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { UserDeletedEvent } from '../../domain/events/user-deleted.event';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
    @Inject('EventPublisherPort')
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const userExists = await this.userRepository.exists(command.id);
    if (!userExists) {
      throw new UserNotFoundException(command.id);
    }

    await this.userRepository.delete(command.id);

    // Publicar evento de dominio
    const event = new UserDeletedEvent(command.id);
    await this.eventPublisher.publish(event);
  }
}