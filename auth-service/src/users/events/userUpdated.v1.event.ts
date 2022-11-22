import { JSONSchemaType } from 'ajv';

export class UserUpdatedV1Event {
  public static EVENT_NAME = 'userUpdated';
  public static VERSION = 1;

  constructor(
    public readonly id: number,
    public readonly roleId: number,
    public readonly name: string,
  ) {}
}

export const UserUpdatedV1EventSchema: JSONSchemaType<UserUpdatedV1Event> = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    roleId: { type: 'number' },
    name: { type: 'string' },
  },
  required: ['id', 'roleId', 'name'],
};