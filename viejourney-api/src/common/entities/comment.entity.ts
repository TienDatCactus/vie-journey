import { Types } from 'mongoose';
import { Document } from 'mongoose';
import { Blog } from './blog.entity';
import { UserInfos } from './userInfos.entity';
export class Comment {
  blogId: Blog | Types.ObjectId;
  content: string;
  commentBy: UserInfos | Types.ObjectId;
  likes: Types.ObjectId[];
  edited?: boolean;
  editedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
