import { Body, Controller } from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext } from '@nestjs/microservices';
import { ValidationSchemaPipe } from 'src/pipes/validationSchema.pipe';
import { TaskAssignedV1Event } from 'src/tasks/events/taskAssigned.v1.event';
import { TaskCompletedV1Event } from 'src/tasks/events/taskCompleted.v1';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @EventPattern('task.assigned.v1')
  async taskAssigned(
    @Body(ValidationSchemaPipe<TaskAssignedV1Event>)
    taskAssignedV1Event: TaskAssignedV1Event,
    @Ctx() context: KafkaContext,
  ) {
    //TODO make idempotent
    await this.transactionsService.taskAssigned(
      taskAssignedV1Event.id,
      taskAssignedV1Event.userId,
    );
  }

  @EventPattern('task.completed.v1')
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
}
