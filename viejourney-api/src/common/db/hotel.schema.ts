import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

class Coordinate {
    @Prop({ required: true })
    latitude: number;

    @Prop({ required: true })
    longitude: number;
}

@Schema({
    versionKey: false,
})
export class Hotel extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    rating: number;

    @Prop({ required: true })
    address: string;

    @Prop({ type: Coordinate, required: true })
    coordinate: Coordinate;

    @Prop({ required: true, type: [String] })
    image: string[];
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);