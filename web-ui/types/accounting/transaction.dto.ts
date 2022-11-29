export class TransactionDto {
  constructor(
    public id: number,
    public transactionPeriodId: number,
    public userId: number,
    public description: string,
    public createdAt: string,
    public credit: number,
    public debit: number,
    public taskId?: number
  ) {}
}
