import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from './schema/transaction.schema';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async create({
    id,
    transaction_period_id,
    user_id,
    description,
    created_at,
    credit,
    debit,
  }: {
    id: number;
    transaction_period_id: number;
    user_id: number;
    description: string;
    created_at: string | Date;
    credit: number;
    debit: number;
  }) {
    const transaction = await this.transactionModel.create({
      id,
      transaction_period_id,
      user_id,
      description,
      created_at,
      credit,
      debit,
    });
    await transaction.save();
  }
}
