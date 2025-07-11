import { Types } from 'mongoose';
import { Document } from 'mongoose';
import { UserInfos } from './userInfos.entity';
import { Blog } from './blog.entity';

export class Like extends Document {
  userId: UserInfos;
  blogId: Blog;
}
