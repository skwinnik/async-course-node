import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { SchemaRegistryModule } from '@skwinnik/schema-registry-client/dist/registry.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthController } from './health/health.controller';
import { AuthModule } from './auth/auth.module';
import { MeModule } from './me/me.module';
import { TaskModule } from './task/task.module';
import { TransactionModule } from './transaction/transaction.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    SchemaRegistryModule.forRoot('http://schema-registry'),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: `mongodb://${configService.getOrThrow(
          'MONGO_USER',
        )}:${configService.getOrThrow(
          'MONGO_PASSWORD',
        )}@${configService.getOrThrow('MONGO_HOST')}/${configService.getOrThrow(
          'MONGO_DB',
        )}?authSource=admin`,
      }),
    }),
    AuthModule,
    MeModule,
    TaskModule,
    TransactionModule,
    UserModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
