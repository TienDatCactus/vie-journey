import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Asset } from './asset.schema';


@Schema({ 
    timestamps: true,
    versionKey: false, // Removes the __v field
 })
export class UserInfos extends Document {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'Account', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ trim: true, maxLength: 100 })
  fullName: string;

  @Prop({ trim: true,  required: true})
  dob: Date;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Asset' })
  avatar: Asset;
}

export const UserInfosSchema = SchemaFactory.createForClass(UserInfos);
