import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPageRequest } from 'src/common/page.request';
import { IPageResponse } from 'src/common/page.response';
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

  async findAll(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  async find(
    request: { userId: number } & IPageRequest,
  ): Promise<IPageResponse<Task>> {
    const total = await this.taskModel
      .find({ user_id: request.userId })
      .countDocuments();
    const data = await this.taskModel
      .find({ user_id: request.userId })
      .sort({
        [request.sort.by]: request.sort.order,
      })
      .skip(request.offset)
      .limit(request.limit)
      .exec();

    return {
      total,
      data,
    };
  }
}
