import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({
    required: true,
    unique: true,
  })
  id: number;

  @Prop()
  name: string;

  @Prop()
  status: string;

  @Prop()
  user_id: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
