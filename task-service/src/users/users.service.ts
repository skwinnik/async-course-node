import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private sequelize: Sequelize,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  async findAll(options: FindOptions<User>): Promise<User[]> {
    return this.userModel.findAll(options);
  }

  async findOne(id: number): Promise<User | null> {
    return this.userModel.findOne({ where: { id } });
  }

  async findOneByName(name: string): Promise<User | null> {
    return this.userModel.findOne({ where: { name } });
  }

  async create(id: number, name: string, roleId: number): Promise<User | null> {
    try {
      return await this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };

        const user = await this.userModel.create(
          {
            id,
            name,
            roleId,
          },
          transactionHost,
        );

        return user;
      });
    } catch (e) {
      this.logger.error('create user error', e);
      return null;
    }
  }

  async delete(id: number): Promise<number | null> {
    try {
      return await this.sequelize.transaction(async (t) => {
        const deleted = await this.userModel.destroy({
          where: { id },
          transaction: t,
        });

        return deleted;
      });
    } catch (e) {
      this.logger.error('delete user error', e);
      return null;
    }
  }

  async update(
    id: number,
    name: string,
    roleId: number,
  ): Promise<number | null> {
    try {
      return await this.sequelize.transaction(async (t) => {
        const updated = await this.userModel.update(
          { name, roleName: roleId },
          { where: { id }, transaction: t },
        );

        return updated[0];
      });
    } catch (e) {
      this.logger.error('update user error', e);
      return null;
    }
  }
}
