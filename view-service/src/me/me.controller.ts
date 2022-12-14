import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { MeService } from './me.service';
import { Cron } from '@nestjs/schedule';
import { EventPattern } from '@nestjs/microservices';
import { ValidationSchemaPipe } from 'src/pipes/validationSchema.pipe';
import {
  TaskCreatedV1Event,
  TaskUpdatedV1Event,
  TransactionCreatedV1Event,
  UserCreatedV1Event,
} from '@skwinnik/schema-registry-events';
import { ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Request } from 'express';
import { HasRoles } from 'src/auth/decorators/roles.decorator';

@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get('/:userId')
  @ApiParam({ name: 'userId', type: 'number' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('user')
  async get(@Param('userId', ParseIntPipe) userId: number, @Req() req: Request) {
    if (req.user?.id !== userId) throw new UnauthorizedException();
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

  @EventPattern('task.created.v1')
  async onTaskCreatedV1(
    @Body(ValidationSchemaPipe<TaskCreatedV1Event>)
    event: TaskCreatedV1Event,
  ) {
    await this.meService.onTaskCreated(event.userId, {
      id: event.id,
      name: event.name,
      status: event.status,
    });
  }

  @EventPattern('task.updated.v1')
  async onTaskUpdatedV1(
    @Body(ValidationSchemaPipe<TaskUpdatedV1Event>)
    event: TaskUpdatedV1Event,
  ) {
    await this.meService.onTaskUpdated(event.userId, {
      id: event.id,
      name: event.name,
      status: event.status,
    });
  }
}
