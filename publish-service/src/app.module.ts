import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { HealthController } from './health/health.controller';
import { PublisherModule } from './publisher/publisher.module';

@Module({
  imports: [
    PublisherModule,
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
          alter: false,
          logging: false,
        },
        synchronize: false,
        logging: false,
      }),
    }),
  ],
  controllers: [HealthController],
})
export class AppModule {}
