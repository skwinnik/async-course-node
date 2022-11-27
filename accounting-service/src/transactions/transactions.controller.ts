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
import { EventPattern } from '@nestjs/microservices';
import { ValidationSchemaPipe } from 'src/pipes/validationSchema.pipe';
import {
  TaskCompletedV1Event,
  TaskAssignedV1Event,
} from '@skwinnik/schema-registry-events';
import { TransactionsService } from './transactions.service';
import { Request } from 'express';
import { TransactionDto } from './dto/transaction.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { HasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Public } from 'src/auth/guards/public.attribute';

@Controller('transactions')
@ApiTags('Transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @EventPattern('task.assigned.v1')
  @Public()
  async taskAssigned(
    @Body(ValidationSchemaPipe<TaskAssignedV1Event>)
    taskAssignedV1Event: TaskAssignedV1Event,
  ) {
    //TODO make idempotent
    await this.transactionsService.taskAssigned(
      taskAssignedV1Event.id,
      taskAssignedV1Event.userId,
    );
  }

  @EventPattern('task.completed.v1')
  @Public()
  async taskCompleted(
    @Body(ValidationSchemaPipe<TaskCompletedV1Event>)
    taskCompletedV1Event: TaskCompletedV1Event,
  ) {
    //TODO make idempotent
    await this.transactionsService.taskCompleted(
      taskCompletedV1Event.id,
      taskCompletedV1Event.userId,
    );
  }

  @Get('/all/:userId')
  @HasRoles('user')
  async getTransactions(
    @Req() req: Request,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    if (!req.user || req.user.id !== userId) throw new UnauthorizedException();

    return (
      await this.transactionsService.findAll({
        where: { userId: userId },
      })
    ).map((t) => new TransactionDto(t));
  }
}
