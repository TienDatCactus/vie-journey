import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { UserInfos } from './userinfo.schema';
import { Trip } from './trip.schema';
import { Like } from './like.schema';

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
    type: {
      location: { type: String, default: null },
      placeId: { type: String, default: null },
    },
    default: null,
    required: false,
    _id: false,
  })
  destination: {
    location: string | null;
    placeId: string | null;
  };

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
  })
  metrics: {
    viewCount: number;
    likeCount: number;
    commentCount: number;
  };
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
