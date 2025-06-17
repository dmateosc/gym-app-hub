import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GymController } from '../app/infrastructure/adapters/controllers/gym.controller';
import { ExerciseController } from '../app/infrastructure/adapters/controllers/exercise.controller';
import { WorkoutPlanController } from '../app/infrastructure/adapters/controllers/workout-plan.controller';
import { WorkoutSessionController } from '../app/infrastructure/adapters/controllers/workout-session.controller';
import { TrainerController } from '../app/infrastructure/adapters/controllers/trainer.controller';
import { GymService } from '../app/domain/services/gym.service';
import { ExerciseService } from '../app/domain/services/exercise.service';
import { WorkoutPlanService } from '../app/domain/services/workout-plan.service';
import { WorkoutSessionService } from '../app/domain/services/workout-session.service';
import { TrainerService } from '../app/domain/services/trainer.service';
import {
  GymSchema,
  GymMongoSchema,
} from '../app/infrastructure/adapters/persistence/mongodb/gym.schema';
import {
  ExerciseSchema,
  ExerciseMongoSchema,
} from '../app/infrastructure/adapters/persistence/mongodb/exercise.schema';
import {
  WorkoutPlanSchema,
  WorkoutPlanMongoSchema,
} from '../app/infrastructure/adapters/persistence/mongodb/workout-plan.schema';
import {
  WorkoutSessionSchema,
  WorkoutSessionMongoSchema,
} from '../app/infrastructure/adapters/persistence/mongodb/workout-session.schema';
import {
  TrainerSchema,
  TrainerMongoSchema,
} from '../app/infrastructure/adapters/persistence/mongodb/trainer.schema';
import { MongoGymRepository } from '../app/infrastructure/adapters/persistence/mongodb/mongo-gym.repository';
import { MongoExerciseRepository } from '../app/infrastructure/adapters/persistence/mongodb/mongo-exercise.repository';
import { MongoWorkoutPlanRepository } from '../app/infrastructure/adapters/persistence/mongodb/mongo-workout-plan.repository';
import { MongoWorkoutSessionRepository } from '../app/infrastructure/adapters/persistence/mongodb/mongo-workout-session.repository';
import { MongoTrainerRepository } from '../app/infrastructure/adapters/persistence/mongodb/mongo-trainer.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: GymSchema.name,
        schema: GymMongoSchema,
      },
      {
        name: ExerciseSchema.name,
        schema: ExerciseMongoSchema,
      },
      {
        name: WorkoutPlanSchema.name,
        schema: WorkoutPlanMongoSchema,
      },
      {
        name: WorkoutSessionSchema.name,
        schema: WorkoutSessionMongoSchema,
      },
      {
        name: TrainerSchema.name,
        schema: TrainerMongoSchema,
      },
    ]),
  ],
  controllers: [
    GymController,
    ExerciseController,
    WorkoutPlanController,
    WorkoutSessionController,
    TrainerController,
  ],
  providers: [
    GymService,
    ExerciseService,
    WorkoutPlanService,
    WorkoutSessionService,
    TrainerService,
    {
      provide: 'GymRepositoryInterface',
      useClass: MongoGymRepository,
    },
    {
      provide: 'ExerciseRepositoryInterface',
      useClass: MongoExerciseRepository,
    },
    {
      provide: 'WorkoutPlanRepositoryInterface',
      useClass: MongoWorkoutPlanRepository,
    },
    {
      provide: 'WorkoutSessionRepositoryInterface',
      useClass: MongoWorkoutSessionRepository,
    },
    {
      provide: 'TrainerRepositoryInterface',
      useClass: MongoTrainerRepository,
    },
  ],
  exports: [
    GymService,
    ExerciseService,
    WorkoutPlanService,
    WorkoutSessionService,
    TrainerService,
  ],
})
export class GymModule {}
