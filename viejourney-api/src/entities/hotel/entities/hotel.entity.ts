import { Document } from 'mongoose';

interface Coordinate {
  latitude: number;
  longitude: number;
}

export class Hotel extends Document {
  declare _id: string;
  name: string;
  description: string;
  rating: number;
  address: string;
  coordinate: Coordinate;
  images: string[];
}