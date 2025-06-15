import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  versionKey: false,
  timestamps: true,
})
export class Trip extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  destination: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  budgetRange: string;
  tripmateRange: string;
  description: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: string;

  @Prop({ default: 0 })
  visibility: boolean;

  @Prop({ type: [String], default: [] })
  tripmates: string[];
}

export const TripSchema = SchemaFactory.createForClass(Trip);
