import { JSONSchemaType } from 'ajv';

export class RoleDeletedV1Event {
  public static EVENT_NAME = 'roleDeleted';
  public static VERSION = 1;

  constructor(
    public readonly id: number,
  ) {}
}

export const RoleDeletedV1EventSchema: JSONSchemaType<RoleDeletedV1Event> = {
  type: 'object',
  properties: {
    id: { type: 'number' },
  },
  required: ['id'],
};
