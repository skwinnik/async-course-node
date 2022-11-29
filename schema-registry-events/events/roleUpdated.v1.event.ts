import { JSONSchemaType } from 'ajv';

export class RoleUpdatedV1Event {
  public static EVENT_NAME = 'role.updated';
  public static VERSION = 1;

  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly version: number,
  ) {}
}

export const RoleUpdatedV1EventSchema: JSONSchemaType<RoleUpdatedV1Event> = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    version: { type: 'number' },
  },
  required: ['id', 'name', 'version'],
};
