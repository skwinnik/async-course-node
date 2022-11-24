import { JSONSchemaType } from 'ajv';

export class TaskPriceCreatedV1Event {
  public static EVENT_NAME = 'task.priceCreated';
  public static VERSION = 1;

  constructor(
    public taskId: number,
    public fee: number,
    public reward: number,
  ) {}
}

export const TaskPriceCreatedV1EventSchema: JSONSchemaType<TaskPriceCreatedV1Event> =
  {
    type: 'object',
    properties: {
      taskId: { type: 'number' },
      fee: { type: 'number' },
      reward: { type: 'number' },
    },
    required: ['taskId', 'fee', 'reward'],
  };
