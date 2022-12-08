import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { TransactionCreatedV1Event } from '@skwinnik/schema-registry-events';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { IPageRequest } from 'src/common/page.request';
import { ValidationSchemaPipe } from 'src/pipes/validationSchema.pipe';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('/all/')
  @UseGuards(JwtAuthGuard)
  async getAllTasks(@Body() request: { userId: number } & IPageRequest) {
    return this.transactionService.find(request);
  }

  @EventPattern('transaction.created.v1')
  async createV1(
    @Body(ValidationSchemaPipe<TransactionCreatedV1Event>)
    event: TransactionCreatedV1Event,
  ) {
    await this.transactionService.create({
      id: event.id,
      transaction_period_id: event.transactionPeriodId,
      user_id: event.userId,
      description: event.description,
      created_at: event.createdAt,
      credit: event.credit,
      debit: event.debit,
      task_id: event.taskId,
    });
  }
}
