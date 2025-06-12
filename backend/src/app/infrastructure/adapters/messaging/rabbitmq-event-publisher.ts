import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { EventPublisherPort } from '../../application/ports/event-publisher.port';
import { DomainEvent } from '@shared/domain/domain.event';
import { getRabbitMQConfig } from '../../config/rabbitmq.config';

@Injectable()
export class RabbitMQEventPublisher implements EventPublisherPort {
  private readonly logger = new Logger(RabbitMQEventPublisher.name);
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;
  private readonly config;

  constructor(private readonly configService: ConfigService) {
    this.config = getRabbitMQConfig(configService);
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.config.uri);
      this.channel = await this.connection.createChannel();

      // Crear exchanges
      await this.channel.assertExchange(this.config.exchanges.userEvents, 'topic', {
        durable: true,
      });
      await this.channel.assertExchange(this.config.exchanges.notifications, 'topic', {
        durable: true,
      });

      // Crear colas
      await this.channel.assertQueue(this.config.queues.userCreated, { durable: true });
      await this.channel.assertQueue(this.config.queues.userUpdated, { durable: true });
      await this.channel.assertQueue(this.config.queues.userDeleted, { durable: true });
      await this.channel.assertQueue(this.config.queues.emailNotifications, { durable: true });

      // Bindings
      await this.channel.bindQueue(
        this.config.queues.userCreated,
        this.config.exchanges.userEvents,
        'user.created'
      );
      await this.channel.bindQueue(
        this.config.queues.userUpdated,
        this.config.exchanges.userEvents,
        'user.updated'
      );
      await this.channel.bindQueue(
        this.config.queues.userDeleted,
        this.config.exchanges.userEvents,
        'user.deleted'
      );

      // Binding para notificaciones
      await this.channel.bindQueue(
        this.config.queues.emailNotifications,
        this.config.exchanges.notifications,
        'email.*'
      );

      this.logger.log('RabbitMQ initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize RabbitMQ', error);
      throw error;
    }
  }

  async publish(event: DomainEvent): Promise<void> {
    if (!this.channel) {
      await this.initialize();
    }

    try {
      const message = JSON.stringify({
        eventId: event.eventId,
        eventName: event.getEventName(),
        aggregateId: event.aggregateId,
        occurredOn: event.occurredOn,
        data: event,
      });

      const published = this.channel!.publish(
        this.config.exchanges.userEvents,
        event.getEventName(),
        Buffer.from(message),
        {
          persistent: true,
          messageId: event.eventId,
          timestamp: event.occurredOn.getTime(),
        }
      );

      if (published) {
        this.logger.log(`Event published: ${event.getEventName()}`);
      } else {
        this.logger.warn(`Failed to publish event: ${event.getEventName()}`);
      }
    } catch (error) {
      this.logger.error(`Error publishing event: ${event.getEventName()}`, error);
      throw error;
    }
  }

  async publishAll(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  async publishNotification(type: string, data: any): Promise<void> {
    if (!this.channel) {
      await this.initialize();
    }

    try {
      const message = JSON.stringify({
        type,
        data,
        timestamp: new Date(),
      });

      this.channel!.publish(
        this.config.exchanges.notifications,
        `email.${type}`,
        Buffer.from(message),
        { persistent: true }
      );

      this.logger.log(`Notification published: email.${type}`);
    } catch (error) {
      this.logger.error(`Error publishing notification: email.${type}`, error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.channel?.close();
      await this.connection?.close();
      this.logger.log('RabbitMQ connection closed');
    } catch (error) {
      this.logger.error('Error closing RabbitMQ connection', error);
    }
  }
}