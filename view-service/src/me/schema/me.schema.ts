import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Task } from 'src/task/schema/task.schema';
import { Transaction } from 'src/transaction/schema/transaction.schema';

export type MeDocument = HydratedDocument<Me>;

@Schema({
  optimisticConcurrency: true,
})
export class Me {
  @Prop()
  user_id: number;

  @Prop()
  user_name: string;

  @Prop()
  user_version: number;

  @Prop()
  tasks_preview: Task[];

  @Prop()
  transactions_preview: Transaction[];

  @Prop()
  updated_at: Date;
}

export const MeSchema = SchemaFactory.createForClass(Me);
