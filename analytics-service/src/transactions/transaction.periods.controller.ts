import { Body, Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ValidationSchemaPipe } from 'src/pipes/validationSchema.pipe';
import { TransactionPeriodCreatedV1Event } from '@skwinnik/schema-registry-events';
import { TransactionPeriodsService } from './transaction.periods.service';

@Controller('transactionPeriods')
export class TransactionPeriodsController {
  constructor(
    private readonly transactionPeriodsService: TransactionPeriodsService,
  ) {}

  @EventPattern('transactionPeriod.created.v1')
  async taskAssigned(
    @Body(ValidationSchemaPipe<TransactionPeriodCreatedV1Event>)
    dto: TransactionPeriodCreatedV1Event,
  ) {
    await this.transactionPeriodsService.create(dto);
  }
}
