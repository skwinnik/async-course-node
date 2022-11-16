import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { SchemaModule } from './schema/schema.module';

@Module({
  imports: [
    SchemaModule,
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
          logging: true,
        },
        synchronize: true,
      }),
    }),
  ],

  controllers: [HealthController],
  providers: [AppService],
})
export class AppModule {}
