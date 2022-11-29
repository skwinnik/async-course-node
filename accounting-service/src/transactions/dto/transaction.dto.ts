import { Transaction } from '../entities/transaction.entity';

export class TransactionDto {
  constructor(transaction: Transaction) {
    this.id = transaction.id;
    this.transactionPeriodId = transaction.transactionPeriodId;
    this.taskId = transaction.taskId;
    this.userId = transaction.userId;
    this.description = transaction.description;
    this.createdAt = transaction.createdAt;
    this.credit = transaction.credit;
    this.debit = transaction.debit;
  }

  public id: number;

  public transactionPeriodId: number;

  public taskId?: number;

  public userId: number;

  public description: string;

  public createdAt: Date;

  public credit: number;

  public debit: number;
}
