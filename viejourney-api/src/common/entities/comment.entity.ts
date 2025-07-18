import { Types } from 'mongoose';
import { Document } from 'mongoose';
import { Blog } from './blog.entity';
import { UserInfos } from './userInfos.entity';
export class Comment extends Document {
  blogId: Blog | Types.ObjectId;
  parentId?: Comment | null;
  content: string;
  commentBy: UserInfos;
  replies?: Types.ObjectId[];
  totalReplies: number;
  totalChildren: number;
  likes: Types.ObjectId[];
  edited?: boolean;
  editedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
