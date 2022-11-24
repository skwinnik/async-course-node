import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SchemaRegistry } from '@skwinnik/schema-registry-client/dist/registry.class';
import { Sequelize } from 'sequelize-typescript';
import { Outbox } from 'src/db/models/outbox';
import { TasksService } from 'src/tasks/tasks.service';
import { Transaction } from './entities/transaction.entity';
import { TransactionCreatedV1Event } from '@skwinnik/schema-registry-events';
import { TaskPricesService } from './task.prices.service';
import { TransactionPeriodsService } from './transaction.periods.service';

@Injectable()
export class TransactionsService {
  constructor(
    private sequelize: Sequelize,
    private schemaRegistry: SchemaRegistry,
    private tasksService: TasksService,
    private taskPricesService: TaskPricesService,
    private transactionPeriodsService: TransactionPeriodsService,
    @InjectModel(Outbox) private outboxModel: typeof Outbox,
    @InjectModel(Transaction) private transactionModel: typeof Transaction,
  ) {}

  async create(
    transactionPeriodId: number,
    debit: number,
    credit: number,
    userId: number,
    description: string,
    taskId?: number,
  ) {
    return this.sequelize.transaction(async (t) => {
      const transaction = await this.transactionModel.create<Transaction>(
        {
          transactionPeriodId: transactionPeriodId,
          userId: userId,
          taskId: taskId,
          description: description,
          createdAt: new Date(),
          credit: credit,
          debit: debit,
        },
        { transaction: t },
      );

      if (!transaction) throw new Error('Transaction not created');

      const event = new TransactionCreatedV1Event(
        transaction.id,
        transaction.transactionPeriodId,
        transaction.userId,
        transaction.description,
        transaction.createdAt,
        transaction.credit,
        transaction.debit,
        transaction.taskId,
      );

      const payload = await this.schemaRegistry.serialize(
        TransactionCreatedV1Event.EVENT_NAME,
        TransactionCreatedV1Event.VERSION,
        event,
      );

      await this.outboxModel.create(
        {
          eventName: TransactionCreatedV1Event.EVENT_NAME,
          eventVersion: TransactionCreatedV1Event.VERSION,
          payload,
        },
        { transaction: t },
      );
    });
  }

  async taskAssigned(taskId: number, userId: number) {
    const task = await this.tasksService.findOne(taskId);
    const taskPrice = await this.taskPricesService.getOrCreate(taskId);

    const transactionPeriod = await this.transactionPeriodsService.get();
    if (!task) throw new Error('Task not found');
    if (!taskPrice) throw new Error('Task price not found');
    if (!transactionPeriod) throw new Error('Transaction period not found');

    return this.create(
      transactionPeriod.id,
      0,
      taskPrice.fee,
      userId,
      `Assignment fee for task: ${task.name}`,
      taskId,
    );
  }

  async taskCompleted(taskId: number, userId: number) {
    const task = await this.tasksService.findOne(taskId);
    const taskPrice = await this.taskPricesService.getOrCreate(taskId);

    const transactionPeriod = await this.transactionPeriodsService.get();
    if (!task) throw new Error('Task not found');
    if (!taskPrice) throw new Error('Task price not found');
    if (!transactionPeriod) throw new Error('Transaction period not found');

    return this.create(
      transactionPeriod.id,
      taskPrice.reward,
      0,
      userId,
      `Completion reward for task: ${task.name}`,
      taskId,
    );
  }
}
