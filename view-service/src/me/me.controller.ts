import { Body, Controller, Get, Param } from '@nestjs/common';
import { MeService } from './me.service';
import { Cron } from '@nestjs/schedule';
import { EventPattern } from '@nestjs/microservices';
import { ValidationSchemaPipe } from 'src/pipes/validationSchema.pipe';
import {
  TransactionCreatedV1Event,
  UserCreatedV1Event,
} from '@skwinnik/schema-registry-events';
import { ApiParam } from '@nestjs/swagger';

@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get('/:userId')
  @ApiParam({ name: 'userId', type: 'number' })
  async get(@Param('userId') userId: number) {
    return this.meService.get(userId);
  }

  @Cron('0 */10 * * * *') // every 10 minutes
  async rebuild() {
    await this.meService.rebuild();
  }

  @EventPattern('user.created.v1')
  async onUserCreatedV1(
    @Body(ValidationSchemaPipe<UserCreatedV1Event>) event: UserCreatedV1Event,
  ) {
    await this.meService.onUserUpdated(event.id, {
      name: event.name,
      version: event.version,
    });
  }

  @EventPattern('transaction.created.v1')
  async onTransactionCreatedV1(
    @Body(ValidationSchemaPipe<TransactionCreatedV1Event>)
    event: TransactionCreatedV1Event,
  ) {
    await this.meService.onTransactionCreated(event.userId, {
      id: event.id,
      transaction_period_id: event.transactionPeriodId,
      created_at: event.createdAt,
      description: event.description,
      credit: event.credit,
      debit: event.debit,
    });
  }
}
