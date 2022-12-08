import { JSONSchemaType } from 'ajv';

export class TransactionPeriodCreatedV1Event {
  public static EVENT_NAME = 'transactionPeriod.created';
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

export const TransactionPeriodCreatedV1EventSchema: JSONSchemaType<TransactionPeriodCreatedV1Event> =
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
