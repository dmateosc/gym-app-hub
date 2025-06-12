import { DomainEvent } from '@shared/domain/domain.event';
import { User } from '../entities/user.entity';

export class UserUpdatedEvent extends DomainEvent {
  constructor(
    public readonly user: User,
    public readonly previousData: Partial<User>,
  ) {
    super(user.id!);
  }

  getEventName(): string {
    return 'user.updated';
  }
}