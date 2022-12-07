import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schema/task.schema';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create({
    id,
    name,
    status,
    user_id,
  }: {
    id: number;
    name: string;
    status: string;
    user_id: number;
  }) {
    const task = await this.taskModel.create({
      id,
      name,
      status,
      user_id,
    });
    await task.save();
  }

  async update({
    id,
    name,
    status,
    user_id,
  }: {
    id: number;
    name: string;
    status: string;
    user_id: number;
  }) {
    const task = await this.taskModel.findOne({
      id,
    });
    if (task) {
      task.name = name;
      task.status = status;
      task.user_id = user_id;
      await task.save();
    }
  }
}
