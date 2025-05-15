import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true, // Automatically adds createdAt and updatedAt
  versionKey: false, // Removes the __v field
})
class RegistrationToken extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ type: Date, default: null })
  confirmedAt: Date | null;
}

export const RegistrationTokenSchema =
  SchemaFactory.createForClass(RegistrationToken);
