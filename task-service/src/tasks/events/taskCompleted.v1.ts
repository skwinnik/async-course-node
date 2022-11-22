import { JSONSchemaType } from 'ajv';

export class TaskCompletedV1Event {
  public static EVENT_NAME = 'task.completed';
  public static VERSION = 1;

  constructor(public readonly id: number, public readonly userId: number) {}
}

export const TaskCompletedV1EventSchema: JSONSchemaType<TaskCompletedV1Event> =
  {
    type: 'object',
    properties: {
      id: { type: 'number' },
      userId: { type: 'number' },
    },
    required: ['id', 'userId'],
  };
