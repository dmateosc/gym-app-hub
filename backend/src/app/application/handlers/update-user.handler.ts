import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateUserCommand } from '../commands/update-user.command';
import { UserRepositoryPort } from '../ports/user.repository.port';
import { EventPublisherPort } from '../ports/event-publisher.port';
import { User } from '../../domain/entities/user.entity';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { MembershipType } from '../../domain/value-objects/membership-type.vo';
import { UserUpdatedEvent } from '../../domain/events/user-updated.event';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
    @Inject('EventPublisherPort')
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(command: UpdateUserCommand): Promise<User> {
    const user = await this.userRepository.findById(command.id);
    if (!user) {
      throw new UserNotFoundException(command.id);
    }

    // Capturar estado anterior para el evento
    const previousData = {
      name: user.name,
      phone: user.phone?.value,
      membershipType: user.membershipType.value,
    };

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

    const updatedUser = await this.userRepository.update(command.id, user);

    // Publicar evento de dominio
    const event = new UserUpdatedEvent(updatedUser, previousData);
    await this.eventPublisher.publish(event);

    return updatedUser;
  }
}