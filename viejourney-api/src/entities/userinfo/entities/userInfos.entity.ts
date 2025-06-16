import mongoose from 'mongoose';
import { Asset } from '../../account/entities/asset.entity';

export class UserInfos {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  fullName: string;
  dob: Date;
  phone: string;
  address: string;
  avatar: Asset;
  lastLoginAt: Date;
  flaggedCount: number;
  banReason: string | null;
  bannedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  location: string;
  format: string;
  file_size: string;
  dimensions: string;
}
