import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from 'src/db/models/role';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private roleModel: typeof Role) {}

  async findAll(): Promise<Role[]> {
    return this.roleModel.findAll();
  }

  async findOne(id: number): Promise<Role | null> {
    return this.roleModel.findOne({ where: { id } });
  }

  async create(name: string) {
    return this.roleModel.create({ name });
  }
}
