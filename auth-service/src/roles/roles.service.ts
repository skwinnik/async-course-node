import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SchemaRegistry } from '@skwinnik/schema-registry-client/dist/registry.class';
import { Sequelize } from 'sequelize-typescript';
import { Outbox } from 'src/db/models/outbox';
import { Role } from 'src/db/models/role';
import {
  RoleCreatedV1Event,
  RoleDeletedV1Event,
  RoleUpdatedV1Event,
} from '@skwinnik/schema-registry-events';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);
  constructor(
    private sequelize: Sequelize,
    private schemaRegistry: SchemaRegistry,
    @InjectModel(Role) private roleModel: typeof Role,
    @InjectModel(Outbox) private outboxModel: typeof Outbox,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleModel.findAll();
  }

  async findOne(id: number): Promise<Role | null> {
    return this.roleModel.findOne({ where: { id } });
  }

  async create(name: string) {
    try {
      return await this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };

        const role = await this.roleModel.create({ name }, transactionHost);

        const event = new RoleCreatedV1Event(role.id, role.name);
        const payload = await this.schemaRegistry.serialize(
          RoleCreatedV1Event.EVENT_NAME,
          RoleCreatedV1Event.VERSION,
          event,
        );
        await this.outboxModel.create(
          {
            eventName: RoleCreatedV1Event.EVENT_NAME,
            eventVersion: RoleCreatedV1Event.VERSION,
            payload,
          },
          transactionHost,
        );

        return role;
      });
    } catch (e) {
      this.logger.error('create role error', e);
      return null;
    }
  }

  async delete(id: number): Promise<number | null> {
    try {
      return await this.sequelize.transaction(async (t) => {
        const deleted = await this.roleModel.destroy({
          where: { id },
          transaction: t,
        });

        //nothing is deleted, skip event
        if (deleted === 0) return null;

        const event = new RoleDeletedV1Event(id);
        const payload = await this.schemaRegistry.serialize(
          RoleDeletedV1Event.EVENT_NAME,
          RoleDeletedV1Event.VERSION,
          event,
        );
        await this.outboxModel.create(
          {
            eventName: RoleDeletedV1Event.EVENT_NAME,
            eventVersion: RoleDeletedV1Event.VERSION,
            payload,
          },
          { transaction: t },
        );

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
        const updated = await this.roleModel.update(
          { name },
          { where: { id }, transaction: t },
        );

        //nothing is updated, skip event
        if (updated[0] === 0) return null;

        const event = new RoleUpdatedV1Event(id, name);
        const payload = await this.schemaRegistry.serialize(
          RoleUpdatedV1Event.EVENT_NAME,
          RoleUpdatedV1Event.VERSION,
          event,
        );
        await this.outboxModel.create(
          {
            eventName: RoleUpdatedV1Event.EVENT_NAME,
            eventVersion: RoleUpdatedV1Event.VERSION,
            payload,
          },
          { transaction: t },
        );

        return updated[0];
      });
    } catch (e) {
      this.logger.error('update role error', e);
      return null;
    }
  }
}
