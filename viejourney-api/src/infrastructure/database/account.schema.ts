import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export
@Schema({
  versionKey: false, // Removes the __v field
  timestamps: true,
})
class Account extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({})
  password: string;

  @Prop({ default: 'USER', enum: ['USER', 'ADMIN', 'MANAGER'] })
  role: string;

  @Prop({ default: 'INACTIVE', enum: ['ACTIVE', 'INACTIVE', 'BANNED'] })
  status: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
