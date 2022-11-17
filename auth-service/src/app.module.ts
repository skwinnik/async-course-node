import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { SchemaRegistryModule } from '@skwinnik/schema-registry-client';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { HealthController } from './health/health.controller';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        autoLoadModels: true,
        sync: {
          force: false,
          alter: true,
          logging: true
        },
        synchronize: true,
      }),
    }),
    UsersModule,
    RolesModule,
    SchemaRegistryModule.forRoot('http://schema-registry')
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
