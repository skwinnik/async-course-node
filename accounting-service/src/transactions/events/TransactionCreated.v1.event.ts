import { JSONSchemaType } from 'ajv';

export class TransactionCreatedV1Event {
  public static EVENT_NAME = 'transaction.created';
  public static VERSION = 1;

  constructor(
    public id: number,
    public transactionPeriodId: number,
    public userId: number,
    public description: string,
    public createdAt: string | Date,
    public credit: number,
    public debit: number,
    public taskId?: number,
  ) {
    if (this.createdAt instanceof Date)
      this.createdAt = this.createdAt.toISOString();
  }
}

export const TransactionCreatedV1EventSchema: JSONSchemaType<TransactionCreatedV1Event> =
  {
    type: 'object',
    properties: {
      id: { type: 'number' },
      transactionPeriodId: { type: 'number' },
      userId: { type: 'number' },
      description: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' },
      credit: { type: 'number' },
      debit: { type: 'number' },
      taskId: { type: 'number', nullable: true },
    },
    required: [
      'id',
      'transactionPeriodId',
      'userId',
      'description',
      'createdAt',
      'credit',
      'debit',
    ],
  };
