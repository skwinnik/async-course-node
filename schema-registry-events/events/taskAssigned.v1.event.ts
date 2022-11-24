import { JSONSchemaType } from 'ajv';

export class TaskAssignedV1Event {
  public static EVENT_NAME = 'task.assigned';
  public static VERSION = 1;

  constructor(public readonly id: number, public readonly userId: number) {}
}

export const TaskAssignedV1EventSchema: JSONSchemaType<TaskAssignedV1Event> = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    userId: { type: 'number' },
  },
  required: ['id', 'userId'],
};
