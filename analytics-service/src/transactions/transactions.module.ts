import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TransactionPeriodsService } from './transaction.periods.service';
import { TasksModule } from 'src/tasks/tasks.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Transaction } from './entities/transaction.entity';
import { TransactionPeriod } from './entities/transaction.period.entity';

@Module({
  imports: [
    TasksModule,
    SequelizeModule.forFeature([Transaction, TransactionPeriod]),
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    TransactionsService,
    TransactionPeriodsService,
  ],
})
export class TransactionsModule {}
