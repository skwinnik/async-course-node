import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SchemaRegistry } from '@skwinnik/schema-registry-client/dist/registry.class';
import { Sequelize } from 'sequelize-typescript';
import { Outbox } from 'src/db/models/outbox';
import { User } from 'src/db/models/user';
import {
  UserCreatedV1Event,
  UserDeletedV1Event,
  UserUpdatedV1Event,
} from '@skwinnik/schema-registry-events';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private sequelize: Sequelize,
    private schemaRegistry: SchemaRegistry,
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Outbox) private outboxModel: typeof Outbox,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findOne(id: number): Promise<User | null> {
    return this.userModel.findOne({ where: { id } });
  }

  async findOneByName(name: string): Promise<User | null> {
    return this.userModel.findOne({ where: { name } });
  }

  async create(
    name: string,
    password: string,
    roleId: number,
  ): Promise<User | null> {
    try {
      return await this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };

        const user = await this.userModel.create(
          {
            name,
            passwordHash: await bcrypt.hash(password, await bcrypt.genSalt(10)),
            roleId,
          },
          transactionHost,
        );
        const event = new UserCreatedV1Event(
          user.id,
          user.roleId,
          user.name,
          user.version,
        );
        const payload = await this.schemaRegistry.serialize(
          UserCreatedV1Event.EVENT_NAME,
          UserCreatedV1Event.VERSION,
          event,
        );
        await this.outboxModel.create(
          {
            eventName: UserCreatedV1Event.EVENT_NAME,
            eventVersion: UserCreatedV1Event.VERSION,
            payload,
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

        //nothing is deleted, skip event
        if (deleted === 0) return null;

        const event = new UserDeletedV1Event(id);
        const payload = await this.schemaRegistry.serialize(
          UserDeletedV1Event.EVENT_NAME,
          UserDeletedV1Event.VERSION,
          event,
        );
        await this.outboxModel.create(
          {
            eventName: UserDeletedV1Event.EVENT_NAME,
            eventVersion: UserDeletedV1Event.VERSION,
            payload,
          },
          { transaction: t },
        );

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
        let user = await this.userModel.findOne({ where: { id } });
        if (!user) return null;

        user.name = name;
        user.roleId = roleId;

        await user.save({
          transaction: t,
        });

        const event = new UserUpdatedV1Event(id, roleId, name, user!.version);
        const payload = await this.schemaRegistry.serialize(
          UserUpdatedV1Event.EVENT_NAME,
          UserUpdatedV1Event.VERSION,
          event,
        );
        await this.outboxModel.create(
          {
            eventName: UserUpdatedV1Event.EVENT_NAME,
            eventVersion: UserUpdatedV1Event.VERSION,
            payload,
          },
          { transaction: t },
        );

        return user.id;
      });
    } catch (e) {
      this.logger.error('update user error', e);
      return null;
    }
  }
}
