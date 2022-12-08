export class TransactionDto {
  constructor(
    public id: number,
    public transaction_period_id: number,
    public user_id: number,
    public description: string,
    public created_at: string,
    public credit: number,
    public debit: number,
    public taskId?: number
  ) {}
}
