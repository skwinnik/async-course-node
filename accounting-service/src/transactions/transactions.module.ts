import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TaskPricesService } from './task.prices.service';
import { TransactionPeriodsService } from './transaction.periods.service';
import { TasksModule } from 'src/tasks/tasks.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Transaction } from './entities/transaction.entity';
import { TransactionPeriod } from './entities/transaction.period.entity';
import { TaskPrice } from './entities/task.price.entity';
import { Outbox } from 'src/db/models/outbox';
import { TransactionPeriodsController } from './transaction.periods.controller';

@Module({
  imports: [
    TasksModule,
    SequelizeModule.forFeature([
      Transaction,
      TransactionPeriod,
      TaskPrice,
      Outbox,
    ]),
  ],
  controllers: [TransactionsController, TransactionPeriodsController],
  providers: [
    TransactionsService,
    TransactionsService,
    TaskPricesService,
    TransactionPeriodsService,
  ],
})
export class TransactionsModule {}
