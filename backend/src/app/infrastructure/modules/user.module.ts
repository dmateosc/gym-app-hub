import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserController } from '../adapters/controllers/user.controller';
import { UserRepository } from '../adapters/persistence/mongodb/user.repository';
import { UserMongoModel, UserSchema } from '../adapters/persistence/mongodb/user.schema';
import { CreateUserHandler } from '../../application/handlers/create-user.handler';
import { UpdateUserHandler } from '../../application/handlers/update-user.handler';
import { DeleteUserHandler } from '../../application/handlers/delete-user.handler';
import { GetUserHandler } from '../../application/handlers/get-user.handler';
import { GetAllUsersHandler } from '../../application/handlers/get-all-users.handler';
import { GetUsersByMembershipHandler } from '../../application/handlers/get-users-by-membership.handler';
import { UserDomainService } from '../../domain/services/user.domain.service';
import { RabbitMQEventPublisher } from '../adapters/messaging/rabbitmq-event-publisher';
import { UserEventListener } from '../adapters/messaging/user-event.listener';
import { EmailService } from '../adapters/messaging/email.service';

const CommandHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
];

const QueryHandlers = [
  GetUserHandler,
  GetAllUsersHandler,
  GetUsersByMembershipHandler,
];

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    MongooseModule.forFeature([
      { name: UserMongoModel.name, schema: UserSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    UserDomainService,
    {
      provide: 'UserRepositoryPort',
      useClass: UserRepository,
    },
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'EventPublisherPort',
      useClass: RabbitMQEventPublisher,
    },
    RabbitMQEventPublisher,
    UserEventListener,
    EmailService,
  ],
  exports: [UserDomainService],
})
export class UserModule {}