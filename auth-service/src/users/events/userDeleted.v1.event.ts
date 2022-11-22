import { JSONSchemaType } from 'ajv';

export class UserDeletedV1Event {
  public static EVENT_NAME = 'user.deleted';
  public static VERSION = 1;

  constructor(
    public readonly id: number,
  ) {}
}

export const UserDeletedV1EventSchema: JSONSchemaType<UserDeletedV1Event> = {
  type: 'object',
  properties: {
    id: { type: 'number' },
  },
  required: ['id'],
};