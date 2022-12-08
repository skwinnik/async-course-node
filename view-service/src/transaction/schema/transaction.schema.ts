import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema()
export class Transaction {
  @Prop({
    required: true,
    unique: true,
  })
  id: number;

  @Prop()
  transaction_period_id: number;

  @Prop()
  user_id: number;

  @Prop()
  description: string;

  @Prop()
  created_at: Date;

  @Prop()
  credit: number;

  @Prop()
  debit: number;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
