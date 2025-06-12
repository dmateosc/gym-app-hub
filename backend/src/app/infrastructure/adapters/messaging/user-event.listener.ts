import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { getRabbitMQConfig, RabbitMQConfig } from '../../config/rabbitmq.config';
import { RabbitMQEventPublisher } from './rabbitmq-event-publisher';

@Injectable()
export class UserEventListener {
  private readonly logger = new Logger(UserEventListener.name);
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;
  private readonly config: RabbitMQConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly eventPublisher: RabbitMQEventPublisher,
  ) {
    this.config = getRabbitMQConfig(configService);
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.config.uri);
      this.channel = await this.connection.createChannel();

      // Configurar prefetch para controlar la carga
      await this.channel.prefetch(10);

      // Configurar listeners
      await this.setupUserCreatedListener();
      await this.setupUserUpdatedListener();
      await this.setupUserDeletedListener();

      this.logger.log('User event listeners initialized');
    } catch (error) {
      this.logger.error('Failed to initialize user event listeners', error);
      throw error;
    }
  }

  private async setupUserCreatedListener(): Promise<void> {
    await this.channel!.consume(
      this.config.queues.userCreated,
      async (message) => {
        if (message) {
          try {
            const event = JSON.parse(message.content.toString());
            await this.handleUserCreated(event);
            this.channel!.ack(message);
          } catch (error) {
            this.logger.error('Error processing user created event', error);
            this.channel!.nack(message, false, true); // Requeue
          }
        }
      },
      { noAck: false }
    );
  }

  private async setupUserUpdatedListener(): Promise<void> {
    await this.channel!.consume(
      this.config.queues.userUpdated,
      async (message) => {
        if (message) {
          try {
            const event = JSON.parse(message.content.toString());
            await this.handleUserUpdated(event);
            this.channel!.ack(message);
          } catch (error) {
            this.logger.error('Error processing user updated event', error);
            this.channel!.nack(message, false, true);
          }
        }
      },
      { noAck: false }
    );
  }

  private async setupUserDeletedListener(): Promise<void> {
    await this.channel!.consume(
      this.config.queues.userDeleted,
      async (message) => {
        if (message) {
          try {
            const event = JSON.parse(message.content.toString());
            await this.handleUserDeleted(event);
            this.channel!.ack(message);
          } catch (error) {
            this.logger.error('Error processing user deleted event', error);
            this.channel!.nack(message, false, true);
          }
        }
      },
      { noAck: false }
    );
  }

  private async handleUserCreated(event: any): Promise<void> {
    this.logger.log(`Processing user created event: ${event.aggregateId}`);
    
    // Enviar email de bienvenida
    await this.eventPublisher.publishNotification('welcome', {
      userId: event.aggregateId,
      email: event.data.user.email.value,
      name: event.data.user.name,
      membershipType: event.data.user.membershipType.value,
    });

    // Aquí podrías agregar más lógica como:
    // - Crear perfil en sistema de facturación
    // - Generar tarjeta de membresía
    // - Notificar al equipo de ventas
  }

  private async handleUserUpdated(event: any): Promise<void> {
    this.logger.log(`Processing user updated event: ${event.aggregateId}`);
    
    // Verificar si cambió la membresía
    const currentMembership = event.data.user.membershipType.value;
    const previousMembership = event.data.previousData.membershipType;

    if (currentMembership !== previousMembership) {
      await this.eventPublisher.publishNotification('membership_upgraded', {
        userId: event.aggregateId,
        email: event.data.user.email.value,
        name: event.data.user.name,
        fromMembership: previousMembership,
        toMembership: currentMembership,
      });
    }
  }

  private async handleUserDeleted(event: any): Promise<void> {
    this.logger.log(`Processing user deleted event: ${event.aggregateId}`);
    
    // Aquí podrías agregar lógica como:
    // - Cancelar servicios asociados
    // - Procesar reembolsos
    // - Limpiar datos relacionados
    // - Notificar al equipo correspondiente
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.channel?.close();
      await this.connection?.close();
      this.logger.log('User event listener connection closed');
    } catch (error) {
      this.logger.error('Error closing user event listener connection', error);
    }
  }
}