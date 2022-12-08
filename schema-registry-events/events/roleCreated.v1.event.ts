import { JSONSchemaType } from 'ajv';

export class RoleCreatedV1Event {
  public static EVENT_NAME = 'role.created';
  public static VERSION = 1;

  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly version: number,
  ) {}
}

export const RoleCreatedV1EventSchema: JSONSchemaType<RoleCreatedV1Event> = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    version: { type: 'number' },
  },
  required: ['id', 'name', 'version'],
};
