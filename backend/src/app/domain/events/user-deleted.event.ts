import { DomainEvent } from '@shared/domain/domain.event';

export class UserDeletedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly deletedAt: Date = new Date(),
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'user.deleted';
  }
}