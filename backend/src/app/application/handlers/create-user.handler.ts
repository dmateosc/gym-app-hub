import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateUserCommand } from '../commands/create-user.command';
import { UserRepositoryPort } from '../ports/user.repository.port';
import { EventPublisherPort } from '../ports/event-publisher.port';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { MembershipType } from '../../domain/value-objects/membership-type.vo';
import { Phone } from '../../domain/value-objects/phone.vo';
import { UserDomainService } from '../../domain/services/user.domain.service';
import { UserCreatedEvent } from '../../domain/events/user-created.event';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
    @Inject('EventPublisherPort')
    private readonly eventPublisher: EventPublisherPort,
    private readonly userDomainService: UserDomainService,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const email = Email.create(command.email);
    
    // Validar email único
    await this.userDomainService.validateUniqueEmail(email);

    const membershipType = command.membershipType 
      ? MembershipType.create(command.membershipType)
      : MembershipType.basic();

    const phone = command.phone ? Phone.create(command.phone) : undefined;

    const user = User.create({
      name: command.name,
      email,
      phone,
      membershipType,
    });

    const savedUser = await this.userRepository.save(user);

    // Publicar evento de dominio
    const event = new UserCreatedEvent(savedUser);
    await this.eventPublisher.publish(event);

    return savedUser;
  }
}