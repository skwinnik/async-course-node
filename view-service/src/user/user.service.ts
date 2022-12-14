import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(id: number, name: string, version: number) {
    const user = await this.userModel.create({ id, name, version });
    await user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
