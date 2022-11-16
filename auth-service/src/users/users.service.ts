import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/db/models/user';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findOne(id: number): Promise<User | null> {
    return this.userModel.findOne({ where: { id } });
  }

  async create(name: string, password: string, roleId: number): Promise<User> {
    return this.userModel.create({ name, password, roleId });
  }

  async delete(id: number) {
    return this.userModel.destroy({ where: { id } });
  }

  async update(id: number, name: string, password: string, roleId: number) {
    return this.userModel.update({ name, password, roleId }, { where: { id } });
  }
}
