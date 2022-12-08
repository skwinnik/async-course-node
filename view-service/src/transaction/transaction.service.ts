import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPageRequest } from 'src/common/page.request';
import { IPageResponse } from 'src/common/page.response';
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
    task_id,
  }: {
    id: number;
    transaction_period_id: number;
    user_id: number;
    description: string;
    created_at: string | Date;
    credit: number;
    debit: number;
    task_id?: number;
  }) {
    const transaction = await this.transactionModel.create({
      id,
      transaction_period_id,
      user_id,
      description,
      created_at,
      credit,
      debit,
      task_id,
    });
    await transaction.save();
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionModel.find().exec();
  }

  async find(
    request: { userId: number } & IPageRequest,
  ): Promise<IPageResponse<Transaction>> {
    const total = await this.transactionModel
      .find({ user_id: request.userId })
      .countDocuments();
    const data = await this.transactionModel
      .find({ user_id: request.userId })
      .sort({
        [request.sort.by]: request.sort.order,
      })
      .skip(request.offset)
      .limit(request.limit)
      .exec();

    return {
      total,
      data,
    };
  }
}
