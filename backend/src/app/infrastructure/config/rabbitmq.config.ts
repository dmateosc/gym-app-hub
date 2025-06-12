import { ConfigService } from '@nestjs/config';

export interface RabbitMQConfig {
  uri: string;
  exchanges: {
    userEvents: string;
    notifications: string;
  };
  queues: {
    userCreated: string;
    userUpdated: string;
    userDeleted: string;
    emailNotifications: string;
  };
}

export const getRabbitMQConfig = (configService: ConfigService): RabbitMQConfig => ({
  uri: configService.get<string>('RABBITMQ_URI', 'amqp://localhost:5672'),
  exchanges: {
    userEvents: 'user.events',
    notifications: 'notifications',
  },
  queues: {
    userCreated: 'user.created',
    userUpdated: 'user.updated',
    userDeleted: 'user.deleted',
    emailNotifications: 'email.notifications',
  },
});