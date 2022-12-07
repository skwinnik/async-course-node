import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    required: true,
    unique: true,
  })
  id: number;

  @Prop()
  name: string;

  @Prop()
  version: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
