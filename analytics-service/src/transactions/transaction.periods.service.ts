import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TransactionPeriod } from './entities/transaction.period.entity';
import { TransactionPeriodCreatedV1Event } from '@skwinnik/schema-registry-events';

@Injectable()
export class TransactionPeriodsService {
  constructor(
    @InjectModel(TransactionPeriod)
    private transactionPeriodModel: typeof TransactionPeriod,
  ) {}

  async create(dto: TransactionPeriodCreatedV1Event) {
    await this.transactionPeriodModel.create<TransactionPeriod>({
      id: dto.id,
      startedAt: new Date(dto.startedAt),
      isOpen: dto.isOpen,
    });
  }
}
