import { Body, Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import {
  TaskCreatedV1Event,
  TaskUpdatedV1Event,
} from '@skwinnik/schema-registry-events';
import { ValidationSchemaPipe } from 'src/pipes/validationSchema.pipe';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @EventPattern('task.created.v1')
  async createTask(
    @Body(ValidationSchemaPipe<TaskCreatedV1Event>)
    taskCreatedV1Event: TaskCreatedV1Event,
  ) {
    await this.taskService.create({
      id: taskCreatedV1Event.id,
      name: taskCreatedV1Event.name,
      status: taskCreatedV1Event.status,
      user_id: taskCreatedV1Event.userId,
    });
  }

  @EventPattern('task.updated.v1')
  async updateTask(
    @Body(ValidationSchemaPipe<TaskUpdatedV1Event>)
    taskUpdatedV1Event: TaskUpdatedV1Event,
  ) {
    await this.taskService.update({
      id: taskUpdatedV1Event.id,
      name: taskUpdatedV1Event.name,
      status: taskUpdatedV1Event.status,
      user_id: taskUpdatedV1Event.userId,
    });
  }
}
