import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from './entities/transaction.entity';
import { TransactionCreatedV1Event } from '@skwinnik/schema-registry-events';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction) private transactionModel: typeof Transaction,
  ) {}

  async create(dto: TransactionCreatedV1Event) {
    await this.transactionModel.create({
      id: dto.id,
      transactionPeriodId: dto.transactionPeriodId,
      taskId: dto.taskId,
      userId: dto.userId,
      description: dto.description,
      createdAt: new Date(dto.createdAt),
      credit: dto.credit,
      debit: dto.debit,
    });
  }
}
