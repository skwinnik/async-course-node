import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SchemaRegistry } from '@skwinnik/schema-registry-client/registry.class';
import { Sequelize } from 'sequelize-typescript';
import { Outbox } from 'src/db/models/outbox';
import { RolesService } from 'src/roles/roles.service';
import { UsersService } from 'src/users/users.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { TaskAssignedV1Event } from './events/taskAssigned.v1.event';
import { TaskCreatedV1Event } from './events/taskCreated.v1.event';

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
        },
        transactionHost,
      );

      if (!task) throw new Error('Task is null');

      const event = new TaskCreatedV1Event(task.id, task.name);
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

  findAll() {
    return this.taskModel.findAll();
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
