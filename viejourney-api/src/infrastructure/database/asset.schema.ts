import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Asset extends Document {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'Account', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ enum: ['AVATAR', 'BANNER', 'CONTENT'], required: true })
  type: string;

  @Prop({ required: false })
  subsection: string;

  @Prop({ enum: ['SYSTEM', 'USER'], required: true, default: 'USER' })
  assetOwner: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  publicId: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  format: string;

  @Prop({ required: true })
  file_size: string;

  @Prop({ required: true })
  dimensions: string;
}

export const AssetSchema = SchemaFactory.createForClass(Asset);
