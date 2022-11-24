import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Task, TaskStatus } from './entities/task.entity';
import { TaskCreatedV1Event } from './events/taskCreated.v1.event';
import { TaskUpdatedV1Event } from './events/taskUpdated.v1.event';

@Injectable()
export class TasksService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(Task) private taskModel: typeof Task,
  ) {}
  async create(createTaskDto: TaskCreatedV1Event) {
    return this.sequelize.transaction(async (t) => {
      const transactionHost = { transaction: t };
      const task = await this.taskModel.create(
        {
          id: createTaskDto.id,
          name: createTaskDto.name,
          userId: createTaskDto.userId,
          taskStatus: createTaskDto.status,
        },
        transactionHost,
      );

      return task;
    });
  }

  async update(updateTaskDto: TaskUpdatedV1Event) {
    return this.sequelize.transaction(async (t) => {
      const transactionHost = { transaction: t };
      const task = await this.taskModel.findOne({
        where: { id: updateTaskDto.id },
        ...transactionHost,
      });

      if (!task) throw new Error('Task is null');

      task.name = updateTaskDto.name;
      task.userId = updateTaskDto.userId;
      task.taskStatus = updateTaskDto.status as TaskStatus;

      await task.save(transactionHost);
    });
  }

  findAll() {
    return this.taskModel.findAll();
  }

  findOne(id: number) {
    return this.taskModel.findOne({ where: { id } });
  }
}
