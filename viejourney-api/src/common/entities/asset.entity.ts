import mongoose, { ObjectId } from 'mongoose';
import { AssetType } from '../enums/asset-type.enum';

export class Asset {
  _id: ObjectId;
  userId: ObjectId;
  type: AssetType;
  subsection?: string;
  assetOwner: String;
  url: string;
  publicId: string;
  location: string;
  format: string;
  file_size: string;
  dimensions: string;
}
