import { DomainEvent } from '@shared/domain/domain.event';

export abstract class EventPublisherPort {
  abstract publish(event: DomainEvent): Promise<void>;
  abstract publishAll(events: DomainEvent[]): Promise<void>;
}