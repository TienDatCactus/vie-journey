import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { UserInfos } from './userinfo.schema';
import { Blog } from './blog.schema';

@Schema({
  versionKey: false,
  timestamps: true,
})
export class Like extends Document {
  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'UserInfos' })
  userId: UserInfos;

  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'Blog' })
  blogId: Blog;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

// Đảm bảo unique index cho userId + blogId
LikeSchema.index({ userId: 1, blogId: 1 }, { unique: true });
