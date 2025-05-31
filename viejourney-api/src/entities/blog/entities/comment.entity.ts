import { Document } from 'mongoose';

export class Comment extends Document {
  declare _id: string;
  content: string;
  createdBy: string;
  updatedBy: string;
  blog_id: string;
  createdAt: Date;
  updatedAt: Date;
}