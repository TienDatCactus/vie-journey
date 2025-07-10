import { Document } from 'mongoose';

export class Trip extends Document {
  declare _id: string;
  title: string;
  destination: {
    id: string;
    name: string;
    location: {
      lat: number;
      lng: number;
    };
  };
  startDate: Date;
  endDate: Date;
  createdBy: string;
  budgetRange: string;
  tripmateRange: string;
  description: string;
  visibility: boolean;
  tripmates: string[];
}
