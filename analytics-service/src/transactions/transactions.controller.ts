import { Body, Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ValidationSchemaPipe } from 'src/pipes/validationSchema.pipe';
import {
  TransactionCreatedV1Event,
  TransactionPeriodCreatedV1Event,
} from '@skwinnik/schema-registry-events';
import { TransactionsService } from './transactions.service';
import { TransactionPeriodsService } from './transaction.periods.service';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly transactionPeriodService: TransactionPeriodsService,
  ) {}

  @EventPattern('transaction.created.v1')
  async transactionCreated(
    @Body(ValidationSchemaPipe<TransactionCreatedV1Event>)
    transactionCreatedV1Event: TransactionCreatedV1Event,
  ) {
    await this.transactionsService.create(transactionCreatedV1Event);
  }

  @EventPattern('transactionPeriod.created.v1')
  async transactionPeriodCreated(
    @Body(ValidationSchemaPipe<TransactionPeriodCreatedV1Event>)
    dto: TransactionPeriodCreatedV1Event,
  ) {
    await this.transactionPeriodService.create(dto);
  }
}
