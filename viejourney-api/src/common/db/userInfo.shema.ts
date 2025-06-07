import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ 
    timestamps: true,
    versionKey: false,
 })
export class userInfo extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ trim: true, maxLength: 100 })
  fullName: string;

  @Prop({ trim: true,  required: true})
  dob: Date;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Asset' })
  avatar: mongoose.Types.ObjectId;
}

export const userInfoSchema = SchemaFactory.createForClass(userInfo);