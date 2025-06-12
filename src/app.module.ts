import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './app/infrastructure/modules/user.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/gymdb',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    ),
    UserModule,
  ],
})
export class AppModule {}