import { JSONSchemaType } from 'ajv';

export class TaskCreatedV1Event {
  public static EVENT_NAME = 'task.created';
  public static VERSION = 1;

  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly name: string,
    public readonly status: string,
    public readonly version: number,
  ) {}
}

export const TaskCreatedV1EventSchema: JSONSchemaType<TaskCreatedV1Event> = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    userId: { type: 'number' },
    name: { type: 'string' },
    status: { type: 'string' },
    version: { type: 'number' },
  },
  required: ['id', 'userId', 'name', 'status', 'version'],
};
