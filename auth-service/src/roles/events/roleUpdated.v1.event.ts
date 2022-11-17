import { JSONSchemaType } from 'ajv';

export class RoleUpdatedV1Event {
  public static EVENT_NAME = 'roleUpdated';
  public static VERSION = 1;

  constructor(
    public readonly id: number,
    public readonly name: string,
  ) {}
}

export const RoleUpdatedV1EventSchema: JSONSchemaType<RoleUpdatedV1Event> = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
  },
  required: ['id', 'name'],
};
