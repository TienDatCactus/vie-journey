import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  versionKey: false, // Removes the __v field
})
class Account extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({})
  password: string;
  @Prop({ default: 'USER', enum: ['USER', 'ADMIN', 'MANAGER'] })
  role: string;

  @Prop({ default: false })
  active: boolean;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
