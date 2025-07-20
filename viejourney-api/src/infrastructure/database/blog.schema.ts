import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { UserInfos } from './userinfo.schema';
import { Trip } from './trip.schema';
import { Like } from './like.schema';
@Schema({ _id: false })
export class PlaceData {
  @Prop({ required: true })
  placeId: string;

  @Prop({ required: true })
  displayName: string;

  @Prop({ required: false })
  latitude?: number;

  @Prop({ required: false })
  longitude?: number;

  @Prop({ required: false })
  editorialSummary?: string;

  @Prop({ type: [String], required: false })
  types?: string[];

  @Prop({ type: [String], required: false })
  photos?: string[];

  @Prop({ required: false })
  googleMapsURI?: string;

  @Prop({ required: false, default: false })
  showDetails: boolean;
}
const PlaceDataSchema = SchemaFactory.createForClass(PlaceData);

@Schema({
  versionKey: false,
  timestamps: true,
})
export class Blog extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false, index: true })
  slug: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: false })
  summary: string;

  @Prop({ type: [String], required: false }) // Optional tags like ["Japan", "Food", "Itinerary"]
  tags: string[];

  @Prop({ required: false }) // Cloudinary URL or asset reference
  coverImage: string;

  @Prop({
    type: String,
    default: null,
    required: false,
  })
  destination: string | null;

  @Prop({
    type: [PlaceDataSchema],
    required: false,
    default: [],
  })
  places: PlaceData[];

  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'UserInfos' })
  createdBy: UserInfos;

  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'UserInfos' })
  updatedBy: UserInfos;

  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: 'Like' }],
    required: false,
  }) // Array of Like IDs
  likes: Like[];

  @Prop({
    type: String,
    enum: ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED'],
    default: 'DRAFT',
  })
  status: string;

  @Prop({
    type: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'UserInfos',
          required: true,
        },
        reason: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    default: [],
    required: false,
  })
  flags: {
    userId: UserInfos | mongoose.Types.ObjectId;
    reason: string;
    date: Date;
  }[];

  @Prop({
    type: {
      viewCount: Number,
      likeCount: Number,
      commentCount: Number,
    },
    _id: false,
    required: false,
    default: {
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
    },
  })
  metrics: {
    viewCount: number;
    likeCount: number;
    commentCount: number;
  };
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
