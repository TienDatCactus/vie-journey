import { Document, Types } from 'mongoose';
import { UserInfos } from './userInfos.entity';
import { Comment } from './comment.entity';

export class PlaceData {
  placeId: string;
  displayName: string;
  latitude?: number;
  longitude?: number;
  editorialSummary?: string;
  types?: string[];
  photos?: string[];
  googleMapsURI?: string;
  showDetails: boolean;
}

export class Blog extends Document {
  declare _id: string;
  title: string;
  slug?: string;
  content: string;
  summary?: string;
  tags?: string[];
  coverImage?: string;

  destination?: string | null;

  places?: PlaceData[];

  createdBy: UserInfos;
  updatedBy: UserInfos | Types.ObjectId;

  likes?: Types.ObjectId[];

  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';

  flags?: {
    userId: UserInfos | Types.ObjectId;
    reason: string;
    date: Date;
  }[];

  metrics?: {
    viewCount: number;
    likeCount: number;
    commentCount: number;
  };

  comments?: Comment[] | Types.ObjectId[];

  createdAt?: Date;
  updatedAt?: Date;
}
