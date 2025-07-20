import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { UserInfos } from './userinfo.schema';

@Schema({
  versionKey: false,
  timestamps: true,
})
export class Trip extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: Object })
  destination: {
    id: string;
    name: string;
    location: {
      lat: number;
      lng: number;
    };
  };

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'Asset' })
  coverImage?: ObjectId;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  budgetRange: string;
  tripmateRange: string;
  description: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserInfos',
  })
  createdBy: UserInfos | ObjectId;

  @Prop({ default: 0 })
  visibility: boolean;

  @Prop({ type: [String], default: [] })
  tripmates: string[];
}

export const TripSchema = SchemaFactory.createForClass(Trip);
