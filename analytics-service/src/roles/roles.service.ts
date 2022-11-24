import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);
  constructor(
    private sequelize: Sequelize,
    @InjectModel(Role) private rolesModel: typeof Role,
  ) {}

  async findAll(options: FindOptions<Role>): Promise<Role[]> {
    return this.rolesModel.findAll(options);
  }

  async findOne(id: number): Promise<Role | null> {
    return this.rolesModel.findOne({ where: { id } });
  }

  async findOneByName(name: string): Promise<Role | null> {
    return this.rolesModel.findOne({ where: { name } });
  }

  async create(id: number, name: string): Promise<Role | null> {
    try {
      return await this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };

        const user = await this.rolesModel.create(
          {
            id,
            name,
          },
          transactionHost,
        );

        return user;
      });
    } catch (e) {
      this.logger.error('create role error', e);
      return null;
    }
  }

  async delete(id: number): Promise<number | null> {
    try {
      return await this.sequelize.transaction(async (t) => {
        const deleted = await this.rolesModel.destroy({
          where: { id },
          transaction: t,
        });

        return deleted;
      });
    } catch (e) {
      this.logger.error('delete role error', e);
      return null;
    }
  }

  async update(id: number, name: string): Promise<number | null> {
    try {
      return await this.sequelize.transaction(async (t) => {
        const updated = await this.rolesModel.update(
          { name },
          { where: { id }, transaction: t },
        );

        return updated[0];
      });
    } catch (e) {
      this.logger.error('update role error', e);
      return null;
    }
  }
}
