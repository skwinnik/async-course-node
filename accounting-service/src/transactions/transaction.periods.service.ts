import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SchemaRegistry } from '@skwinnik/schema-registry-client/dist/registry.class';
import { Sequelize } from 'sequelize-typescript';
import { Outbox } from 'src/db/models/outbox';
import { TransactionPeriod } from './entities/transaction.period.entity';
import {
  TransactionPeriodCreatedV1Event,
  TransactionPeriodUpdatedV1Event,
} from '@skwinnik/schema-registry-events';

@Injectable()
export class TransactionPeriodsService {
  constructor(
    private sequelize: Sequelize,
    private schemaRegistry: SchemaRegistry,
    @InjectModel(TransactionPeriod)
    TransactionPeriodModel: typeof TransactionPeriod,
    @InjectModel(Outbox) private outboxModel: typeof Outbox,
  ) {}

  async get() {
    let transactionPeriod = await TransactionPeriod.findOne({
      where: { isOpen: true },
    });
    return transactionPeriod;
  }

  async create() {
    return this.sequelize.transaction(async (transaction) => {
      const transactionPeriod = await TransactionPeriod.create(
        { startedAt: new Date() },
        { transaction },
      );

      if (!transactionPeriod) throw new Error('Transaction period not created');

      const event = new TransactionPeriodCreatedV1Event(
        transactionPeriod.id,
        transactionPeriod.startedAt,
        transactionPeriod.isOpen,
      );
      const payload = await this.schemaRegistry.serialize(
        TransactionPeriodCreatedV1Event.EVENT_NAME,
        TransactionPeriodCreatedV1Event.VERSION,
        event,
      );

      await this.outboxModel.create(
        {
          eventName: TransactionPeriodCreatedV1Event.EVENT_NAME,
          eventVersion: TransactionPeriodCreatedV1Event.VERSION,
          payload,
        },
        {
          transaction,
        },
      );
    });
  }

  async close(transactionPeriodId: number) {
    return this.sequelize.transaction(async (transaction) => {
      const transactionPeriod = await TransactionPeriod.findOne({
        where: { id: transactionPeriodId },
      });

      if (!transactionPeriod) throw new Error('Transaction period not found');
      if (!transactionPeriod.isOpen)
        throw new Error('Transaction period already closed');

      transactionPeriod.isOpen = false;
      const savedTransactionPeriod = await transactionPeriod.save({
        transaction,
      });

      if (!savedTransactionPeriod)
        throw new Error('Transaction period not closed');

      const event = new TransactionPeriodUpdatedV1Event(
        transactionPeriod.id,
        transactionPeriod.startedAt,
        transactionPeriod.isOpen,
      );

      const payload = await this.schemaRegistry.serialize(
        TransactionPeriodUpdatedV1Event.EVENT_NAME,
        TransactionPeriodUpdatedV1Event.VERSION,
        event,
      );

      await this.outboxModel.create(
        {
          eventName: TransactionPeriodUpdatedV1Event.EVENT_NAME,
          eventVersion: TransactionPeriodUpdatedV1Event.VERSION,
          payload,
        },
        {
          transaction,
        },
      );
    });
  }
}
