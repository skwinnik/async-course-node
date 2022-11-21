import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SequelizeModule } from '@nestjs/sequelize';
import { Outbox } from 'src/db/models/outbox';
import { KAFKA_CLIENT } from './publisher.kafka';
import { PublisherService } from './publisher.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Outbox]),
    ClientsModule.registerAsync([
      {
        name: KAFKA_CLIENT,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'auth-service-publisher',
              brokers: [configService.getOrThrow('KAFKA_BROKER')],
            },
            producerOnlyMode: true,
          },
        }),
      },
    ]),
  ],
  providers: [PublisherService],
  exports: [PublisherService],
})
export class PublisherModule {}
