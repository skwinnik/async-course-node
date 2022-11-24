import { Controller, Body } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ValidationSchemaPipe } from 'src/pipes/validationSchema.pipe';
import { TaskCreatedV1Event, TaskUpdatedV1Event } from '@skwinnik/schema-registry-events';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @EventPattern('task.created.v1')
  async createTask(
    @Body(ValidationSchemaPipe<TaskCreatedV1Event>)
    taskCreatedV1Event: TaskCreatedV1Event,
  ) {
    await this.tasksService.create(taskCreatedV1Event);
  }

  @EventPattern('task.updated.v1')
  async updateTask(
    @Body(ValidationSchemaPipe<TaskUpdatedV1Event>)
    taskUpdatedV1Event: TaskUpdatedV1Event,
  ) {
    await this.tasksService.update(taskUpdatedV1Event);
  }
}
