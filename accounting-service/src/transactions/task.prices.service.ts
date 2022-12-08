import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SchemaRegistry } from '@skwinnik/schema-registry-client/dist/registry.class';
import { Sequelize } from 'sequelize-typescript';
import { Outbox } from 'src/db/models/outbox';
import { TaskPrice } from './entities/task.price.entity';
import { TaskPriceCreatedV1Event } from '@skwinnik/schema-registry-events';

@Injectable()
export class TaskPricesService {
  constructor(
    private sequelize: Sequelize,
    private schemaRegistry: SchemaRegistry,
    @InjectModel(Outbox) private outboxModel: typeof Outbox,
    @InjectModel(TaskPrice) private taskPricesModel: typeof TaskPrice,
  ) {}

  async getOrCreate(taskId: number) {
    let taskPrice = await this.taskPricesModel.findOne({ where: { taskId } });
    if (taskPrice) return taskPrice;

    return this.sequelize.transaction(async (transaction) => {
      const { fee, reward } = await this.generatePrices(taskId);
      taskPrice = await this.taskPricesModel.create(
        { taskId, fee, reward },
        { transaction },
      );

      if (!taskPrice) throw new Error('Task price not created');

      const event = new TaskPriceCreatedV1Event(
        taskPrice.taskId,
        taskPrice.fee,
        taskPrice.reward,
      );
      const payload = await this.schemaRegistry.serialize(
        TaskPriceCreatedV1Event.EVENT_NAME,
        TaskPriceCreatedV1Event.VERSION,
        event,
      );

      await this.outboxModel.create(
        {
          eventName: TaskPriceCreatedV1Event.EVENT_NAME,
          eventVersion: TaskPriceCreatedV1Event.VERSION,
          payload,
        },
        {
          transaction,
        },
      );

      return taskPrice;
    });
  }

  async generatePrices(taskId: number) {
    //fee is randon from 10 to 20
    //reward is random from 20 to 40
    return {
      fee: +(Math.floor(Math.random() * 10) + 10).toFixed(2),
      reward: +(Math.floor(Math.random() * 20) + 20).toFixed(2),
    };
  }
}
