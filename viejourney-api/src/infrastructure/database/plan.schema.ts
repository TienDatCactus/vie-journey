import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class TripPlan extends Document {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'Trip', required: true })
  tripId: mongoose.Types.ObjectId;
}

export const AssetSchema = SchemaFactory.createForClass(TripPlan);
