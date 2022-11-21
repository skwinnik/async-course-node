import {
  Inject,
  Injectable,
  Logger,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';
import { firstValueFrom } from 'rxjs';
import { Sequelize } from 'sequelize-typescript';
import { Outbox } from 'src/db/models/outbox';
import { KAFKA_CLIENT } from './publisher.kafka';

@Injectable()
export class PublisherService implements OnApplicationShutdown {
  private logger: Logger = new Logger(PublisherService.name);
  constructor(
    @Inject(KAFKA_CLIENT) private readonly client: ClientProxy,
    private readonly sequelize: Sequelize,
    @InjectModel(Outbox) private outbox: typeof Outbox,
  ) {}

  async poll() {
    try {
      while (!this.shutdownRequested) {
        const count = await this.outbox.count({
          where: { sentAt: null },
        });
        
        if (count <= 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }

        const transaction = await this.sequelize.transaction();
        const outbox = await this.outbox.findAll({
          where: { sentAt: null },
          order: [['createdAt', 'ASC']],
          limit: 1,
          transaction,
          lock: transaction.LOCK.UPDATE,
        });

        for (const message of outbox) {
          await this.publishMessage(message);
          await this.outbox.update(
            { sentAt: new Date() },
            { where: { id: message.id }, transaction },
          );
        }

        await transaction.commit();
      }
    } catch (e) {
      this.logger.error('PublisherService.listen() error: ' + e);
    }
  }

  async publishMessage(message: Outbox) {
    const topic = `v${message.eventVersion}.${message.eventName}`;
    console.log('Publishing message: ', message.payload, ' to topic: ', topic);

    const result = await firstValueFrom(
      this.client.emit(topic, message.payload),
    );
    console.log('Publishing result: ', result);
  }

  private shutdownRequested = false;
  onApplicationShutdown() {
    this.shutdownRequested = true;
  }
}
