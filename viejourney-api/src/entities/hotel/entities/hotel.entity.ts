import { Document } from 'mongoose';

export class Hotel extends Document {
  declare _id: string;
  name: string;
  description: string;
  rating: number;
  address: string;
  latitude: number;
  longitude: number;
  images: string[];
}