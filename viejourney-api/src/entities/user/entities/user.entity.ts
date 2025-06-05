import { Document, Types } from 'mongoose';

export class User extends Document {
  declare _id: string;
  userId: Types.ObjectId;
  fullName: string;
  dob: Date;
  phone: string;
  address: string;
  avatar: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}