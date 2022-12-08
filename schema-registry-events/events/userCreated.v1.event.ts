import { JSONSchemaType } from 'ajv';

export class UserCreatedV1Event {
  public static EVENT_NAME = 'user.created';
  public static VERSION = 1;

  constructor(
    public readonly id: number,
    public readonly roleId: number,
    public readonly name: string,
    public readonly version: number,
  ) {}
}

export const UserCreatedV1EventSchema: JSONSchemaType<UserCreatedV1Event> = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    roleId: { type: 'number' },
    name: { type: 'string' },
    version: { type: 'number' },
  },
  required: ['id', 'roleId', 'name', 'version'],
};