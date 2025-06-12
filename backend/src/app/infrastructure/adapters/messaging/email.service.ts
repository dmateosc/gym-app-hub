import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { getRabbitMQConfig, RabbitMQConfig } from '../../config/rabbitmq.config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;
  private readonly config: RabbitMQConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = getRabbitMQConfig(configService);
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.config.uri);
      this.channel = await this.connection.createChannel();

      await this.channel.prefetch(5); // Procesar máximo 5 emails a la vez

      await this.setupEmailNotificationListener();

      this.logger.log('Email service initialized');
    } catch (error) {
      this.logger.error('Failed to initialize email service', error);
      throw error;
    }
  }

  private async setupEmailNotificationListener(): Promise<void> {
    await this.channel!.consume(
      this.config.queues.emailNotifications,
      async (message) => {
        if (message) {
          try {
            const notification = JSON.parse(message.content.toString());
            await this.processEmailNotification(notification);
            this.channel!.ack(message);
          } catch (error) {
            this.logger.error('Error processing email notification', error);
            this.channel!.nack(message, false, true);
          }
        }
      },
      { noAck: false }
    );
  }

  private async processEmailNotification(notification: any): Promise<void> {
    this.logger.log(`Processing email notification: ${notification.type}`);

    switch (notification.type) {
      case 'welcome':
        await this.sendWelcomeEmail(notification.data);
        break;
      case 'membership_upgraded':
        await this.sendMembershipUpgradeEmail(notification.data);
        break;
      default:
        this.logger.warn(`Unknown notification type: ${notification.type}`);
    }
  }

  private async sendWelcomeEmail(data: any): Promise<void> {
    // Simular envío de email (aquí integrarías con SendGrid, AWS SES, etc.)
    this.logger.log(`📧 Sending welcome email to ${data.email}`);
    
    // Simular delay de envío
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.logger.log(`✅ Welcome email sent to ${data.name} (${data.email})`);
  }

  private async sendMembershipUpgradeEmail(data: any): Promise<void> {
    this.logger.log(`📧 Sending membership upgrade email to ${data.email}`);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.logger.log(`✅ Membership upgrade email sent to ${data.name} (${data.fromMembership} → ${data.toMembership})`);
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.channel?.close();
      await this.connection?.close();
      this.logger.log('Email service connection closed');
    } catch (error) {
      this.logger.error('Error closing email service connection', error);
    }
  }
}