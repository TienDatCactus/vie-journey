import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { UserInfos } from './userinfo.schema';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Comment extends Document {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'Blog', required: true })
  blogId: mongoose.Types.ObjectId;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'UserInfos', required: true })
  commentBy: UserInfos;

  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: 'UserInfos' }],
    default: [],
  })
  likes: UserInfos[]; // Người đã like comment này

  @Prop({ type: Boolean, default: false })
  edited: boolean;

  @Prop({ type: Date, default: null })
  editedAt: Date | null;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
