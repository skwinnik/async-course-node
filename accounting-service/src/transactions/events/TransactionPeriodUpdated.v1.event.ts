import { JSONSchemaType } from 'ajv';

export class TransactionPeriodUpdatedV1Event {
  public static EVENT_NAME = 'transactionPeriod.updated';
  public static VERSION = 1;

  constructor(
    public id: number,
    public startedAt: Date,
    public isOpen: boolean,
  ) {}
}

export const TransactionPeriodUpdatedV1EventSchema: JSONSchemaType<TransactionPeriodUpdatedV1Event> =
  {
    type: 'object',
    properties: {
      id: { type: 'number' },
      startedAt: { $ref: 'string', format: 'date-time' },
      isOpen: { type: 'boolean' },
    },
    required: ['id', 'startedAt', 'isOpen'],
  };
