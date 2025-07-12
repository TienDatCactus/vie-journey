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

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Comment', default: null })
  parentId: mongoose.Types.ObjectId | null; // Nếu là reply thì sẽ có parentId

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'UserInfos', required: true })
  commentBy: UserInfos;

  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
    default: [],
  })
  replies: Comment[]; // Mảng chứa các reply (nếu cần truy vấn nhanh)

  @Prop({ type: Number, default: 0 })
  totalReplies: number; // Số lượng reply trực tiếp

  @Prop({ type: Number, default: 0 })
  totalChildren: number; // Tổng số reply (bao gồm reply của reply, dùng cho hiển thị như Facebook)

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
