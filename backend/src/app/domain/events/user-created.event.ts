import { DomainEvent } from '@shared/domain/domain.event';
import { User } from '../entities/user.entity';

export class UserCreatedEvent extends DomainEvent {
  constructor(
    public readonly user: User,
  ) {
    super(user.id!);
  }

  getEventName(): string {
    return 'user.created';
  }
}