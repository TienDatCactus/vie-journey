import { Document } from 'mongoose';
import { Comment } from './comment.entity';

export class Blog extends Document {
  declare _id: string;
  title: string;
  content: string;
  createdBy: string;
  updatedBy: string;
  likes: number;
  views: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}