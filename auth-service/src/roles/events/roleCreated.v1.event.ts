import { JSONSchemaType } from 'ajv';

export class RoleCreatedV1Event {
  public static EVENT_NAME = 'roleCreated';
  public static VERSION = 1;

  constructor(
    public readonly id: number,
    public readonly name: string,
  ) {}
}

export const RoleCreatedV1EventSchema: JSONSchemaType<RoleCreatedV1Event> = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
  },
  required: ['id', 'name'],
};
