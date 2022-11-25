import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SchemaRegistry } from '@skwinnik/schema-registry-client/dist/registry.class';
import { Sequelize } from 'sequelize-typescript';
import { Outbox } from 'src/db/models/outbox';
import { RolesService } from 'src/roles/roles.service';
import { UsersService } from 'src/users/users.service';
import { CompleteTaskDto } from './dto/complete-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task, TaskStatus } from './entities/task.entity';
import {
  TaskAssignedV1Event,
  TaskCompletedV1Event,
  TaskCreatedV1Event,
  TaskUpdatedV1Event,
} from '@skwinnik/schema-registry-events';
import { FindOptions } from 'sequelize';

@Injectable()
export class TasksService {
  constructor(
    private sequelize: Sequelize,
    private schemaRegistry: SchemaRegistry,
    private rolesService: RolesService,
    private usersSerivce: UsersService,
    @InjectModel(Task) private taskModel: typeof Task,
    @InjectModel(Outbox) private outboxModel: typeof Outbox,
  ) {}
  async create(createTaskDto: CreateTaskDto) {
    return this.sequelize.transaction(async (t) => {
      const transactionHost = { transaction: t };
      const task = await this.taskModel.create(
        {
          name: createTaskDto.name,
          userId: (await this.getRandomUser()).id,
          taskStatus: TaskStatus.ASSIGNED,
        },
        transactionHost,
      );

      if (!task) throw new Error('Task is null');

      const event = new TaskCreatedV1Event(
        task.id,
        task.userId,
        task.name,
        task.taskStatus,
      );
      const payload = await this.schemaRegistry.serialize(
        TaskCreatedV1Event.EVENT_NAME,
        TaskCreatedV1Event.VERSION,
        event,
      );

      await this.outboxModel.create(
        {
          eventName: TaskCreatedV1Event.EVENT_NAME,
          eventVersion: TaskCreatedV1Event.VERSION,
          payload,
        },
        transactionHost,
      );

      const assignedEvent = new TaskAssignedV1Event(task.id, task.userId);
      const assignedPayload = await this.schemaRegistry.serialize(
        TaskAssignedV1Event.EVENT_NAME,
        TaskAssignedV1Event.VERSION,
        assignedEvent,
      );

      await this.outboxModel.create(
        {
          eventName: TaskAssignedV1Event.EVENT_NAME,
          eventVersion: TaskAssignedV1Event.VERSION,
          payload: assignedPayload,
        },
        transactionHost,
      );

      return task;
    });
  }

  async complete(completeTaskDto: CompleteTaskDto, userId: number) {
    return this.sequelize.transaction(async (t) => {
      const transactionHost = { transaction: t };
      const task = await this.taskModel.findOne({
        where: { id: completeTaskDto.id },
        ...transactionHost,
      });

      if (!task) throw new Error('Task is null');
      if (task.userId !== userId)
        throw new UnauthorizedException("You can't complete this task");
      if (task.taskStatus === TaskStatus.COMPLETED)
        throw new Error('Task is already completed');

      task.taskStatus = TaskStatus.COMPLETED;
      const savedTask = await task.save(transactionHost);

      if (!savedTask) throw new Error('Saved task is null');

      const event = new TaskUpdatedV1Event(
        task.id,
        task.userId,
        task.name,
        task.taskStatus,
      );
      const payload = await this.schemaRegistry.serialize(
        TaskCreatedV1Event.EVENT_NAME,
        TaskCreatedV1Event.VERSION,
        event,
      );

      await this.outboxModel.create(
        {
          eventName: TaskUpdatedV1Event.EVENT_NAME,
          eventVersion: TaskUpdatedV1Event.VERSION,
          payload: payload,
        },
        transactionHost,
      );

      const completedEvent = new TaskCompletedV1Event(
        savedTask.id,
        savedTask.userId,
      );
      const completedPayload = await this.schemaRegistry.serialize(
        TaskCompletedV1Event.EVENT_NAME,
        TaskCompletedV1Event.VERSION,
        completedEvent,
      );

      await this.outboxModel.create(
        {
          eventName: TaskCompletedV1Event.EVENT_NAME,
          eventVersion: TaskCompletedV1Event.VERSION,
          payload: completedPayload,
        },
        transactionHost,
      );
    });
  }

  findAll(options: FindOptions<Task>) {
    return this.taskModel.findAll(options);
  }

  findOne(id: number) {
    return this.taskModel.findOne({ where: { id } });
  }

  private async getRandomUser() {
    const role = await this.rolesService.findOneByName('user');
    if (!role) throw new Error('Role is null');
    const users = await this.usersSerivce.findAll({
      where: {
        roleId: role.id,
      },
    });
    if (users.length === 0) throw new Error('Users is empty');

    const randomIndex = Math.floor(Math.random() * users.length);
    return users[randomIndex];
  }
}
