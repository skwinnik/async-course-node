import { JSONSchemaType } from 'ajv';

export class TransactionPeriodCreatedV1Event {
  public static EVENT_NAME = 'transactionPeriod.created';
  public static VERSION = 1;

  constructor(
    public id: number,
    public startedAt: Date,
    public isOpen: boolean,
  ) {}
}

export const TransactionPeriodCreatedV1EventSchema: JSONSchemaType<TransactionPeriodCreatedV1Event> =
  {
    type: 'object',
    properties: {
      id: { type: 'number' },
      startedAt: { $ref: 'string', format: 'date-time' },
      isOpen: { type: 'boolean' },
    },
    required: ['id', 'startedAt', 'isOpen'],
  };
