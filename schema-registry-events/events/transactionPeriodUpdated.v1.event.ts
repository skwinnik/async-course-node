import { JSONSchemaType } from 'ajv';

export class TransactionPeriodUpdatedV1Event {
  public static EVENT_NAME = 'transactionPeriod.updated';
  public static VERSION = 1;

  constructor(
    public id: number,
    public startedAt: string | Date,
    public isOpen: boolean,
    public version: number,
  ) {
    if (this.startedAt instanceof Date)
      this.startedAt = this.startedAt.toISOString();
  }
}

export const TransactionPeriodUpdatedV1EventSchema: JSONSchemaType<TransactionPeriodUpdatedV1Event> =
  {
    type: 'object',
    properties: {
      id: { type: 'number' },
      startedAt: { type: 'string', format: 'date-time' },
      isOpen: { type: 'boolean' },
      version: { type: 'number' },
    },
    required: ['id', 'startedAt', 'isOpen', 'version'],
  };
