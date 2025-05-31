import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  versionKey: false,
})
export class Blog extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  updatedBy: string;

  @Prop({ default: 0 })
  likes: boolean;

  @Prop({ default: 0 })
  views: boolean;
  
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Comment' })
  comments: Comment[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);